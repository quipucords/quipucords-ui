import { context, useGetSources, useOnDelete, usePoll, useSources } from '../sourcesContext';
import { apiTypes } from '../../../constants/apiConstants';

jest.mock('axios', () => jest.fn);

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

    const { result } = await renderHook(() =>
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
      useSources({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = await renderHook(() =>
      useSources({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = await renderHook(() =>
      useSources({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = await renderHook(() => useSources(), {
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

  it('should apply a hook for returning a get response', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetSources({
        useDispatch: () => value => value,
        useSources: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = await renderHook(() =>
      useGetSources({
        useDispatch: () => value => value,
        useSources: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetSources({
        useDispatch: () => value => value,
        useSources: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = await renderHook(
      () =>
        useGetSources({
          useDispatch: () => value => value
        }),
      {
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
      }
    );

    expect({ errorResponse, fulfilledResponse, pendingResponse, mockStoreSuccessResponse }).toMatchSnapshot(
      'get responses'
    );
  });
});
