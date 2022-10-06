import React from 'react';
import { EmptyState } from '@patternfly/react-core';
import { DropdownSelect } from '../../dropdownSelect/dropdownSelect';
import { CreateCredentialDialog, authenticationTypeOptions, becomeMethodTypeOptions } from '../createCredentialDialog';

describe('CreateCredentialDialog Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'network'
      })
    };

    const component = await shallowHookComponent(<CreateCredentialDialog {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect({
      authenticationTypeOptions,
      becomeMethodTypeOptions
    }).toMatchSnapshot('options');
  });

  it('should handle a pending display state', async () => {
    const props = {
      useCredential: () => ({
        pending: true,
        show: true,
        add: true,
        credentialType: 'satellite'
      })
    };

    const component = await mountHookComponent(<CreateCredentialDialog {...props} />);
    expect(component.find(EmptyState)).toMatchSnapshot('pending');
  });

  it('should handle variations in basic form display for network credential type', async () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'network'
      })
    };

    const component = await mountHookComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.find('input').map(item => item.props()),
      ...component.find(DropdownSelect).map(item => item.props())
    ]).toMatchSnapshot('network');
  });

  it('should handle variations in basic form display for openshift credential type', async () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'openshift'
      })
    };

    const component = await mountHookComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.find('input').map(item => item.props()),
      ...component.find(DropdownSelect).map(item => item.props())
    ]).toMatchSnapshot('openshift');
  });

  it('should handle variations in basic form display for satellite credential type', async () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'satellite'
      })
    };

    const component = await mountHookComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.find('input').map(item => item.props()),
      ...component.find(DropdownSelect).map(item => item.props())
    ]).toMatchSnapshot('satellite');
  });

  it('should handle variations in basic form display for vcenter credential type', async () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'vcenter'
      })
    };

    const component = await mountHookComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.find('input').map(item => item.props()),
      ...component.find(DropdownSelect).map(item => item.props())
    ]).toMatchSnapshot('vcenter');
  });
});
