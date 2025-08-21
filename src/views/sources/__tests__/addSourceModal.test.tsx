import React, { act } from 'react';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AddSourceModal, SourceForm, useSourceForm } from '../addSourceModal';

describe('AddSourceModal-network', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    await act(async () => {
      render(
        <AddSourceModal
          isOpen={true}
          sourceType="network"
          source={undefined}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const component = await shallowComponent(<AddSourceModal isOpen={true} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText(/Add\sSource:\snetwork/i);
    expect(title).toMatchSnapshot('title');
  });

  it('submits correct data for a network source (with use_paramiko)', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Enter a name for the source'), 'Test SSH');
    await user.click(screen.getByLabelText('Connect using Paramiko instead of Open SSH'));
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test SSH',
        use_paramiko: true,
        port: '22',
        source_type: 'network'
      })
    );
  });

  it('should call onSubmit with the correct filtered data when "Save" is clicked', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Enter a name for the source'), 'Test Source');
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit, filtered data');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('AddSourceModal-openshift', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));
    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = async () => {
    await act(async () => {
      render(<AddSourceModal isOpen={true} sourceType="openshift" onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
  };

  it('submits correct SSL values for openshift', async () => {
    const user = userEvent.setup();
    await renderModal();

    await user.type(screen.getByPlaceholderText('Enter a name for the source'), 'Test HTTP');
    await user.click(screen.getByText('SSLv23'));
    await user.click(screen.getByText('TLSv1.2'));
    await user.click(screen.getByLabelText('Verify SSL certificate'));
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test HTTP',
        port: '6443',
        source_type: 'openshift',
        ssl_protocol: 'TLSv1_2',
        ssl_cert_verify: false,
        disable_ssl: false
      })
    );
  });

  it('submits disable_ssl=true and omits ssl_protocol when disabled', async () => {
    const user = userEvent.setup();
    await renderModal();

    await user.type(screen.getByPlaceholderText('Enter a name for the source'), 'Disable SSL');
    await user.click(screen.getByText('SSLv23'));
    await user.click(screen.getByText('Disable SSL'));
    await user.click(screen.getByText('Save'));

    const submitted = mockOnSubmit.mock.calls[0][0];
    expect(submitted.name).toBe('Disable SSL');
    expect(submitted.disable_ssl).toBe(true);
    expect(submitted).not.toHaveProperty('ssl_protocol');
  });
});

describe('AddSourceModalWithProxy', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    await act(() => {
      render(
        <AddSourceModal
          isOpen={true}
          sourceType="openshift"
          source={undefined}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update proxy_url and submit it', async () => {
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Enter a name for the source'), 'Test Source');
    await user.type(screen.getByTestId('input-host'), '192.168.0.1');
    await user.type(screen.getByTestId('input-port'), '8443');
    await user.type(screen.getByTestId('input-proxy'), 'http://proxy.example.com:8888');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit with proxy_url');
  });
});

describe('useSourceForm', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        results: []
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize formData correctly', async () => {
    const result = renderHook(() => useSourceForm({ sourceType: 'network' })).result;
    await act(() => expect(result.current.formData).toMatchSnapshot('formData'));
  });

  it('initializes formData from V2 fields in edit mode', async () => {
    const { result } = renderHook(() =>
      useSourceForm({
        source: {
          id: 123,
          name: 'EditMe',
          port: 456,
          source_type: 'openshift',
          ssl_cert_verify: true,
          ssl_protocol: 'TLSv1_1',
          disable_ssl: false,
          use_paramiko: false
        }
      })
    );

    await waitFor(() => {
      expect(result.current.formData.name).toBe('EditMe');
      expect(result.current.formData.port).toBe('456');
      expect(result.current.formData.sslVerify).toBe(true);
      expect(result.current.formData.sslProtocol).toBe('TLSv1.1');
    });
  });

  it('should update and filter formData when handleInputChange is called', async () => {
    const result = renderHook(() => useSourceForm({ sourceType: 'network' })).result;
    const mockValue = 'Lorem ipsum';

    await act(() => result.current.handleInputChange('name', mockValue));
    expect(result.current.formData.name).toBe(mockValue);

    const filteredData = result.current.filterFormData();
    expect(filteredData.name).toBe(mockValue);
    expect(filteredData.use_paramiko).toBe(false);
  });

  it('correctly maps sslProtocol label to API value', async () => {
    const { result } = renderHook(() => useSourceForm({ sourceType: 'openshift' }));

    await act(async () => {
      result.current.handleInputChange('name', 'SSL Source');
    });

    await act(async () => {
      result.current.handleInputChange('sslVerify', true);
    });

    await act(async () => {
      result.current.handleInputChange('sslProtocol', 'TLSv1.1');
    });

    const payload = result.current.filterFormData();

    expect(payload.ssl_protocol).toBe('TLSv1_1');
    expect(payload.ssl_cert_verify).toBe(true);
    expect(payload.disable_ssl).toBe(false);
  });

  it('should include proxy_url in the filtered formData for non-network types', async () => {
    const { result } = renderHook(() =>
      useSourceForm({
        sourceType: 'openshift'
      })
    );

    await act(() => {
      result.current.handleInputChange('proxy_url', 'https://proxy.mycompany.com:443');
    });

    const filteredData = result.current.filterFormData();
    expect(filteredData.proxy_url).toBe('https://proxy.mycompany.com:443');
    expect(filteredData).toMatchSnapshot('filteredData with proxy_url');
  });
});

describe('SourceForm', () => {
  it('should render a basic component', async () => {
    const component = await shallowComponent(<SourceForm />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render specifics to different source types', async () => {
    const sourceTypes = ['network', 'openshift', 'rhacs', 'ansible', 'satellite', 'vcenter'];
    for (const type of sourceTypes) {
      const component = await shallowComponent(<SourceForm sourceType={type} />);
      const portHelperText = component.querySelector('#source-port-helper-text');
      expect(portHelperText).toMatchSnapshot(`form, ${type}`);
    }
  });

  it('should render proxy_url field for non-network sources', async () => {
    const sourceTypes = ['openshift', 'rhacs', 'ansible', 'satellite', 'vcenter'];

    for (const type of sourceTypes) {
      const component = await shallowComponent(<SourceForm sourceType={type} />);
      const proxyInput = component.querySelector('#proxy-url');

      expect(proxyInput).toBeTruthy();
      expect(proxyInput?.getAttribute('placeholder')).toBe('Optional');
      expect(component).toMatchSnapshot(`proxy_url presence, ${type}`);
    }
  });

  it('should not render proxy_url field for network sources', async () => {
    const component = await shallowComponent(<SourceForm sourceType="network" />);
    const proxyInput = component.querySelector('#proxy-url');

    expect(proxyInput).toBeNull();
    expect(component).toMatchSnapshot(`proxy_url presence, network`);
  });
});
