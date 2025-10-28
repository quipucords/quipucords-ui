import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ShowScansModal, getSortValue, sortByLatestTime, sortJobs } from '../showScansModal';

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
            status: 'completed',
            start_time: new Date('2024-09-06'),
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
    await user.click(screen.getByRole('button', { name: /show-modal\.scan-download/ }));

    expect(mockOnDownload.mock.calls).toMatchSnapshot('onDownload');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('sortByLatestTime', () => {
  const jobs = [
    {
      id: 1,
      report_id: 101,
      status: 'completed',
      start_time: new Date('2024-10-27T12:00:00Z'),
      end_time: new Date('2024-10-27T14:00:00Z')
    },
    {
      id: 2,
      report_id: 102,
      status: 'running',
      start_time: new Date('2024-10-27T10:00:00Z'),
      end_time: new Date('2024-10-27T11:00:00Z')
    },
    {
      id: 3,
      report_id: 103,
      status: 'failed',
      start_time: new Date('2024-10-26T10:00:00Z'),
      end_time: new Date('2024-10-26T12:00:00Z')
    }
  ];
  it('should sort scan jobs by latest scan time in descending order', () => {
    const sortedJobs = sortByLatestTime(jobs);
    expect(sortedJobs).toMatchSnapshot('sorted by latest time');
  });
});

describe('getSortValue', () => {
  const job = {
    id: 1,
    report_id: 101,
    status: 'completed',
    start_time: new Date('2024-10-27T12:00:00Z'),
    end_time: new Date('2024-10-27T14:00:00Z')
  };
  it('should return the correct sort value for the given column index', () => {
    expect(getSortValue(job, 0)).toMatchSnapshot('sort value for time');
    expect(getSortValue(job, 1)).toMatchSnapshot('sort value for status');
    expect(getSortValue(job, 2)).toMatchSnapshot('sort value for invalid index');
  });
});

describe('sortJobs', () => {
  const jobs = [
    {
      id: 1,
      report_id: 101,
      status: 'running',
      start_time: new Date('2024-10-27T10:00:00Z'),
      end_time: new Date('2024-10-27T12:00:00Z')
    },
    {
      id: 2,
      report_id: 102,
      status: 'completed',
      start_time: new Date('2024-10-26T10:00:00Z'),
      end_time: new Date('2024-10-26T12:00:00Z')
    },
    {
      id: 3,
      report_id: 103,
      status: 'failed',
      start_time: new Date('2024-10-28T10:00:00Z'),
      end_time: new Date('2024-10-28T12:00:00Z')
    }
  ];

  it('should sort jobs by time in ascending order', () => {
    const sortedJobs = sortJobs(jobs, 0, 'asc');
    expect(sortedJobs).toMatchSnapshot('sorted jobs by time (asc)');
  });

  it('should sort jobs by time in descending order', () => {
    const sortedJobs = sortJobs(jobs, 0, 'desc');
    expect(sortedJobs).toMatchSnapshot('sorted jobs by time (desc)');
  });

  it('should sort jobs by status in ascending order', () => {
    const sortedJobs = sortJobs(jobs, 1, 'asc');
    expect(sortedJobs).toMatchSnapshot('sorted jobs by status (asc)');
  });

  it('should sort jobs by status in descending order', () => {
    const sortedJobs = sortJobs(jobs, 1, 'desc');
    expect(sortedJobs).toMatchSnapshot('sorted jobs by status (desc)');
  });
});
