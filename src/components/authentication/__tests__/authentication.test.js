import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { Alert } from '@patternfly/react-core';
import { ConnectedAuthentication, Authentication } from '../authentication';

describe('Authentication Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      user: { session: { authorized: false, error: false, errorMessage: '', pending: false } }
    });
    const component = shallow(
      <Provider store={store}>
        <ConnectedAuthentication>
          <span className="test">lorem</span>
        </ConnectedAuthentication>
      </Provider>
    );

    expect(component.find(ConnectedAuthentication)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component error', () => {
    const props = {
      session: {
        authorized: false,
        error: true,
        errorMessage: 'Authentication credentials were not provided.',
        pending: false
      }
    };
    const component = mount(
      <BrowserRouter>
        <Authentication {...props}>
          <span className="test">lorem</span>
        </Authentication>
      </BrowserRouter>
    );

    expect(component.find(Alert)).toMatchSnapshot('non-connected error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      session: {
        authorized: false,
        error: false,
        errorMessage: '',
        pending: true
      }
    };
    const component = shallow(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('non-connected pending');
  });

  it('should render a non-connected component authorized', () => {
    const props = {
      session: {
        authorized: true,
        error: false,
        errorMessage: '',
        pending: false
      }
    };
    const component = mount(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('non-connected authorized');
  });
});
