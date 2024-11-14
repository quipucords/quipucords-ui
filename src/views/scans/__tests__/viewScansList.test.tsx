import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import moment from 'moment';
import helpers from '../../../helpers';
import ScansListView from '../viewScansList';

/**
 * ScanListView wrapped with QueryClientProvider
 *
 * @returns React.Component
 */
const wrappedScanViewList = () => {
  // ScansListView requires a QueryClient and to be wrapped by QueryClientProvider in order
  // to be properly rendered;
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <ScansListView />
    </QueryClientProvider>
  );
};

/**
 * Returns the downloadButton of given scanName.
 *
 * @param {string} scanName
 * @returns {object} (scanRow, downloadBtn, kebabMenu)
 */
const clickKebabMenu = scanName => {
  const scanRow = screen.getByText(scanName).parentElement as HTMLElement;
  const kebabBtn = within(scanRow).getByRole('button', {
    name: /action menu toggle/i
  });
  act(() => {
    // click the kebab to make the menu visible
    fireEvent.click(kebabBtn);
  });
  // finally grab the download button. It should be the 3rd item on the menu
  const downloadBtn = within(scanRow).getAllByRole('menuitem')[2];
  return {
    scanRow,
    downloadBtn,
    kebabBtn
  };
};

const downloadableScanName = 'downloadable scan';
const downloadableReportId = 42;

const dummyScanList = [
  {
    id: 1,
    name: downloadableScanName,
    sources: [1],
    most_recent: {
      report_id: downloadableReportId,
      status: 'completed'
    }
  },
  {
    id: 2,
    name: 'not downloadable 1',
    sources: [1],
    most_recent: {
      report_id: 2,
      status: 'pending'
    }
  },
  {
    id: 3,
    name: 'not downloadable 2',
    sources: [1],
    most_recent: {
      status: 'completed'
    }
  },
  {
    id: 4,
    sources: [1],
    name: 'not downloadable 3',
    most_recent: {
      report_id: 4
    }
  },
  {
    id: 5,
    sources: [1],
    name: 'not downloadable 4'
  }
];

describe('view Scan List', () => {
  let asFragment;
  const mockedDownloadReport = jest.fn();

  beforeEach(async () => {
    // we don't care about properly rendering timestamps in this test; mocking this
    // helper makes our mock data simpler
    jest.spyOn(helpers, 'getTimeDisplayHowLongAgo').mockImplementation(() => moment().from(moment()));
    // we don't need to actually download anything either, so let's mock the downloader
    // (this is a bit trickier because downloadReport is nested in another function)
    const useScanApiModule = require('../../../hooks/useScanApi');
    jest.spyOn(useScanApiModule, 'useDownloadReportApi').mockImplementation(() => {
      return {
        downloadReport: mockedDownloadReport
      };
    });
    // mock axios to return dummyScanList
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { results: dummyScanList } });
    // now let's render the ScanViewList...
    const rendered = render(wrappedScanViewList());
    asFragment = rendered.asFragment;
    // ...wait until data is loaded
    await waitFor(() => {
      rendered.getByText('downloadable scan');
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('sanity check rendered scanViewList', () => {
    // ...ensure axios was called
    expect(axios.get).toHaveBeenCalledTimes(1);
    // ...and make sure it matches our snapshot
    expect(asFragment()).toMatchSnapshot('scanViewList');
  });

  it('sanity check kebab menu', () => {
    const { scanRow, kebabBtn } = clickKebabMenu(downloadableScanName);
    expect(kebabBtn.getAttribute('aria-expanded')).toBe('true');
    expect(scanRow).toMatchSnapshot('expanded kebab menu');
    // clicking on it again should make it go away
    act(() => {
      fireEvent.click(kebabBtn);
    });
    expect(kebabBtn.getAttribute('aria-expanded')).toBe('false');
    expect(scanRow).toMatchSnapshot('kebab menu hidden');
  });

  it('ensure only the first scan has a downloadable report', async () => {
    // see dummyScanList; only the first scan should have a downloadable report
    // grab the download button for the first scan
    const { downloadBtn } = clickKebabMenu(downloadableScanName);
    // the button should not be disabled
    expect(downloadBtn.hasAttribute('disabled')).toBeFalsy();
    // and clicking on it should...
    act(() => {
      fireEvent.click(downloadBtn);
    });
    // ...download the report
    expect(mockedDownloadReport).toHaveBeenCalledWith(downloadableReportId);
    mockedDownloadReport.mockReset();
    // repeat the process for other scans, which should not be downloadable
    const otherScans = [1, 2, 3, 4];
    otherScans.forEach(n => {
      const { downloadBtn: button } = clickKebabMenu(`not downloadable ${n}`);
      expect(button.hasAttribute('disabled')).toBeTruthy();
      act(() => {
        fireEvent.click(downloadBtn);
      });
      expect(mockedDownloadReport).not.toHaveBeenCalled();
    });
  });
});
