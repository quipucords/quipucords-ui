import '@testing-library/jest-dom';
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
jest.mock('../../../hooks/useStatusApi', () => ({
  useStatusApi: () => ({
    apiCall: jest.fn(),
    callbackError: jest.fn(),
    callbackSuccess: jest.fn(),
    getStatus: jest.fn().mockResolvedValue({
      server_version: '1.0.0',
      platform: { machine: 'x86_64' }
    })
  })
}));
import { AppToolbar as ViewToolbar } from '../viewLayoutToolbar';

describe('ViewToolbar interactions', () => {
  it('should change color theme', async () => {
    const user = userEvent.setup();
    const mockGetUser = jest.fn().mockResolvedValue('Dolor sit');
    const mockLogout = jest.fn();
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    await act(async () => {
      render(<ViewToolbar {...props} />);
    });

    expect(document.documentElement).not.toHaveClass(/theme-dark/);
    await user.click(screen.getByRole('button', { name: /dark theme/ }));
    expect(document.documentElement).toHaveClass(/theme-dark/);
    await user.click(screen.getByRole('button', { name: /light theme/ }));
    expect(document.documentElement).not.toHaveClass(/theme-dark/);
  });

  it('should render About dialog', async () => {
    const user = userEvent.setup();
    const mockGetUser = jest.fn().mockResolvedValue('Dolor sit');
    const mockLogout = jest.fn();
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    await act(async () => {
      render(<ViewToolbar {...props} />);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(document.querySelector('button[data-ouia-component-id="help_menu_toggle"]')!);
    await user.click(screen.getByText(/About/));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close Dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should log out', async () => {
    const user = userEvent.setup();
    const mockGetUser = jest.fn().mockResolvedValue('Dolor sit');
    const mockLogout = jest.fn();
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser }),
      useLogout: jest.fn().mockReturnValue({ logout: mockLogout })
    };
    await act(async () => {
      render(<ViewToolbar {...props} />);
    });
    await user.click(document.querySelector('button[data-ouia-component-id="user_dropdown_button"]')!);
    await user.click(screen.getByText(/Logout/));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
