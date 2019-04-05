import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { ConnectedCredentialListItem, CredentialListItem } from '../credentialListItem';
import { viewTypes } from '../../../redux/constants';

describe('CredentialListItem Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ credentials: {}, viewOptions: { [viewTypes.CREDENTIALS_VIEW]: {} } });

    const props = {
      item: {
        id: 1,
        cred_type: 'network'
      }
    };

    const component = shallow(<ConnectedCredentialListItem {...props} />, { context: { store } });
    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      item: {
        id: 1,
        cred_type: 'network'
      }
    };

    const component = mount(<CredentialListItem {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
