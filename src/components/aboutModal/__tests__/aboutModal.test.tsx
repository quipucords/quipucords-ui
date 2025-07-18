import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AboutModal } from '../aboutModal';

describe('AboutModal Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should attempt to display username, status data', async () => {
    const mockGetStatus = jest
      .fn()
      .mockResolvedValue({ server_version: '0.0.0.12345678', platform: { machine: 'i386' } });
    const mockUseStatusApi = jest.fn().mockReturnValue({ getStatus: mockGetStatus });
    const mockGetUser = jest.fn().mockResolvedValue('lorem ipsum');
    const mockUseUserApi = jest.fn().mockReturnValue({ getUser: mockGetUser });
    const props = {
      isOpen: true,
      useUser: mockUseUserApi,
      useStatus: mockUseStatusApi
    };

    const component = await shallowComponent(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('username and status');
  });

  it('should log on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockGetStatus = jest.fn().mockRejectedValue({ message: 'Server error' });
    const mockUseStatusApi = jest.fn().mockReturnValue({ getStatus: mockGetStatus });
    const mockGetUser = jest.fn().mockResolvedValue('lorem ipsum');
    const mockUseUserApi = jest.fn().mockReturnValue({ getUser: mockGetUser });
    const props = {
      isOpen: true,
      useUser: mockUseUserApi,
      useStatus: mockUseStatusApi
    };

    const component = await shallowComponent(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('api error');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('should call onClose', async () => {
    const mockOnClose = jest.fn();
    const mockGetStatus = jest
      .fn()
      .mockResolvedValue({ server_version: '0.0.0.12345678', platform: { machine: 'i386' } });
    const mockUseStatusApi = jest.fn().mockReturnValue({ getStatus: mockGetStatus });
    const props = {
      isOpen: true,
      useUser: jest.fn().mockReturnValue({ getUser: jest.fn().mockResolvedValue('lorem ipsum') }),
      useStatus: mockUseStatusApi,
      onClose: mockOnClose
    };

    render(<AboutModal {...props} />);

    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Close Dialog'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
