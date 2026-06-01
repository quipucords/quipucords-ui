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

describe('Conditional Deep Scan Display', () => {
  it('should show deep scan options when scanning a network source', async () => {
    const networkSources = [
      {
        id: 1,
        name: 'Network Source',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: false,
        disable_ssl: false
      }
    ];

    let baseElement;
    await act(async () => {
      ({ baseElement } = render(<AddSourcesScanModal isOpen={true} sources={networkSources} />));
    });

    expect(baseElement).toMatchSnapshot('network source with deep scan options');
  });

  it('should NOT show deep scan options when scanning a non-network source', async () => {
    const satelliteSources = [
      {
        id: 1,
        name: 'Satellite Source',
        port: 443,
        source_type: 'satellite',
        hosts: ['satellite.example.com'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: true,
        disable_ssl: false
      }
    ];

    let baseElement;
    await act(async () => {
      ({ baseElement } = render(<AddSourcesScanModal isOpen={true} sources={satelliteSources} />));
    });

    expect(baseElement).toMatchSnapshot('non-network source without deep scan options');
  });

  it('should show deep scan options when scanning mixed source types including network', async () => {
    const mixedSources = [
      {
        id: 1,
        name: 'Network Source',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: false,
        disable_ssl: false
      },
      {
        id: 2,
        name: 'Satellite Source',
        port: 443,
        source_type: 'satellite',
        hosts: ['satellite.example.com'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: true,
        disable_ssl: false
      }
    ];

    let baseElement;
    await act(async () => {
      ({ baseElement } = render(<AddSourcesScanModal isOpen={true} sources={mixedSources} />));
    });

    expect(baseElement).toMatchSnapshot('mixed sources with deep scan options');
  });

  it('should NOT show deep scan options when scanning multiple non-network sources', async () => {
    const nonNetworkSources = [
      {
        id: 1,
        name: 'Satellite Source',
        port: 443,
        source_type: 'satellite',
        hosts: ['satellite.example.com'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: true,
        disable_ssl: false
      },
      {
        id: 2,
        name: 'vCenter Source',
        port: 443,
        source_type: 'vcenter',
        hosts: ['vcenter.example.com'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: true,
        disable_ssl: false
      }
    ];

    let baseElement;
    await act(async () => {
      ({ baseElement } = render(<AddSourcesScanModal isOpen={true} sources={nonNetworkSources} />));
    });

    expect(baseElement).toMatchSnapshot('multiple non-network sources without deep scan options');
  });

  it('should show search directories field when deep scan is checked and source is network', async () => {
    const networkSources = [
      {
        id: 1,
        name: 'Network Source',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
        ssl_cert_verify: false,
        disable_ssl: false
      }
    ];

    let baseElement;
    await act(async () => {
      ({ baseElement } = render(<AddSourcesScanModal isOpen={true} sources={networkSources} />));
    });

    // Click a deep scan checkbox
    const user = userEvent.setup();
    const jbossEapCheckbox = screen.getByLabelText(/deep-scan\.jboss_eap/);
    await user.click(jbossEapCheckbox);

    // Now search directories field should appear
    expect(baseElement).toMatchSnapshot('network source with search directories after deep scan check');
  });

  it('should NOT show search directories field for non-network sources even if sources prop is undefined', async () => {
    let baseElement;
    await act(async () => {
      ({ baseElement } = render(<AddSourcesScanModal isOpen={true} sources={undefined} />));
    });

    expect(baseElement).toMatchSnapshot('undefined sources without deep scan options');
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
    const sources = [
      {
        id: 1,
        name: 'Source 1',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
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
    const initialSources = [
      {
        id: 1,
        name: 'Source 1',
        port: 22,
        source_type: 'network',
        hosts: ['host1'],
        exclude_hosts: [],
        credentials: [],
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
