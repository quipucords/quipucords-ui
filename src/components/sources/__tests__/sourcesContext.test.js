import { context, useGetSources, useOnDelete, usePoll } from '../sourcesContext';
import { apiTypes } from '../../../constants/apiConstants';
import { reduxTypes } from '../../../redux';

describe('SourcesContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle deleting a source with a confirmation', async () => {
    const mockDispatch = jest.fn();
    const mockSource = {
      [apiTypes.API_RESPONSE_SOURCE_NAME]: 'lorem ipsum name',
      [apiTypes.API_RESPONSE_SOURCE_ID]: 'dolor sit id'
    };

    // call confirmation
    const { result: onDeleteConfirmation } = shallowHook(() => useOnDelete({ useDispatch: () => mockDispatch }));
    onDeleteConfirmation(mockSource);

    // delete results
    await mountHook(() =>
      useOnDelete({
        useDispatch: () => mockDispatch,
        useSelector: () => mockSource,
        useSelectorsResponse: () => ({ fulfilled: true })
      })
    );

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch delete a source, confirmation');
    mockDispatch.mockClear();
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

  it('should apply a hook for retreiving data from multiple selectors', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetSources({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useGetSources({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useGetSources({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useGetSources(), {
      state: {
        viewOptions: {
          [reduxTypes.view.SOURCES_VIEW]: {}
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
      'responses'
    );
  });
});
