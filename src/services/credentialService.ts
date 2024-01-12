import ApiService from './ApiService';

class CredentialService extends ApiService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  deleteCredential(credential: CredentialType, setPendingDelete: () => void, queryKey: any[]) {
    const url = `${this.baseUrl}/api/v1/credentials/${credential.id}/`;
    const successMessage = `Credential deleted successfully`;
    const errorMessage = `Error removing credential`;
    this.delete(url, successMessage, errorMessage, setPendingDelete, queryKey);
  }

  // Other credential-specific methods
}