import { context, useCredentials, useGetCredentials, useOnDelete } from '../credentialsContext';
import { store } from '../../../redux/store';
import { apiTypes } from '../../../constants/apiConstants';

jest.mock('axios', () => jest.fn);

describe('CredentialsContext', () => {
  beforeEach(() => {
    jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle deleting a credential with a confirmation', async () => {
    const mockConfirmation = jest.fn();
    const mockCredential = {
      [apiTypes.API_RESPONSE_CREDENTIAL_ID]: 'lorem ipsum base id',
      [apiTypes.API_RESPONSE_CREDENTIAL_NAME]: 'lorem ipsum name'
    };

    const { result } = await renderHook(() =>
      useOnDelete({
        useConfirmation: () => mockConfirmation
      })
    );

    result(mockCredential);

    expect(mockConfirmation.mock.calls).toMatchSnapshot('dispatch onDelete');
    mockConfirmation.mockClear();
  });

  it('should apply a hook for retrieving data from multiple selectors', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useCredentials({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = await renderHook(() =>
      useCredentials({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = await renderHook(() =>
      useCredentials({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = await renderHook(() => useCredentials(), {
      state: {
        view: {
          update: {}
        },
        credentials: {
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
      useGetCredentials({
        useCredentials: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = await renderHook(() =>
      useGetCredentials({
        useCredentials: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetCredentials({
        useCredentials: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = await renderHook(() => useGetCredentials(), {
      state: {
        view: {
          update: {}
        },
        credentials: {
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
