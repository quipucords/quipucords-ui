import React from 'react';
import axios from 'axios';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AppToolbar as ViewToolbar } from '../viewLayoutToolbar';

describe('ViewToolbar', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: jest.fn(() => {
          localStorageMock = {};
        })
      },
      writable: true
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    // Mock document.getElementsByTagName
    Object.defineProperty(document, 'getElementsByTagName', {
      value: jest.fn(() => [
        {
          classList: {
            add: jest.fn(),
            remove: jest.fn()
          }
        }
      ]),
      writable: true
    });

    // Mock axios globally for this test suite
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: { username: 'Test User' } }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<ViewToolbar {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should attempt to load and display a username', async () => {
    const mockGetUser = jest.fn().mockResolvedValue('Dolor sit');
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser })
    };

    const component = await shallowComponent(<ViewToolbar {...props} />);
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(component.querySelector('.quipucords-toolbar__user-dropdown')).toMatchSnapshot('user');
  });

  it('should initialize dark theme from localStorage using environment variable', async () => {
    // Set up localStorage to return 'dark' theme using the env variable key
    localStorageMock['discovery-ui-theme'] = 'dark';

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const mockApiCall = jest.fn().mockResolvedValue(undefined);
    const mockCallbackSuccess = jest.fn();
    const mockCallbackError = jest.fn();

    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({
        logout: mockLogout,
        apiCall: mockApiCall,
        callbackSuccess: mockCallbackSuccess,
        callbackError: mockCallbackError
      })
    };

    const component = await shallowComponent(<ViewToolbar {...props} />);

    expect(localStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');
    expect(component).toMatchSnapshot('dark theme from localStorage');
  });

  it('should initialize light theme from localStorage using environment variable', async () => {
    // Set up localStorage to return 'light' theme using the env variable key
    localStorageMock['discovery-ui-theme'] = 'light';

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const mockApiCall = jest.fn().mockResolvedValue(undefined);
    const mockCallbackSuccess = jest.fn();
    const mockCallbackError = jest.fn();

    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({
        logout: mockLogout,
        apiCall: mockApiCall,
        callbackSuccess: mockCallbackSuccess,
        callbackError: mockCallbackError
      })
    };

    const component = await shallowComponent(<ViewToolbar {...props} />);

    expect(localStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');
    expect(component).toMatchSnapshot('light theme from localStorage');
  });

  it('should fallback to system preference when localStorage is empty', async () => {
    // Ensure localStorage is empty
    localStorageMock = {};

    // Mock system preference for dark mode
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const mockApiCall = jest.fn().mockResolvedValue(undefined);
    const mockCallbackSuccess = jest.fn();
    const mockCallbackError = jest.fn();

    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({
        logout: mockLogout,
        apiCall: mockApiCall,
        callbackSuccess: mockCallbackSuccess,
        callbackError: mockCallbackError
      })
    };

    const component = await shallowComponent(<ViewToolbar {...props} />);

    expect(localStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(component).toMatchSnapshot('system preference fallback');
  });

  it('should persist theme to localStorage with environment variable key', async () => {
    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const mockApiCall = jest.fn().mockResolvedValue(undefined);
    const mockCallbackSuccess = jest.fn();
    const mockCallbackError = jest.fn();

    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({
        logout: mockLogout,
        apiCall: mockApiCall,
        callbackSuccess: mockCallbackSuccess,
        callbackError: mockCallbackError
      })
    };

    await shallowComponent(<ViewToolbar {...props} />);

    // Verify localStorage.setItem was called with the correct environment variable key
    expect(localStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', expect.any(String));

    // Check the pattern of calls for theme persistence
    const setItemCalls = (localStorage.setItem as jest.Mock).mock.calls;
    expect(setItemCalls).toMatchSnapshot('localStorage theme persistence with env key');
  });
});
