import React from 'react';
import { context, useOnSubmitCredential, useOnUpdateCredential } from '../createCredentialDialogContext';
import { store } from '../../../redux';
import { credentialsService } from '../../../services';

describe('CredentialsContext', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should attempt to handle submitting a credential with a toast confirmation', async () => {
    const mockCredential = {
      values: {
        mockId: 'lorem ipsum base id',
        mockName: 'lorem ipsum name'
      }
    };
    const mockUseState = jest.spyOn(React, 'useState').mockImplementation(() => [mockCredential, jest.fn()]);
    const mockUseService = jest.spyOn(credentialsService, 'getCredentials').mockImplementation(() => jest.fn());

    const { result } = await mountHook(() =>
      useOnSubmitCredential({
        useDispatch: () => mockDispatch,
        useCredential: () => ({ fulfilled: true })
      })
    );

    result(mockCredential);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch onSubmit');
    mockUseState.mockClear();
    mockUseService.mockClear();
  });

  it('should handle credential actions for onEdit, onHide, onAdd', async () => {
    const { result } = await shallowHook(() =>
      useOnUpdateCredential({
        useDispatch: () => mockDispatch
      })
    );

    result.onEdit({
      mockId: 'lorem ipsum base id',
      mockName: 'lorem ipsum name'
    });
    result.onHide();
    result.onAdd('lorem ipsum mock credential type');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch onEdit');
  });
});
