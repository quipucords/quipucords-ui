import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import {
  ConnectedCreateCredentialDialog,
  CreateCredentialDialog,
  authenticationTypeOptions
} from '../createCredentialDialog';

describe('CreateCredentialDialog Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ credentials: { update: { show: true } }, viewOptions: {} });

    const component = mount(
      <Provider store={store}>
        <ConnectedCreateCredentialDialog />
      </Provider>
    );

    expect(component.render()).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      show: false
    };

    const component = shallow(<CreateCredentialDialog {...props} />);
    expect(component.render()).toMatchSnapshot('non-connected');
  });

  it('should export select options', () => {
    expect(
      authenticationTypeOptions.map(({ title, ...option }) => ({
        ...option,
        title: (typeof title === 'function' && title()) || title
      }))
    ).toMatchSnapshot('options');
  });
});
