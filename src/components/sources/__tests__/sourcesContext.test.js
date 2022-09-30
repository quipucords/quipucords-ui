import { context, useGetSources, useOnDelete, usePoll, useSources } from '../sourcesContext';
import { apiTypes } from '../../../constants/apiConstants';

describe('SourcesContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle deleting a source with a confirmation', async () => {
    const mockConfirmation = jest.fn();
    const mockSource = {
      [apiTypes.API_RESPONSE_SOURCE_NAME]: 'lorem ipsum name',
      [apiTypes.API_RESPONSE_SOURCE_ID]: 'dolor sit id'
    };

    const { result } = await shallowHook(() =>
      useOnDelete({
        useConfirmation: () => mockConfirmation
      })
    );

    result(mockSource);

    expect(mockConfirmation.mock.calls).toMatchSnapshot('dispatch onDelete');
    mockConfirmation.mockClear();
  });

  it('should attempt to poll sources', async () => {
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
      useSources({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useSources({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useSources({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useSources(), {
      state: {
        view: {
          update: {}
        },
        sources: {
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

  it('should apply a hook for returning a get response', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetSources({
        useSources: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useGetSources({
        useSources: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useGetSources({
        useSources: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useGetSources(), {
      state: {
        view: {
          update: {}
        },
        sources: {
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
      'get responses'
    );
  });
});
