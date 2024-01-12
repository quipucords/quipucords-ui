import axios from 'axios';
import getUniqueId from '../../src/common/helpers';

class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async delete(url: string, successMessage: string, errorMessage: string, setPendingDelete: () => void, queryKey: any[]) {
    try {
      await axios.delete(url);
      addAlert(successMessage, 'success', getUniqueId());
      // Other common logic
    } catch (error) {
      console.error(error);
      // Error handling logic
    } finally {
      setPendingDelete();
    }
  }

  // Other common methods like get, post, put, etc.
}

export default ApiService;
