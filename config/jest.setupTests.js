import React, { act } from 'react';
import { render, renderHook } from '@testing-library/react';
import { dotenv } from 'weldable';

/**
 * Set dotenv params.
 */
dotenv.setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

/**
 * Emulate i18next setup
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
 * Emulate for translation hook for snapshots
 */
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (...args) => `t(${JSON.stringify(args, null, 2)})` })
}));

/**
 * Emulate global for URL. A part of downloading files.
 */
global.URL.createObjectURL = jest.fn();

/**
 * Emulate for router-dom hooks
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  NavLink: (...args) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    const MockNavLink = (...props) => <a {...props} />;
    return <MockNavLink {...args} />;
  },
  useLocation: () => ({ pathname: '/' })
}));

/**
 * Quick React function component and hook results testing. Based off of classic Enzyme testing,
 * Use "shallowComponent" if
 * - the component is a function, class results may not be expected
 * - you want a quick component response typically determined by a condition
 * - snapshot size needs to be reduced
 * - the insanity of having a more complicated testing API than actual React components/hooks has finally gotten to you
 *
 * @param {React.ReactNode} testComponent
 * @returns {{unmount: () => void, getHTML: () => any, querySelector: () => any,
 *     querySelectorAll: () => any, setProps: () => Promise<any> } | any}
 */
export const shallowComponent = async testComponent => {
  const isOneOff = result => !result || typeof result === 'string' || typeof result === 'number';

  const localRenderFC = async (component, updatedProps) => {
    if (typeof component?.type === 'function') {
      try {
        let result;
        let unmount;

        const { result: reactTestingResult, unmount: reactTestingUnmount } = renderHook(() =>
          component.type({ ...component.props, ...updatedProps })
        );

        await act(async () => {
          result = await reactTestingResult;
        });

        unmount = reactTestingUnmount;

        if (isOneOff(result) || isOneOff(result.current)) {
          return result?.current;
        }

        if (typeof result.current === 'function') {
          return result.current.toString();
        }

        const getHTML = (sel, _internalRender = result.current) => {
          const { container } = render(_internalRender);
          return container.innerHTML;
        };

        const querySelector = (sel, _internalRender = result.current) => {
          try {
            const { container } = render(_internalRender);
            return container.querySelector(sel);
          } catch (e) {
            return null;
          }
        };

        const querySelectorAll = (sel, _internalRender = result.current) => {
          try {
            const { container } = render(_internalRender);
            return container.querySelectorAll(sel);
          } catch (e) {
            return null;
          }
        };

        const setProps = async p => localRenderFC(component, p);

        if (Array.isArray(result.current)) {
          const updatedR = result.current;
          updatedR.unmount = unmount;
          updatedR.getHTML = getHTML;
          updatedR.querySelector = querySelector;
          updatedR.querySelectorAll = querySelectorAll;
          updatedR.setProps = setProps;
          return updatedR;
        }

        return {
          ...result.current,
          unmount,
          getHTML,
          querySelector,
          querySelectorAll,
          setProps
        };
      } catch (e) {
        console.error(e.message);
      }
    }

    return component;
  };

  return localRenderFC(testComponent);
};
