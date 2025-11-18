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
    await user.click(screen.getByRole('button', { name: /dark-theme-toggle/ }));
    expect(document.documentElement).toHaveClass(/theme-dark/);
    await user.click(screen.getByRole('button', { name: /light-theme-toggle/ }));
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

    // Find the help button by looking through toggle buttons
    const allToggleButtons = screen.getAllByRole('button', { name: /Toggle/i });
    const helpButton = allToggleButtons[2];
    expect(helpButton).toBeInTheDocument();
    await user.click(helpButton!);

    // Wait for the dropdown to open and then click on the About item
    await waitFor(() => {
      expect(screen.getByText(/view.toolbar.about/)).toBeInTheDocument();
    });
    await user.click(screen.getByText(/view.toolbar.about/));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Find and click the close button - PatternFly AboutModal uses aria-label for close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

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

    // Find the user dropdown button by looking for the button that contains the user name text
    // The button has aria-label="Toggle" but contains the username in its text content
    const userButtons = screen.getAllByRole('button', { name: /Toggle/i });
    const userButton = userButtons.find(button => button.textContent?.includes('Dolor sit'));
    expect(userButton).toBeInTheDocument();
    await user.click(userButton!);

    // Wait for the dropdown to open and then click on the Logout item
    await waitFor(() => {
      expect(screen.getByText(/view.toolbar.logout/)).toBeInTheDocument();
    });
    await user.click(screen.getByText(/view.toolbar.logout/));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
