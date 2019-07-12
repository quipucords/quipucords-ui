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
      status: { serverVersion: '0.0.0.0000000' }
    });

    const component = shallow(<ConnectedAboutModal />, { context: { store } });
    expect(component.dive()).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      show: false,
      serverVersion: '0.0.0.0000000',
      username: 'admin'
    };

    const component = mount(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('hidden modal');
  });

  it('should contain brand', () => {
    const props = {
      show: true,
      uiBrand: true,
      uiName: 'Lorem ipsum',
      uiShortName: 'Ipsum'
    };

    const component = shallow(<AboutModal {...props} />);
    expect(component).toMatchSnapshot('brand');
  });

  it('should have a copy event that updates state', () => {
    const props = {
      show: true,
      serverVersion: '0.0.0.0000000',
      uiBrand: true,
      reset: 100
    };

    const component = mount(<AboutModal {...props} />);
    expect(component.state()).toMatchSnapshot('pre copy event');

    component.find('button[className~="quipucords-about-modal-copy-button"]').simulate('click');

    expect(component.state()).toMatchSnapshot('post copy event');
  });
});
