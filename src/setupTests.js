import { configure, mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
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

/*
 * This is a temporary patch for applying a global Jest "beforeAll", based on
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
