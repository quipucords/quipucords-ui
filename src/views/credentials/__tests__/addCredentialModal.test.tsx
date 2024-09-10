import React, { act } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import helpers from '../../../helpers';
import { AddCredentialModal, CredentialFormFields, useCredentialForm } from '../addCredentialModal';

describe('AddCredentialModal', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const component = await shallowComponent(<AddCredentialModal isOpen={true} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText('Add Credential: network');
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
  it('should initialize formData correctly', () => {
    const { current } = renderHook(() => useCredentialForm('network')).result;
    expect(current.formData).toMatchSnapshot('formData');
  });

  it('should derive token auth for specific credential types', () => {
    const { current: openshift } = renderHook(() => useCredentialForm('openshift')).result;
    const { current: rhacs } = renderHook(() => useCredentialForm('rhacs')).result;

    expect({
      openshift: openshift.authType,
      rhacs: rhacs.authType
    }).toMatchSnapshot('token auth');
  });

  it('should derive auth type based on the provided credential', () => {
    const mockCredential = {
      id: 1,
      name: 'Test Credential',
      username: 'admin',
      password: '',
      cred_type: 'network',
      created_at: new Date(),
      updated_at: new Date(),
      ssh_key: 'ssh-key',
      auth_token: '',
      ssh_passphrase: '',
      become_method: '',
      become_password: '',
      become_user: '',
      sources: []
    };
    jest.spyOn(helpers, 'getAuthType').mockReturnValue(helpers.authType.SSHKey);
    const { current: credentialBased } = renderHook(() => useCredentialForm('network', mockCredential)).result;
    expect(credentialBased.authType).toBe('SSH Key');
    expect(credentialBased.authType).toMatchSnapshot('auth type based on credential');
  });

  it('should update and filter formData when handleInputChange is called', () => {
    const result = renderHook(() => useCredentialForm('network')).result;
    const mockValue = 'Lorem ipsum';

    act(() => result.current.handleInputChange('name', mockValue));
    expect(result.current.formData.name).toBe(mockValue);

    const filteredData = result.current.filterFormData(result.current.formData);
    expect(filteredData.name).toBe(mockValue);
  });
});

describe('CredentialFormFields', () => {
  it('should render a basic component', async () => {
    const component = await shallowComponent(<CredentialFormFields />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render specific to authType for type network', async () => {
    const networkUsernamePassword = await shallowComponent(
      <CredentialFormFields typeValue="network" authType="Username and Password" />
    );
    expect(networkUsernamePassword).toMatchSnapshot('network, Username and Password');

    const networkSshKey = await shallowComponent(<CredentialFormFields typeValue="network" authType="SSH Key" />);
    expect(networkSshKey).toMatchSnapshot('network, SSH Key');
  });

  it('should render specific to authType for type openshift', async () => {
    const openshiftUsernamePassword = await shallowComponent(
      <CredentialFormFields typeValue="openshift" authType="Username and Password" />
    );
    expect(openshiftUsernamePassword).toMatchSnapshot('openshift, "Username and Password"');

    const openshiftToken = await shallowComponent(<CredentialFormFields typeValue="openshift" authType="Token" />);
    expect(openshiftToken).toMatchSnapshot('openshift, "Token"');
  });

  it('should call handlers for setAuthType and handleInputChange', async () => {
    const mockHandleInputChange = jest.fn();
    const mockSetAuthType = jest.fn();
    render(
      <CredentialFormFields
        typeValue="network"
        authType="Username and Password"
        setAuthType={mockSetAuthType}
        handleInputChange={mockHandleInputChange}
      />
    );

    const user = userEvent.setup();

    await user.click(screen.getByText('Username and Password'));
    await user.click(screen.getByText('SSH Key'));
    expect(mockSetAuthType.mock.calls).toMatchSnapshot('setAuthType');

    await user.click(screen.getByText('Select option'));
    await user.click(screen.getByText('sudo'));
    expect(mockHandleInputChange.mock.calls).toMatchSnapshot('handleInputChange');
  });
});

describe('AddCredentialModal-Edit', () => {
  let mockOnClose;
  let mockOnSubmit;
  let mockCredential;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    mockCredential = {
      id: 1,
      name: 'Test Credential',
      username: 'admin',
      password: '',
      cred_type: 'network',
      created_at: new Date(),
      updated_at: new Date(),
      ssh_key: 'ssh-key',
      auth_token: '',
      ssh_passphrase: '',
      become_method: '',
      become_password: '',
      become_user: '',
      sources: []
    };
    render(
      <AddCredentialModal
        isOpen={true}
        credentialType="network"
        credential={mockCredential}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have the correct title', () => {
    const title = screen.getByText('Edit Credential');
    expect(title).toMatchSnapshot('AddCredentialModal-edit Title');
  });

  it('should call onSubmit with the correct filtered data when "Save" is clicked', async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByPlaceholderText('Enter a name for the credential'));
    await user.type(screen.getByPlaceholderText('Enter a name for the credential'), 'Test Credential25');
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit-edit, filtered data');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
