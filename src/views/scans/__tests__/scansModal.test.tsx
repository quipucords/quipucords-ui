import * as React from 'react';
import { KeyTypes } from '@patternfly/react-core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ScanJobType, ScanType } from 'src/types/types';
import { ScansModal } from '../showScansModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str, obj) => `${str}-${JSON.stringify(obj)}`
    };
  }
}));

jest.spyOn(document, 'createElement');
jest.spyOn(document.body, 'addEventListener');

const props = {
  scan: { id: 123 } as ScanType,
  onClose: jest.fn(),
  onDownload: jest.fn(),
  scanJobs: undefined
};
const propsWithZeroScanJobs = {
  ...props,
  scanJobs: []
};
const propsWithOneScanJob = {
  ...props,
  scanJobs: [
    {
      id: 1,
      end_time: new Date(1504095567183),
      report_id: 12,
      status: 'completed'
    }
  ] as ScanJobType[]
};
const propsWithScanJobs = {
  ...props,
  scanJobs: [
    {
      id: 1,
      end_time: new Date(1504095567183),
      report_id: 12,
      status: 'completed'
    },
    {
      id: 2,
      end_time: new Date(1604095567183),
      report_id: 22,
      status: 'completed'
    }
  ] as ScanJobType[]
};

describe('Modal', () => {
  test('Modal creates a container element once for div', () => {
    render(<ScansModal {...props} />);
    expect(document.createElement).toHaveBeenCalledWith('div');
  });
  test('Modal title populates based on scan id', async () => {
    render(<ScansModal {...props} />);

    expect(
      screen.getByText(`view.label-{"context":"scans-ids","name":${props.scan.id}}`)
    ).toBeInTheDocument();
  });

  test('Modal loading screen populates properly', async () => {
    const { baseElement } = render(<ScansModal {...props} />);
    expect(screen.getByText('Loading scans')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
  test('Modal 0 jobs populates properly', async () => {
    const { baseElement } = render(<ScansModal {...propsWithZeroScanJobs} />);
    expect(screen.getByText('0 scans have run')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
  test('Modal 1 job populates properly', async () => {
    const { baseElement } = render(<ScansModal {...propsWithOneScanJob} />);
    expect(screen.getByText('1 scan has run')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
  test('Modal multiple jobs populates properly', async () => {
    const { baseElement } = render(<ScansModal {...propsWithScanJobs} />);
    expect(screen.getByText('2 scans have run')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
  test('Modal closes with escape', async () => {
    const user = userEvent.setup();
    render(<ScansModal {...props} />);
    await user.type(
      screen.getByText(`view.label-{"context":"scans-ids","name":${props.scan.id}}`),
      `{${KeyTypes.Escape}}`
    );
    expect(props.onClose).toHaveBeenCalled();
  });
  test('Modal shows the close button', () => {
    render(<ScansModal {...props} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
  test('Modal clicking close button calls onClose', async () => {
    render(<ScansModal {...props} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(props.onClose).toHaveBeenCalled();
  });
  test('Modal clicking download button calls onDownload with proper report id', async () => {
    render(<ScansModal {...propsWithScanJobs} />);
    await userEvent.click(screen.getAllByText('Download')[0]);
    expect(props.onDownload).toHaveBeenCalledWith(propsWithScanJobs.scanJobs[0].report_id);
  });
});
