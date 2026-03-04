import '@testing-library/jest-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildReport } from '../../../test-utils/factories';
import ReportsListView, { createNewerThanValidator, createOlderThanValidator } from '../viewReportsList';

// Jest can't parse ESM imports from @patternfly/react-icons used by the react-table-batteries vendor code.
// Mock them as no-op components to avoid SyntaxError during test runs.
jest.mock('@patternfly/react-icons/dist/esm/icons/filter-icon', () => ({ __esModule: true, default: () => null }));
jest.mock('@patternfly/react-icons/dist/esm/icons/search-icon', () => ({ __esModule: true, default: () => null }));
jest.mock('@patternfly/react-icons/dist/esm/icons/angle-down-icon', () => ({ __esModule: true, default: () => null }));
jest.mock('@patternfly/react-icons/dist/esm/icons/angle-right-icon', () => ({ __esModule: true, default: () => null }));
jest.mock('@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon', () => ({
  __esModule: true,
  default: () => null
}));
jest.mock('@patternfly/react-icons/dist/esm/icons/cubes-icon', () => ({ __esModule: true, default: () => null }));

const mockDownloadReport = jest.fn();
jest.mock('../../../hooks/useScanApi', () => ({
  useDownloadReportApi: () => ({ downloadReport: mockDownloadReport })
}));

let mockQueryReturn: {
  data: { count: number; results: ReturnType<typeof buildReport>[] } | undefined;
  isLoading: boolean;
  isError: boolean;
};
jest.mock('../useReportsQuery', () => ({
  useReportsQuery: () => mockQueryReturn
}));

const mockReportsData = {
  count: 2,
  results: [
    buildReport({ id: 10 }),
    buildReport({
      id: 20,
      origin: 'uploaded',
      scan_id: 2,
      can_publish: false,
      cannot_publish_reason: 'no_hosts',
      can_download: false,
      cannot_download_reason: 'status_pending'
    })
  ]
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('ReportsListView', () => {
  beforeEach(() => {
    mockQueryReturn = {
      data: mockReportsData,
      isLoading: false,
      isError: false
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render report rows from API data', () => {
    const { container } = renderWithProviders(<ReportsListView />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('should show empty state when there are no reports', () => {
    mockQueryReturn = {
      data: { count: 0, results: [] },
      isLoading: false,
      isError: false
    };

    renderWithProviders(<ReportsListView />);

    expect(screen.getByText(new RegExp('reports_title'))).toMatchSnapshot('empty state title');
    expect(screen.getByText(new RegExp('reports_description'))).toMatchSnapshot('empty state description');
  });

  it('should show error state when the query fails', () => {
    mockQueryReturn = {
      data: undefined,
      isLoading: false,
      isError: true
    };

    renderWithProviders(<ReportsListView />);

    expect(screen.getByText(new RegExp('error_title'))).toMatchSnapshot('error state');
  });

  it('should trigger download for a downloadable report', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ReportsListView />);

    const actionToggles = screen.getAllByRole('button', { name: /action-menu/i });
    await user.click(actionToggles[0]);

    const downloadItem = await screen.findByText(new RegExp('download'));
    await user.click(downloadItem);

    expect(mockDownloadReport.mock.calls).toMatchSnapshot('download called');
  });

  it('should disable download for a non-downloadable report', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ReportsListView />);

    const actionToggles = screen.getAllByRole('button', { name: /action-menu/i });
    await user.click(actionToggles[1]);

    const downloadItem = await screen.findByText(new RegExp('download'));
    expect(downloadItem.closest('[aria-disabled="true"]')).toMatchSnapshot('download disabled');
  });

  describe('date range validators', () => {
    const errorMsg = 'Date range is inverted';

    describe('createNewerThanValidator', () => {
      it('should return empty string when no older-than value is set', () => {
        const validator = createNewerThanValidator(() => undefined, errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe('');
      });

      it('should return empty string when newer-than date is before older-than date', () => {
        const validator = createNewerThanValidator(() => '2025-12-01', errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe('');
      });

      it('should return empty string when dates are equal', () => {
        const validator = createNewerThanValidator(() => '2025-06-01', errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe('');
      });

      it('should return error when newer-than date is after older-than date', () => {
        const validator = createNewerThanValidator(() => '2025-01-01', errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe(errorMsg);
      });
    });

    describe('createOlderThanValidator', () => {
      it('should return empty string when no newer-than value is set', () => {
        const validator = createOlderThanValidator(() => undefined, errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe('');
      });

      it('should return empty string when older-than date is after newer-than date', () => {
        const validator = createOlderThanValidator(() => '2025-01-01', errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe('');
      });

      it('should return empty string when dates are equal', () => {
        const validator = createOlderThanValidator(() => '2025-06-01', errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe('');
      });

      it('should return error when older-than date is before newer-than date', () => {
        const validator = createOlderThanValidator(() => '2025-12-01', errorMsg);
        expect(validator(new Date('2025-06-01'))).toBe(errorMsg);
      });
    });
  });
});
