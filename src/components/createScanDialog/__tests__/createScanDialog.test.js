import React from 'react';
import { CreateScanDialog } from '../createScanDialog';

describe('CreateScanDialog Component', () => {
  it('should render a basic component', () => {
    const props = {
      show: true,
      sources: [{ name: 'test name' }]
    };

    const component = renderComponent(<CreateScanDialog {...props} />);
    expect(component.screen.render()).toMatchSnapshot('basic');
  });

  it('should render nothing if sources are not provided', () => {
    const props = {
      show: true,
      sources: []
    };

    const component = renderComponent(<CreateScanDialog {...props} />);
    expect(component.screen.render()).toMatchSnapshot('empty');
  });

  it('should render a component, pending', () => {
    const props = {
      pending: true,
      show: true,
      sources: [{ name: 'test name' }]
    };

    const component = renderComponent(<CreateScanDialog {...props} />);
    expect(component.screen.render().querySelector('.pf-c-modal-box__body')).toMatchSnapshot('pending');
  });

  it('should handle multiple error responses', () => {
    const props = {
      show: true,
      sources: [{ name: 'test name' }],
      error: true,
      errorMessage: 'lorem ipsum'
    };

    const component = renderComponent(<CreateScanDialog {...props} />);
    expect(component.screen.getByLabelText('Danger Alert')).toMatchSnapshot('basic error');

    const componentNamedError = component.setProps({ submitErrorMessages: { scanName: 'dolor sit' } });
    expect(componentNamedError.screen.render().querySelectorAll('[id*="scanName"]')).toMatchSnapshot('named error');
  });

  it('should correctly validate data', () => {
    const props = {
      show: true,
      sources: [{ name: 'test name' }]
    };

    const component = renderComponent(<CreateScanDialog {...props} />);

    expect(
      component.instance.onValidateForm({
        values: {
          scanName: '',
          scanDirectories: ['/ipsum']
        },
        checked: {
          jbossEap: false
        }
      })
    ).toMatchSnapshot('form invalid');

    expect(
      component.instance.onValidateForm({
        values: {
          scanName: 'lorem',
          scanDirectories: ['/ipsum']
        },
        checked: {
          jbossEap: true
        }
      })
    ).toMatchSnapshot('form valid');
  });
});
