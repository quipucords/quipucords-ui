import { context, useCredentials, useGetCredentials, useOnDelete } from '../credentialsContext';
import { apiTypes } from '../../../constants/apiConstants';

jest.mock('axios', () => jest.fn);

describe('CredentialsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle deleting a credential with a confirmation', async () => {
    const mockConfirmation = jest.fn();
    const mockCredential = {
      [apiTypes.API_RESPONSE_CREDENTIAL_ID]: 'lorem ipsum base id',
      [apiTypes.API_RESPONSE_CREDENTIAL_NAME]: 'lorem ipsum name'
    };

    const { result } = await shallowHook(() =>
      useOnDelete({
        useConfirmation: () => mockConfirmation
      })
    );

    result(mockCredential);

    expect(mockConfirmation.mock.calls).toMatchSnapshot('dispatch onDelete');
    mockConfirmation.mockClear();
  });

  it('should apply a hook for retrieving data from multiple selectors', () => {
    const { result: errorResponse } = shallowHook(() =>
      useCredentials({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useCredentials({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useCredentials({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useCredentials(), {
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

  it('should apply a hook for returning a get response', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetCredentials({
        useCredentials: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useGetCredentials({
        useCredentials: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useGetCredentials({
        useCredentials: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useGetCredentials(), {
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
