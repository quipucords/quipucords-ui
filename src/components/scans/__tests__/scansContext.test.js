import { context, useGetScans, useOnScanAction, usePoll } from '../scansContext';
import { apiTypes } from '../../../constants/apiConstants';
import { reduxTypes } from '../../../redux';

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

    const { result: confirmCallbacks } = await shallowHook(() =>
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

    await shallowHook(() => usePoll(options));
    await shallowHook(() =>
      usePoll({
        ...options,
        useSelector: () => []
      })
    );

    expect(mockUseTimeout.mock.calls).toMatchSnapshot('timeout');
  });

  it('should apply a hook for retrieving data from multiple selectors', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetScans({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useGetScans({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useGetScans({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useGetScans(), {
      state: {
        viewOptions: {
          [reduxTypes.view.SCANS_VIEW]: {}
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
      'responses'
    );
  });
});
