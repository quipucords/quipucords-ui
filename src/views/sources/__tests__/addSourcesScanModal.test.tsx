import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AddSourcesScanModal } from '../addSourcesScanModal';

describe('AddSourceModal', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(async () => {
    await act(async () => {
      mockOnClose = jest.fn();
      mockOnSubmit = jest.fn(() => Promise.resolve({}));
      await render(<AddSourcesScanModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const component = await shallowComponent(<AddSourcesScanModal isOpen={true} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText(/Scan/);
    expect(title).toMatchSnapshot('title');
  });

  it('should call onSubmit with the correct filtered data when "Save" is clicked', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(new RegExp('Enter a name for the scan', 'i')), 'Test Scan');
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit, filtered data');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
