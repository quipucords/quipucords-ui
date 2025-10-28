import React, { act } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AddSourcesScanModal, useScanForm } from '../addSourcesScanModal';

describe('AddSourceModal', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(async () => {
    await act(async () => {
      mockOnClose = jest.fn();
      mockOnSubmit = jest.fn(() => Promise.resolve({}));
      await render(<AddSourcesScanModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render a basic component', async () => {
    const component = await shallowComponent(<AddSourcesScanModal isOpen={true} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should call onSubmit with the correct filtered data when "Save" is clicked', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/scan-modal\.name\.placeholder/), 'Test Scan');
    await user.click(screen.getByText(/actions\.save/));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit, filtered data');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/actions\.cancel/));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('Form Validation', () => {
  it('should validate required fields and show canSubmit correctly', async () => {
    const { result } = renderHook(() => useScanForm());

    expect(result.current.canSubmit).toBe(false);

    await act(() => {
      result.current.handleInputChange('name', 'Test Scan');
    });

    expect(result.current.canSubmit).toBe(true);
  });

  it('should call onClearErrors when user types in a field with server errors', async () => {
    const mockOnClearErrors = jest.fn();
    const serverErrors = { name: 'Scan name already exists' };

    const { result } = renderHook(() =>
      useScanForm({
        errors: serverErrors,
        onClearErrors: mockOnClearErrors
      })
    );

    await act(() => {
      result.current.handleInputChange('name', 'New scan name');
    });

    expect(mockOnClearErrors).toHaveBeenCalled();
  });

  it('should show validation errors for required fields when touched', async () => {
    const { result } = renderHook(() => useScanForm());

    await act(() => {
      result.current.handleInputChange('name', '');
    });

    expect(result.current.touchedFields.has('name')).toBe(true);
    expect(result.current.errors.name).toContain('view.sources.scan-modal.error-field-required');
  });

  it('should handle deep scan selections correctly', async () => {
    const { result } = renderHook(() => useScanForm());

    expect(result.current.formData.deepScans).toEqual([]);

    await act(() => {
      result.current.handleInputChange('deepScans', ['jboss_eap']);
    });

    expect(result.current.formData.deepScans).toEqual(['jboss_eap']);

    await act(() => {
      result.current.handleInputChange('deepScans', ['jboss_eap', 'jboss_fuse']);
    });

    expect(result.current.formData.deepScans).toEqual(['jboss_eap', 'jboss_fuse']);
  });

  it('should handle max concurrency changes correctly', async () => {
    const { result } = renderHook(() => useScanForm());

    expect(result.current.formData.maxConcurrency).toBe(25);

    await act(() => {
      result.current.handleInputChange('maxConcurrency', 50);
    });

    expect(result.current.formData.maxConcurrency).toBe(50);
  });

  it('should filter form data correctly for API submission', async () => {
    const mockConnection = {
      end_time: '2023-01-01T00:00:00Z',
      id: 1,
      report_id: 1,
      source_systems_count: 1,
      source_systems_failed: 0,
      source_systems_scanned: 1,
      source_systems_unreachable: 0,
      start_time: '2023-01-01T00:00:00Z',
      status: 'completed',
      status_details: { job_status_message: 'Success' },
      systems_count: 1,
      systems_scanned: 1,
      systems_failed: 0
    };

    const sources = [
      {
        id: 1,
        name: 'Source 1',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
        connection: mockConnection,
        ssl_cert_verify: false,
        disable_ssl: false
      },
      {
        id: 2,
        name: 'Source 2',
        port: 22,
        source_type: 'network',
        hosts: ['host2'],
        exclude_hosts: [],
        credentials: [],
        connection: { ...mockConnection, id: 2 },
        ssl_cert_verify: false,
        disable_ssl: false
      }
    ];

    const { result } = renderHook(() => useScanForm({ sources }));

    await act(() => {
      result.current.handleInputChange('name', 'Test Scan');
      result.current.handleInputChange('maxConcurrency', 30);
      result.current.handleInputChange('deepScans', ['jboss_eap']);
      result.current.handleInputChange('searchDirectories', '/opt, /app');
    });

    const filteredData = result.current.filterFormData();

    expect(filteredData).toEqual({
      name: 'Test Scan',
      sources: [1, 2],
      scan_type: 'inspect',
      options: {
        max_concurrency: 30,
        disabled_optional_products: {
          jboss_eap: false,
          jboss_fuse: false,
          jboss_ws: false
        },
        enabled_extended_product_search: {
          jboss_eap: true,
          jboss_fuse: false,
          jboss_ws: false,
          search_directories: ['/opt', '/app']
        }
      }
    });
  });

  it('should combine server and local errors correctly', async () => {
    const serverErrors = { name: 'Server error for name' };
    const { result } = renderHook(() => useScanForm({ errors: serverErrors }));

    await act(() => {
      result.current.handleInputChange('maxConcurrency', '');
    });

    expect(result.current.errors.name).toBe('Server error for name');
  });

  it('should reset form when sources change', async () => {
    const mockConnection = {
      end_time: '2023-01-01T00:00:00Z',
      id: 1,
      report_id: 1,
      source_systems_count: 1,
      source_systems_failed: 0,
      source_systems_scanned: 1,
      source_systems_unreachable: 0,
      start_time: '2023-01-01T00:00:00Z',
      status: 'completed',
      status_details: { job_status_message: 'Success' },
      systems_count: 1,
      systems_scanned: 1,
      systems_failed: 0
    };

    const initialSources = [
      {
        id: 1,
        name: 'Source 1',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
        connection: mockConnection,
        ssl_cert_verify: false,
        disable_ssl: false
      }
    ];
    const { result, rerender } = renderHook(({ sources }) => useScanForm({ sources }), {
      initialProps: { sources: initialSources }
    });

    await act(() => {
      result.current.handleInputChange('name', 'Test Scan');
    });

    expect(result.current.formData.name).toBe('Test Scan');

    const newSources = [
      {
        id: 2,
        name: 'Source 2',
        port: 22,
        source_type: 'network',
        hosts: ['host2'],
        exclude_hosts: [],
        credentials: [],
        connection: { ...mockConnection, id: 2 },
        ssl_cert_verify: false,
        disable_ssl: false
      }
    ];
    rerender({ sources: newSources });

    // Form should reset
    expect(result.current.formData.name).toBe('');
    expect(result.current.formData.sources).toEqual(newSources);
  });
});
