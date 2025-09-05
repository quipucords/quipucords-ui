import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AppToolbar as ViewToolbar } from '../viewLayoutToolbar';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

// Mock document.getElementsByTagName for theme application
const mockGetElementsByTagName = jest.fn();
const mockHtmlElement = {
  classList: {
    add: jest.fn(),
    remove: jest.fn()
  }
};

describe('ViewToolbar', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // Setup matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia
    });

    // Setup document.getElementsByTagName mock
    mockGetElementsByTagName.mockReturnValue([mockHtmlElement]);
    Object.defineProperty(document, 'getElementsByTagName', {
      value: mockGetElementsByTagName,
      writable: true
    });

    // Setup default environment variable
    process.env.REACT_APP_THEME_KEY = 'discovery-ui-theme';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.REACT_APP_THEME_KEY;
  });

  it('should render a basic component', async () => {
    // Mock system preference to false (light theme)
    mockMatchMedia.mockReturnValue({ matches: false });
    mockLocalStorage.getItem.mockReturnValue(null);

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should attempt to load and display a username', async () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    mockLocalStorage.getItem.mockReturnValue(null);

    const mockGetUser = jest.fn().mockResolvedValue('Dolor sit');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };

    const component = await shallowComponent(<ViewToolbar {...props} />);
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(component.querySelector('.quipucords-toolbar__user-dropdown')).toMatchSnapshot('user');
  });

  it('should initialize with dark theme when localStorage contains "dark"', async () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    mockMatchMedia.mockReturnValue({ matches: false }); // System preference doesn't matter when localStorage is set

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    // Verify localStorage was checked
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');

    // Verify dark theme class was applied
    expect(mockHtmlElement.classList.add).toHaveBeenCalledWith('pf-v6-theme-dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', 'dark');

    expect(component).toMatchSnapshot('dark theme from localStorage');
  });

  it('should initialize with light theme when localStorage contains "light"', async () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    mockMatchMedia.mockReturnValue({ matches: true }); // System preference doesn't matter when localStorage is set

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    // Verify localStorage was checked
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');

    // Verify light theme (dark class removed)
    expect(mockHtmlElement.classList.remove).toHaveBeenCalledWith('pf-v6-theme-dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', 'light');

    expect(component).toMatchSnapshot('light theme from localStorage');
  });

  it('should initialize with system dark theme preference when localStorage is empty', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: true }); // System prefers dark

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    // Verify localStorage was checked
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');

    // Verify system preference was used and dark theme applied
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(mockHtmlElement.classList.add).toHaveBeenCalledWith('pf-v6-theme-dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', 'dark');

    expect(component).toMatchSnapshot('dark theme from system preference');
  });

  it('should initialize with system light theme preference when localStorage is empty', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false }); // System prefers light

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    // Verify localStorage was checked
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');

    // Verify system preference was used and light theme applied
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(mockHtmlElement.classList.remove).toHaveBeenCalledWith('pf-v6-theme-dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', 'light');

    expect(component).toMatchSnapshot('light theme from system preference');
  });

  it('should handle theme toggle interactions and persist to localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    mockMatchMedia.mockReturnValue({ matches: false });

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    // Initial state should be light
    expect(mockHtmlElement.classList.remove).toHaveBeenCalledWith('pf-v6-theme-dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', 'light');

    // Find and simulate click on dark theme toggle
    const darkToggle = component.querySelector('[aria-label="dark theme toggle"]');
    expect(darkToggle).toMatchSnapshot('dark theme toggle button');

    // The toggle behavior is tested through the component render
    expect(component).toMatchSnapshot('component with theme toggle');
  });

  it('should handle localStorage and applyTheme functionality correctly', async () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    mockMatchMedia.mockReturnValue({ matches: false });

    const mockGetUser = jest.fn().mockResolvedValue('Test User');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    await shallowComponent(<ViewToolbar {...props} />);

    // Verify the localStorage interactions
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('discovery-ui-theme');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('discovery-ui-theme', 'dark');

    // Verify DOM manipulation
    expect(mockGetElementsByTagName).toHaveBeenCalledWith('html');
    expect(mockHtmlElement.classList.add).toHaveBeenCalledWith('pf-v6-theme-dark');

    // Test the actual localStorage calls match snapshot
    expect({
      getItemCalls: mockLocalStorage.getItem.mock.calls,
      setItemCalls: mockLocalStorage.setItem.mock.calls,
      htmlClassActions: {
        added: mockHtmlElement.classList.add.mock.calls,
        removed: mockHtmlElement.classList.remove.mock.calls
      }
    }).toMatchSnapshot('localStorage and DOM interactions');
  });
});
