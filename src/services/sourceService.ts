import ApiService from './ApiService';

class SourceService extends ApiService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  deleteSource(source: SourceType, setPendingDelete: () => void, queryKey: any[]) {
    const url = `${this.baseUrl}/api/v1/sources/${source.id}/`;
    const successMessage = `Source "${source.name}" deleted successfully`;
    const errorMessage = `Error removing source "${source.name}"`;
    this.delete(url, successMessage, errorMessage, setPendingDelete, queryKey);
  }

  // Other source-specific methods
}