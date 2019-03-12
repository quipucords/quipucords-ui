import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { ConnectedAboutModal, AboutModal } from '../aboutModal';

describe('AboutModal Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component with default props', () => {
    const store = generateEmptyStore({
      aboutModal: { show: true },
      user: { session: { username: 'lorem' } },
      status: { apiVersion: 1 }
    });
    const component = shallow(<ConnectedAboutModal />, { context: { store } });

    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      show: false,
      apiVersion: 1,
      username: 'admin'
    };

    const component = mount(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('hidden modal');
  });

  it('should contain brand', () => {
    const props = {
      show: true,
      brand: true
    };

    const component = shallow(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('brand');
  });
});
