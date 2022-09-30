import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
import * as reactRedux from 'react-redux';

configure({ adapter: new Adapter() });

/**
 * Emulate for component checks
 */
jest.mock('i18next', () => {
  const Test = function () { // eslint-disable-line
    this.use = () => this;
    this.init = () => Promise.resolve();
    this.changeLanguage = () => Promise.resolve();
  };
  return new Test();
});

/**
 * Emulate for component checks
 */
jest.mock('lodash/debounce', () => jest.fn);

/**
 * We currently use a wrapper for useSelector, emulate for component checks
 */
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

/**
 * Enzyme for components using hooks.
 *
 * @param {React.ReactNode} component
 * @param {object} options
 * @param {Function} options.callback
 * @param {object} options.options
 *
 * @returns {Promise<null>}
 */
global.mountHookComponent = async (component, { callback, ...options } = {}) => {
  let mountedComponent = null;
  await act(async () => {
    mountedComponent = mount(component, options);
  });
  mountedComponent?.update();

  if (typeof callback === 'function') {
    await act(async () => {
      await callback({ component: mountedComponent });
    });
    mountedComponent?.update();
  }

  return mountedComponent;
};

global.mountHookWrapper = global.mountHookComponent;

/**
 * Enzyme for components using hooks.
 *
 * @param {React.ReactNode} component
 * @param {object} options
 * @param {Function} options.callback
 * @param {object} options.options
 *
 * @returns {Promise<null>}
 */
global.shallowHookComponent = async (component, { callback, ...options } = {}) => {
  let mountedComponent = null;
  await act(async () => {
    mountedComponent = shallow(component, options);
  });
  mountedComponent?.update();

  if (typeof callback === 'function') {
    await act(async () => {
      await callback({ component: mountedComponent });
    });
    mountedComponent?.update();
  }

  return mountedComponent;
};

global.shallowHookWrapper = global.shallowHookComponent;

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @param {object} options
 * @param {object} options.state An object representing a mock Redux store's state.
 * @returns {*}
 */
global.mountHook = async (useHook = Function.prototype, { state } = {}) => {
  let result;
  let mountedHook;
  let spyUseSelector;
  const Hook = () => {
    result = useHook();
    return null;
  };
  await act(async () => {
    if (state) {
      spyUseSelector = jest.spyOn(reactRedux, 'useSelector').mockImplementation(_ => _(state));
    }
    mountedHook = mount(<Hook />);
  });
  mountedHook?.update();

  const unmount = async () => {
    await act(async () => mountedHook.unmount());
  };

  if (state) {
    spyUseSelector.mockClear();
  }

  return { unmount, result };
};

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @param {object} options
 * @param {object} options.state An object representing a mock Redux store's state.
 * @returns {*}
 */
global.shallowHook = (useHook = Function.prototype, { state } = {}) => {
  let result;
  let spyUseSelector;
  const Hook = () => {
    result = useHook();
    return null;
  };

  if (state) {
    spyUseSelector = jest.spyOn(reactRedux, 'useSelector').mockImplementation(_ => _(state));
  }

  const shallowHook = shallow(<Hook />);
  const unmount = () => shallowHook.unmount();

  if (state) {
    spyUseSelector.mockClear();
  }

  return { unmount, result };
};

/*
 * Apply invalid prop, failed prop checks.
 * jest-prop-type-error, https://www.npmjs.com/package/jest-prop-type-error
 */
beforeAll(() => {
  const { error } = console;

  console.error = (message, ...args) => {
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message);
    }

    error.apply(console, [message, ...args]);
  };
});
