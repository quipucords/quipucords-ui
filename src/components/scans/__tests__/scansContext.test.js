import { context, useGetScans, useOnDelete, useOnScanAction, usePoll, useScans } from '../scansContext';
import { apiTypes } from '../../../constants/apiConstants';

jest.mock('axios', () => jest.fn);

describe('ScansContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle scan actions with multiple callbacks', async () => {
    const mockDispatch = jest.fn();
    const mockScan = {
      [apiTypes.API_RESPONSE_SCAN_ID]: 'lorem ipsum base id',
      [apiTypes.API_RESPONSE_SCAN_NAME]: 'lorem ipsum name',
      [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: {
        [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID]: 'dolor sit id'
      }
    };

    const { result: confirmCallbacks } = await renderHook(() =>
      useOnScanAction({
        useDispatch: () => mockDispatch
      })
    );

    confirmCallbacks.onStart(mockScan);

    expect(confirmCallbacks).toMatchSnapshot('callbacks');
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch onStart');

    mockDispatch.mockClear();
  });

  it('should attempt to poll scans', async () => {
    const mockUseTimeout = jest.fn();
    const options = {
      pollInterval: 0,
      useSelector: () => [{ connection: { status: 'pending' } }],
      useTimeout: (callback, interval) => {
        mockUseTimeout({
          callback: callback(),
          interval
        });
        return {};
      }
    };

    await renderHook(() => usePoll(options));
    await renderHook(() =>
      usePoll({
        ...options,
        useSelector: () => []
      })
    );

    expect(mockUseTimeout.mock.calls).toMatchSnapshot('timeout');
  });

  it('should apply a hook for retrieving data from multiple selectors', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useScans({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = await renderHook(() =>
      useScans({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = await renderHook(() =>
      useScans({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = await renderHook(() => useScans(), {
      state: {
        view: {
          update: {}
        },
        scans: {
          expanded: {},
          selected: {},
          view: {
            fulfilled: true,
            data: {
              results: ['lorem', 'ipsum']
            }
          }
        }
      }
    });

    expect({ errorResponse, fulfilledResponse, pendingResponse, mockStoreSuccessResponse }).toMatchSnapshot(
      'selector responses'
    );
  });

  it('should apply a hook for returning a get response', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetScans({
        useDispatch: () => value => value,
        useScans: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = await renderHook(() =>
      useGetScans({
        useDispatch: () => value => value,
        useScans: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetScans({
        useDispatch: () => value => value,
        useScans: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = await renderHook(
      () => useGetScans({ useDispatch: () => value => value }),
      {
        state: {
          view: {
            update: {}
          },
          scans: {
            expanded: {},
            selected: {},
            view: {
              fulfilled: true,
              data: {
                results: ['lorem', 'ipsum']
              }
            }
          }
        }
      }
    );
    expect({ errorResponse, fulfilledResponse, pendingResponse, mockStoreSuccessResponse }).toMatchSnapshot(
      'get responses'
    );
  });

  it('should handle deleting a scan with a confirmation', async () => {
    const mockConfirmation = jest.fn();
    const mockScan = {
      [apiTypes.API_RESPONSE_SCAN_NAME]: 'lorem ipsum name'
    };

    const { result } = await renderHook(() =>
      useOnDelete({
        useConfirmation: () => mockConfirmation
      })
    );

    result(mockScan);

    expect(mockConfirmation.mock.calls).toMatchSnapshot('dispatch onDelete');
    mockConfirmation.mockClear();
  });
});
