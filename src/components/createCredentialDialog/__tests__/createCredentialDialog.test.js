import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { ConnectedCreateCredentialDialog, CreateCredentialDialog } from '../createCredentialDialog';

describe('CreateCredentialDialog Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ credentials: { update: { show: true } }, viewOptions: {} });

    const component = shallow(<ConnectedCreateCredentialDialog />, { context: { store } });
    expect(component.dive()).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      show: false
    };

    const component = mount(<CreateCredentialDialog {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
