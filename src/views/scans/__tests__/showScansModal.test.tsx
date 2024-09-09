import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ShowScansModal } from '../showScansModal';

describe('ShowScansModal', () => {
  let mockOnClose;
  let mockOnDownload;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnDownload = jest.fn();
    render(
      <ShowScansModal
        scanJobs={[
          {
            id: 12345,
            status: 'DOLOR SIT',
            end_time: new Date('2024-09-06'),
            report_id: 67890
          }
        ]}
        scan={{ name: 'Lorem ipsum' }}
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      isOpen: true,
      scan: { name: 'Lorem ipsum' }
    };
    const component = await shallowComponent(<ShowScansModal {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText(new RegExp('Lorem ipsum'));
    expect(title).toMatchSnapshot('title');
  });

  it('should call onDownload with a report id when clicked', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('Download'));

    expect(mockOnDownload.mock.calls).toMatchSnapshot('onDownload');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
