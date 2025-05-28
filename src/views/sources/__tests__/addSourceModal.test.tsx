import React, { act } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AddSourceModal, SourceForm, useSourceForm } from '../addSourceModal';

describe('AddSourceModal', () => {
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
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize formData correctly', async () => {
    const result = renderHook(() => useSourceForm({ sourceType: 'network' })).result;
    await act(() => expect(result.current.formData).toMatchSnapshot('formData'));
  });

  it('should allow editing a source', async () => {
    const result = renderHook(() =>
      useSourceForm({
        source: {
          id: 123,
          name: 'lorem',
          port: 456,
          source_type: 'openshift'
        }
      })
    ).result;

    await act(() => expect(result.current.formData).toMatchSnapshot('formData, edit'));
  });

  it('should update and filter formData when handleInputChange is called', async () => {
    const result = renderHook(() => useSourceForm({ sourceType: 'network' })).result;
    const mockValue = 'Lorem ipsum';

    await act(() => result.current.handleInputChange('name', mockValue));
    expect(result.current.formData.name).toBe(mockValue);

    const filteredData = result.current.filterFormData();
    expect(filteredData.name).toBe(mockValue);
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
      const portFormGroup = component.querySelector('#source-port').closest('.pf-v5-c-form__group');
      const portHelperText = portFormGroup.querySelector('.pf-v5-c-helper-text');
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
