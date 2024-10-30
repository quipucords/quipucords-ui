import React, { act } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AddCredentialModal, CredentialForm, getCleanedFormData, useCredentialForm } from '../addCredentialModal';

describe('AddCredentialModal', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    await act(() => {
      render(
        <AddCredentialModal
          isOpen={true}
          credentialType="network"
          credential={undefined}
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
    const component = await shallowComponent(<AddCredentialModal isOpen={true} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText(/Add\sCredential:\snetwork/i);
    expect(title).toMatchSnapshot('AddCredentialModal Title');
  });

  it('should call onSubmit with the correct filtered data when "Save" is clicked', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Enter a name for the credential'), 'Test Credential');
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit, filtered data');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('useCredentialForm', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize formData correctly', async () => {
    const result = renderHook(() => useCredentialForm({ credentialType: 'network' })).result;
    await act(() => expect(result.current.formData).toMatchSnapshot('formData'));
  });

  it('should derive token auth for specific credential types', () => {
    const { current: openshift } = renderHook(() => useCredentialForm({ credentialType: 'openshift' })).result;
    const { current: rhacs } = renderHook(() => useCredentialForm({ credentialType: 'rhacs' })).result;

    expect({
      openshift: openshift.authType,
      rhacs: rhacs.authType
    }).toMatchSnapshot('token auth');
  });

  it('should derive username + password for specific credential types', () => {
    const { current: network } = renderHook(() => useCredentialForm({ credentialType: 'network' })).result;
    const { current: vcenter } = renderHook(() => useCredentialForm({ credentialType: 'vcenter' })).result;
    const { current: satellite } = renderHook(() => useCredentialForm({ credentialType: 'satellite' })).result;
    const { current: ansible } = renderHook(() => useCredentialForm({ credentialType: 'ansible' })).result;

    expect({
      network: network.authType,
      vcenter: vcenter.authType,
      satellite: satellite.authType,
      ansible: ansible.authType
    }).toMatchSnapshot('username and password');
  });

  it('should update and filter formData when handleInputChange is called', () => {
    const result = renderHook(() => useCredentialForm({ credentialType: 'network' })).result;
    const mockValue = 'Lorem ipsum';

    act(() => result.current.handleInputChange('name', mockValue));
    expect(result.current.formData.name).toBe(mockValue);

    const filteredData = result.current.filterFormData();
    expect(filteredData.name).toBe(mockValue);
  });

  it('should allow editing a credential', async () => {
    const { result } = renderHook(() =>
      useCredentialForm({
        credential: {
          id: 123,
          name: 'lorem',
          auth_token: 'Ipsum',
          cred_type: 'openshift'
        }
      })
    );
    expect(result.current.formData).toMatchSnapshot('formData, edit');
  });
});

describe('CredentialForm', () => {
  it('should render a basic component', async () => {
    const component = await shallowComponent(<CredentialForm />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render specific to authType for type network', async () => {
    const mockUseForm = jest.fn();
    mockUseForm.mockReturnValue({ authType: 'SSH Key' });
    const props = {
      credentialType: 'network',
      useForm: mockUseForm
    };
    const networkSshKey = await shallowComponent(<CredentialForm {...props} />);
    expect(networkSshKey).toMatchSnapshot('network, SSH Key');

    mockUseForm.mockReturnValue({ authType: 'Username and Password' });
    props.useForm = mockUseForm;
    const networkUsernamePassword = await shallowComponent(<CredentialForm {...props} />);
    expect(networkUsernamePassword).toMatchSnapshot('network, Username and Password');
  });

  it('should render specific to authType for type openshift', async () => {
    const mockUseForm = jest.fn();
    mockUseForm.mockReturnValue({ authType: 'Username and Password' });
    const props = {
      credentialType: 'openshift',
      useForm: mockUseForm
    };
    const openshiftUsernamePassword = await shallowComponent(<CredentialForm {...props} />);
    expect(openshiftUsernamePassword).toMatchSnapshot('openshift, "Username and Password"');

    mockUseForm.mockReturnValue({ authType: 'Token' });
    props.useForm = mockUseForm;
    const openshiftToken = await shallowComponent(<CredentialForm {...props} />);
    expect(openshiftToken).toMatchSnapshot('openshift, "Token"');
  });

  it('should render form to different cred types appropriately', async () => {
    const credTypes = ['ansible', 'satellite', 'vcenter'];
    for (const type of credTypes) {
      const cred = await shallowComponent(<CredentialForm credentialType={type} />);
      expect(cred).toMatchSnapshot(`${type}, "Username and Password"`);
    }
  });

  it('should render form to rhacs appropriately', async () => {
    const rhacs = await shallowComponent(<CredentialForm credentialType="rhacs" />);
    expect(rhacs).toMatchSnapshot('rhacs, "Token"');
  });

  it('should call handlers for setAuthType and handleInputChange', async () => {
    const mockHandleInputChange = jest.fn();
    const mockSetAuthType = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <CredentialForm
        credentialType="network"
        onSubmit={mockOnSubmit}
        useForm={() => ({
          formData: { name: '', auth_token: '', username: '', password: '' },
          authType: 'Username and Password',
          typeValue: 'network',
          setAuthType: mockSetAuthType,
          handleInputChange: mockHandleInputChange,
          filterFormData: jest.fn()
        })}
      />
    );

    const user = userEvent.setup();

    await user.click(screen.getByText('Username and Password'));
    await user.click(screen.getByText('SSH Key'));
    expect(mockSetAuthType.mock.calls).toMatchSnapshot('setAuthType');

    await user.click(screen.getByText('Select option'));
    await user.click(screen.getByText('sudo'));
    expect(mockHandleInputChange).toHaveBeenCalledWith('become_method', 'sudo');
    expect(mockHandleInputChange.mock.calls).toMatchSnapshot('handleInputChange');
  });
});

describe('getCleanedFormData', () => {
  const formData = {
    name: 'Test Credential',
    username: 'test_user',
    password: 'test_password',
    auth_token: 'test_token',
    ssh_key: 'test_ssh_key',
    ssh_passphrase: 'test_passphrase'
  };

  it('should clean formData correctly for different authTypes', () => {
    const authTypes = ['Token', 'Username and Password', 'SSH Key'];
    for (const type of authTypes) {
      const cleanedData = getCleanedFormData(formData, type);
      expect(cleanedData).toMatchSnapshot(`${type}" auth cleanedData "`);
    }
  });
});
