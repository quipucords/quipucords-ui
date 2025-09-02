import React from 'react';
import { render } from '@testing-library/react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import * as useScanApi from '../../../hooks/useScanApi';
import { MergeReportsModal } from '../mergeReportsModal';

jest.mock('../../../hooks/useScanApi');

describe('MergeReportsModal', () => {
  let mockRequestReportsMerge;
  let mockCancelReportsMerge;

  const mockHookWithState = (mergeProcessState: useScanApi.MergeProcessState) => {
    (useScanApi.useMergeReportsApi as jest.Mock).mockReturnValue({
      requestReportsMerge: mockRequestReportsMerge,
      cancelReportsMerge: mockCancelReportsMerge,
      mergeProcessState: mergeProcessState
    });
  };

  beforeEach(() => {
    mockRequestReportsMerge = jest.fn();
    mockCancelReportsMerge = jest.fn();
    mockHookWithState({ state: 'InProgress' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      isOpen: true,
      reportIds: []
    };
    const component = await shallowComponent(<MergeReportsModal {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render a component after merge succeeded', async () => {
    mockHookWithState({ state: 'Successful', mergedReportId: 123 });
    const props = {
      isOpen: true,
      reportIds: []
    };
    const component = await shallowComponent(<MergeReportsModal {...props} />);
    expect(component).toMatchSnapshot('success');
  });

  it('should render a component after merge failed', async () => {
    mockHookWithState({ state: 'Errored', errorMessage: 'Lorem ipsum dolor sit' });
    const props = {
      isOpen: true,
      reportIds: []
    };
    const component = await shallowComponent(<MergeReportsModal {...props} />);
    expect(component).toMatchSnapshot('errored');
  });

  it('should request merge when modal is opened', async () => {
    const { rerender } = render(<MergeReportsModal isOpen={false} reportIds={[]} />);

    expect(mockRequestReportsMerge).not.toHaveBeenCalled();

    rerender(<MergeReportsModal isOpen={true} reportIds={[3, 2]} />);

    expect(mockRequestReportsMerge).toHaveBeenCalledTimes(1);
    expect(mockRequestReportsMerge).toHaveBeenCalledWith([3, 2]);
  });

  it('should cancel merge when modal is closed', async () => {
    const { rerender } = render(<MergeReportsModal isOpen={true} reportIds={[1]} />);

    expect(mockCancelReportsMerge).not.toHaveBeenCalled();

    rerender(<MergeReportsModal isOpen={false} reportIds={[]} />);

    expect(mockCancelReportsMerge).toHaveBeenCalledTimes(1);
  });

  it('should run onSuccess when merge finished', async () => {
    const mockOnSuccess = jest.fn();
    const mergedReportId = 123;
    const props = {
      isOpen: true,
      reportIds: [3, 2, 1],
      onSuccess: mockOnSuccess
    };
    const { rerender } = render(<MergeReportsModal {...props} />);
    mockHookWithState({ state: 'Successful', mergedReportId: mergedReportId });

    rerender(<MergeReportsModal {...props} />);

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(mergedReportId);
  });

  it('should run onSuccess only once while open', async () => {
    const mockOnSuccess = jest.fn();
    const mergedReportId = 123;
    const props = {
      isOpen: true,
      reportIds: [3, 2, 1],
      onSuccess: mockOnSuccess
    };
    const { rerender } = render(<MergeReportsModal {...props} />);
    mockHookWithState({ state: 'Successful', mergedReportId: mergedReportId });

    rerender(<MergeReportsModal {...props} />);
    // In view, isOpen is derived from reportIds. However, component will re-render once when reportIds is
    // reset to empty array, but before isOpen useEffect requests reset of hook state
    rerender(<MergeReportsModal {...props} reportIds={[]} />);

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(mergedReportId);
  });
});
