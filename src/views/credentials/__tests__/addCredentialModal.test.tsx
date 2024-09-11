import React, { act } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
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

  it('should render vcenter form appropriately', async () => {
    const vcenter = await shallowComponent(<CredentialFormFields typeValue="vcenter" />);
    expect(vcenter).toMatchSnapshot('vcenter, "Username and Password"');
  });

  it('should render satellite form appropriately', async () => {
    const satellite = await shallowComponent(<CredentialFormFields typeValue="satellite" />);
    expect(satellite).toMatchSnapshot('satellite, "Username and Password"');
  });

  it('should render ansible form appropriately', async () => {
    const ansible = await shallowComponent(<CredentialFormFields typeValue="ansible" />);
    expect(ansible).toMatchSnapshot('ansible, "Username and Password"');
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
