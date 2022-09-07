import { context, useGetCredentials, useOnDelete, useOnEdit } from '../credentialsContext';
import { apiTypes } from '../../../constants/apiConstants';
import { reduxTypes } from '../../../redux';

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

  it('should handle credential actions for onEdit', async () => {
    const mockDispatch = jest.fn();
    const mockCredential = {
      [apiTypes.API_RESPONSE_CREDENTIAL_ID]: 'lorem ipsum base id',
      [apiTypes.API_RESPONSE_CREDENTIAL_NAME]: 'lorem ipsum name'
    };

    const { result } = await shallowHook(() =>
      useOnEdit({
        useDispatch: () => mockDispatch
      })
    );

    result(mockCredential);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch onEdit');
    mockDispatch.mockClear();
  });

  it('should apply a hook for retrieving data from multiple selectors', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetCredentials({
        useSelectorsResponse: () => ({ error: true, message: 'Lorem ipsum' })
      })
    );

    const { result: pendingResponse } = shallowHook(() =>
      useGetCredentials({
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    const { result: fulfilledResponse } = shallowHook(() =>
      useGetCredentials({
        useSelectorsResponse: () => ({ fulfilled: true, data: { view: { results: ['dolor', 'sit'] } } })
      })
    );

    const { result: mockStoreSuccessResponse } = shallowHook(() => useGetCredentials(), {
      state: {
        viewOptions: {
          [reduxTypes.view.SCANS_VIEW]: {}
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
      'responses'
    );
  });
});
