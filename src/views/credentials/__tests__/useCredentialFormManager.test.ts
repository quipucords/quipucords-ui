
import { renderHook, act } from '@testing-library/react';
import { useCredentialFormManager } from '../useCredentialFormManager';
import * as useCredentialApi from '../../../hooks/useCredentialApi';
import * as useQueryClientConfig from '../../../queryClientConfig';


jest.mock('../../../hooks/useCredentialApi');
jest.mock('../../../queryClientConfig');

const mockUseCredentialApi = useCredentialApi as jest.Mocked<typeof useCredentialApi>;
const mockUseQueryClientConfig = useQueryClientConfig as jest.Mocked<typeof useQueryClientConfig>;

describe('useCredentialFormManager - Essential Tests', () => {
  let mockOnAddAlert: jest.Mock;
  let mockAddCredentials: jest.Mock;
  let mockQueryClient: any;

  const testCredential = {
    id: 123,
    name: 'Test Credential',
    cred_type: 'network'
  } as any;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    mockAddCredentials = jest.fn();
    mockQueryClient = { invalidateQueries: jest.fn() };

    mockUseCredentialApi.useDeleteCredentialApi.mockReturnValue({
      deleteCredentials: jest.fn(),
      apiCall: jest.fn(),
      callbackError: jest.fn(),
      callbackSuccess: jest.fn()
    });

    mockUseCredentialApi.useAddCredentialApi.mockReturnValue({
      addCredentials: mockAddCredentials,
      apiCall: jest.fn(),
      callbackError: jest.fn(),
      callbackSuccess: jest.fn()
    });

    mockUseCredentialApi.useEditCredentialApi.mockReturnValue({
      editCredentials: jest.fn(),
      apiCall: jest.fn(),
      callbackError: jest.fn(),
      callbackSuccess: jest.fn()
    });

    mockUseQueryClientConfig.default.mockReturnValue({
      queryClient: mockQueryClient
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with forms closed', () => {
    const { result } = renderHook(() => 
      useCredentialFormManager({ onAddAlert: mockOnAddAlert })
    );

    expect(result.current.addCredentialForm.isOpen).toBe(false);
    expect(result.current.editCredentialForm.isOpen).toBe(false);
  });

  it('should open and close add credential modal', () => {
    const { result } = renderHook(() => 
      useCredentialFormManager({ onAddAlert: mockOnAddAlert })
    );

    act(() => {
      result.current.openAddCredentialModal('network');
    });
    expect(result.current.addCredentialForm.isOpen).toBe(true);
    expect(result.current.addCredentialForm.credentialType).toBe('network');

    act(() => {
      result.current.addCredentialForm.onClose();
    });
    expect(result.current.addCredentialForm.isOpen).toBe(false);
  });

  it('should handle form submission successfully', async () => {
    mockAddCredentials.mockResolvedValue({});
    
    const { result } = renderHook(() => 
      useCredentialFormManager({ onAddAlert: mockOnAddAlert })
    );

    act(() => {
      result.current.openAddCredentialModal('network');
    });

    await act(async () => {
      await result.current.addCredentialForm.onSubmit(testCredential);
    });

    expect(mockAddCredentials).toHaveBeenCalledWith(testCredential);
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
    expect(result.current.addCredentialForm.isOpen).toBe(false);
  });

  it('should keep modal open when submission fails', async () => {
    mockAddCredentials.mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => 
      useCredentialFormManager({ onAddAlert: mockOnAddAlert })
    );

    act(() => {
      result.current.openAddCredentialModal('network');
    });

    await act(async () => {
      await result.current.addCredentialForm.onSubmit(testCredential);
    });

    expect(mockAddCredentials).toHaveBeenCalledWith(testCredential);
    // Modal should stay open so user can fix errors and retry
    expect(result.current.addCredentialForm.isOpen).toBe(true);
    // List should NOT refresh on error
    expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
  });

});