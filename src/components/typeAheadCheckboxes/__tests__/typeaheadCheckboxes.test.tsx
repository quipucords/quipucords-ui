import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { TypeaheadCheckboxes } from '../typeaheadCheckboxes';

const mockGetCredentials = jest.fn();
jest.mock('../../../hooks/useCredentialApi', () => ({
  useGetCredentialsApi: () => ({
    getCredentials: mockGetCredentials
  })
}));

jest.mock('../../../helpers', () => ({
  helpers: {
    TEST_MODE: true
  }
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Mock that handles context-based translations
      if (key === 'form-dialog.label' && options?.context) {
        switch (options.context) {
          case 'typeahead-no-results':
            return `No results found for "${options.searchTerm}"`;
          case 'typeahead-items-selected':
            return `${options.count} items selected`;
          case 'typeahead-placeholder':
            return '0 items selected';
          case 'typeahead-search-hint':
            return 'Type to search for more credentials...';
          case 'typeahead-clear':
            return 'Clear input value';
          default:
            return `${key}_${options.context}`;
        }
      }
      return key;
    }
  })
}));

const mockCredentials = [
  { id: 1, name: 'Alpha', cred_type: 'network' } as any,
  { id: 2, name: 'Beta', cred_type: 'network' } as any,
  { id: 3, name: 'Gamma', cred_type: 'network' } as any
];

const mockApiResponse = {
  data: {
    results: mockCredentials,
    next: null,
    previous: null,
    count: 3
  }
};

