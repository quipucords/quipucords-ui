import React from 'react';
import { CreateCredentialDialog, becomeMethodTypeOptions } from '../createCredentialDialog';

describe('CreateCredentialDialog Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'network'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect(component.screen.render()).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect({
      becomeMethodTypeOptions
    }).toMatchSnapshot('options');
  });

  it('should handle a pending display state', () => {
    const props = {
      useCredential: () => ({
        pending: true,
        show: true,
        add: true,
        credentialType: 'satellite'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect(component.screen.render().querySelector('.pf-c-modal-box__body')).toMatchSnapshot('pending');
  });

  it('should handle variations in basic form display for network credential type', () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'network'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.screen.render().querySelectorAll('input'),
      ...component.screen.render().querySelectorAll('.quipucords-select')
    ]).toMatchSnapshot('network');
  });

  it('should handle variations in basic form display for openshift credential type', () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'openshift'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.screen.render().querySelectorAll('input'),
      ...component.screen.render().querySelectorAll('.quipucords-select')
    ]).toMatchSnapshot('openshift');
  });

  it('should handle variations in basic form display for satellite credential type', () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'satellite'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.screen.render().querySelectorAll('input'),
      ...component.screen.render().querySelectorAll('.quipucords-select')
    ]).toMatchSnapshot('satellite');
  });

  it('should handle variations in basic form display for vcenter credential type', () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'vcenter'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.screen.render().querySelectorAll('input'),
      ...component.screen.render().querySelectorAll('.quipucords-select')
    ]).toMatchSnapshot('vcenter');
  });

  it('should handle variations in basic form display for ansible credential type', () => {
    const props = {
      useCredential: () => ({
        show: true,
        add: true,
        credentialType: 'ansible'
      })
    };

    const component = renderComponent(<CreateCredentialDialog {...props} />);
    expect([
      ...component.screen.render().querySelectorAll('input'),
      ...component.screen.render().querySelectorAll('.quipucords-select')
    ]).toMatchSnapshot('ansible');
  });
});
