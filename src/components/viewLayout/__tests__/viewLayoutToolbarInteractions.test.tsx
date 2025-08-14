import '@testing-library/jest-dom';
import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

    // Find the help button by looking for the QuestionCircleIcon
    const helpButton = screen.getByRole('button', { name: /Toggle/i });
    expect(helpButton).toBeInTheDocument();
    await user.click(helpButton);

    // Wait for the dropdown to open and then click on the About item
    await waitFor(() => {
      expect(screen.getByText('About')).toBeInTheDocument();
    });
    await user.click(screen.getByText('About'));

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

    // Find the user dropdown button by looking for the user name
    const userButton = screen.getByRole('button', { name: /Dolor sit/i });
    expect(userButton).toBeInTheDocument();
    await user.click(userButton);

    // Wait for the dropdown to open and then click on the Logout item
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Logout'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
