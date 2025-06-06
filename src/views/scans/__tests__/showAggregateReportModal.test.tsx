import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ShowAggregateReportModal, statsFilter, formatSortFilterReportStats } from '../showAggregateReportModal';

describe('ShowAggregateReportModal', () => {
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = jest.fn();
    render(
      <ShowAggregateReportModal
        report={{
          id: 12345,
          report: {
            results: {
              instances_virtual: 5,
              ansible_hosts_all: 2
            }
          }
        }}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      isOpen: true
    };
    const component = await shallowComponent(<ShowAggregateReportModal {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have a consistent title', () => {
    const title = screen.getByText(new RegExp('modal.title'));
    expect(title).toMatchSnapshot('title');
  });

  it('should have a consistent content', () => {
    const content = screen.getAllByText(new RegExp('modal.label'));
    expect(content).toMatchSnapshot('content');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('statsFilter', () => {
  it('should be a list of consistent display properties', () => {
    expect(statsFilter).toMatchSnapshot('list');
  });
});

describe('formatSortFilterReportStats', () => {
  const report = {
    results: {
      system_creation_date_average: new Date('2025-04-24'),
      instances_virtual: 5,
      ansible_hosts_all: 2
    },
    diagnostics: {
      missing_pem_files: 5
    }
  };
  it('should sort properties', () => {
    expect(formatSortFilterReportStats(report)).toMatchSnapshot('sort');
  });

  it('should filter alternate properties', () => {
    const filter = ['ansible_hosts_all'];
    expect(formatSortFilterReportStats(report, { filter })).toMatchSnapshot('filtered');
  });

  it('should apply date formatting to a specific property', () => {
    const filter = ['system_creation_date_average'];
    expect(formatSortFilterReportStats(report, { filter })).toMatchSnapshot('date');
  });

  it('should handle a missing report', () => {
    expect(formatSortFilterReportStats()).toMatchSnapshot('missing');
  });

  it('should handle misuse', () => {
    // @ts-expect-error Incorrect type, misuse or unknown passed to function
    expect(formatSortFilterReportStats({ results: null, diagnostics: null })).toMatchSnapshot('misuse');
  });
});