describe('TypeaheadCheckboxes', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockGetCredentials.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      credentialType: 'network',
      selectedOptions: [],
      onChange: jest.fn()
    };
    const component = await shallowComponent(<TypeaheadCheckboxes {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should clear selections and call onChange with [] when clear button is clicked', async () => {
    const mockOnChange = jest.fn();
    render(
      <TypeaheadCheckboxes
        credentialType="network"
        selectedOptions={['1', '2']}
        onChange={mockOnChange}
        initialSelectedCredentials={mockCredentials.slice(0, 2)}
      />
    );

    const clearButton = await screen.findByRole('button', { name: /clear input value/i });
    await userEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('should select option and close dropdown when maxSelections is 1', async () => {
    const onChange = jest.fn();

    render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={onChange} maxSelections={1} />);

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument();
    });

    const alphaOption = screen.getByText('Alpha');
    await userEvent.click(alphaOption);

    expect(onChange).toHaveBeenCalledWith(['1']);

    // Wait for the menu to disappear
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('should select multiple options and call onChange (controlled)', async () => {
    const mockOnChange = jest.fn();

    render(
      <TypeaheadCheckboxes
        credentialType="network"
        selectedOptions={[]}
        onChange={mockOnChange}
        maxSelections={3}
        initialSelectedCredentials={mockCredentials}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument();
    });

    const alphaOption = screen.getByText('Alpha');
    await userEvent.click(alphaOption);

    // Verify first selection was called
    expect(mockOnChange).toHaveBeenCalledWith(['1']);
  });

  it('should show "No results found" when search yields no matches', async () => {
    render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={jest.fn()} />);

    // Mock empty response for search after component is rendered
    mockGetCredentials.mockResolvedValue({
      data: { results: [], next: null, count: 0 }
    });

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    await waitFor(() => {
      // Check that the menu is open and empty (no results)
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toBeEmptyDOMElement();
    });
  });

  it('should update placeholder based on selection count', async () => {
    const { rerender } = render(
      <TypeaheadCheckboxes
        credentialType="network"
        selectedOptions={[]}
        onChange={jest.fn()}
        placeholder="Select credentials"
      />
    );

    expect(screen.getByPlaceholderText('Select credentials')).toBeInTheDocument();

    rerender(
      <TypeaheadCheckboxes
        credentialType="network"
        selectedOptions={['1', '2']}
        onChange={jest.fn()}
        placeholder="Select credentials"
        initialSelectedCredentials={mockCredentials.slice(0, 2)}
      />
    );

    expect(screen.getByPlaceholderText('2 items selected')).toBeInTheDocument();
  });

  describe('Pagination features', () => {
    it('should show pagination hint when hasMorePages is true and no search term', async () => {
      const mockApiResponseWithPagination = {
        data: {
          results: mockCredentials,
          next: 'http://example.com/api/credentials/?page=2',
          previous: null,
          count: 150
        }
      };
      mockGetCredentials.mockResolvedValue(mockApiResponseWithPagination);

      render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={jest.fn()} />);

      const input = screen.getByRole('combobox');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Type to search for more credentials...')).toBeInTheDocument();
      });
    });

    it('should send page_size parameter in API calls', async () => {
      render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={jest.fn()} />);

      const input = screen.getByRole('combobox');
      await userEvent.click(input);

      await waitFor(() => {
        expect(mockGetCredentials).toHaveBeenCalledWith({
          params: {
            cred_type: 'network',
            page_size: 100
          }
        });
      });
    });

    it('should perform server-side search when hasMorePages is true', async () => {
      const mockApiResponseWithPagination = {
        data: {
          results: mockCredentials,
          next: 'http://example.com/api/credentials/?page=2',
          previous: null,
          count: 150
        }
      };
      mockGetCredentials.mockResolvedValue(mockApiResponseWithPagination);

      render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={jest.fn()} />);

      const input = screen.getByRole('combobox');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Alpha')).toBeInTheDocument();
      });

      await userEvent.clear(input);
      await userEvent.type(input, 'test');

      await waitFor(() => {
        expect(mockGetCredentials).toHaveBeenCalledWith({
          params: {
            cred_type: 'network',
            page_size: 100,
            search_by_name: 'test'
          }
        });
      });
    });

    it('should perform local filtering when no more pages available', async () => {
      const mockApiResponseComplete = {
        data: {
          results: mockCredentials,
          next: null,
          previous: null,
          count: 3
        }
      };
      mockGetCredentials.mockResolvedValue(mockApiResponseComplete);

      render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={jest.fn()} />);

      const input = screen.getByRole('combobox');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Alpha')).toBeInTheDocument();
      });

      mockGetCredentials.mockClear();

      await userEvent.clear(input);
      await userEvent.type(input, 'Alpha');

      await waitFor(() => {
        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.queryByText('Beta')).not.toBeInTheDocument();
        expect(screen.queryByText('Gamma')).not.toBeInTheDocument();
      });

      expect(mockGetCredentials).not.toHaveBeenCalled();
    });

    it('should switch from server-side to local filtering when all data becomes available', async () => {
      const mockApiResponseWithPagination = {
        data: {
          results: mockCredentials.slice(0, 2),
          next: 'http://example.com/api/credentials/?page=2',
          previous: null,
          count: 150
        }
      };

      const mockApiResponseComplete = {
        data: {
          results: mockCredentials,
          next: null,
          previous: null,
          count: 3
        }
      };

      mockGetCredentials
        .mockResolvedValueOnce(mockApiResponseWithPagination)
        .mockResolvedValueOnce(mockApiResponseWithPagination)
        .mockResolvedValueOnce(mockApiResponseComplete);

      render(<TypeaheadCheckboxes credentialType="network" selectedOptions={[]} onChange={jest.fn()} />);

      const input = screen.getByRole('combobox');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Alpha')).toBeInTheDocument();
      });

      await userEvent.clear(input);
      await userEvent.type(input, 'test');

      await waitFor(() => {
        expect(mockGetCredentials).toHaveBeenCalledWith({
          params: {
            cred_type: 'network',
            page_size: 100,
            search_by_name: 'test'
          }
        });
      });

      await userEvent.clear(input);
      await userEvent.type(input, 'complete');

      await waitFor(() => {
        expect(mockGetCredentials).toHaveBeenCalledWith({
          params: {
            cred_type: 'network',
            page_size: 100,
            search_by_name: 'complete'
          }
        });
      });

      // Now test local filtering - no more API calls should be made
      await userEvent.clear(input);
      await userEvent.type(input, 'Alpha');

      await waitFor(() => {
        expect(screen.getByText('Alpha')).toBeInTheDocument();
      });

      // Verify no additional API calls were made during local filtering
      expect(mockGetCredentials).toHaveBeenCalledTimes(3); // Initial + 2 searches
    });
  });
});
