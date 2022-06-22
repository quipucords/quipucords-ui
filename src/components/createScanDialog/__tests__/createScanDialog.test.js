import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { ConnectedCreateScanDialog, CreateScanDialog } from '../createScanDialog';

describe('CreateScanDialog Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component with default props', () => {
    const store = generateEmptyStore({
      scansEdit: { show: true, sources: [{ name: 'test name' }] }
    });

    const component = shallow(
      <Provider store={store}>
        <ConnectedCreateScanDialog />
      </Provider>
    );

    expect(component.find(ConnectedCreateScanDialog)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      show: true,
      sources: [{ name: 'test name' }]
    };

    const component = mount(<CreateScanDialog {...props} />);

    expect(component.render()).toMatchSnapshot('non-connected');
  });

  it('should render nothing if sources are not provided', () => {
    const props = {
      show: true,
      sources: []
    };

    const component = mount(<CreateScanDialog {...props} />);

    expect(component.render()).toMatchSnapshot('empty');
  });

  it('should handle multiple error responses', () => {
    const props = {
      show: true,
      sources: [{ name: 'test name' }],
      error: true,
      errorMessage: 'lorem ipsum'
    };

    const component = mount(<CreateScanDialog {...props} />);
    expect(component.find('div[className~="alert-danger"]').render()).toMatchSnapshot('basic error');

    component.setProps({ submitErrorMessages: { scanName: 'lorem ipsum' } });
    expect(component.find('div[className~="has-error"]').render()).toMatchSnapshot('named error');
  });

  it('should correctly validate data', () => {
    const props = {
      show: true,
      sources: [{ name: 'test name' }]
    };

    const component = mount(<CreateScanDialog {...props} />);
    const componentInstance = component.instance();

    expect(
      componentInstance.onValidateForm({
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
      componentInstance.onValidateForm({
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
