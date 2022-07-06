import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import { ConnectedConfirmationModal, ConfirmationModal } from '../confirmationModal';

describe('Confirmation Modal Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      confirmationModal: {
        show: true,
        title: 'Confirm',
        heading: 'test',
        icon: null,
        body: 'Test body',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    });
    const component = shallow(
      <Provider store={store}>
        <ConnectedConfirmationModal />
      </Provider>
    );

    expect(component.find(ConnectedConfirmationModal)).toMatchSnapshot('connected');
  });

  it('should display a confirmation modal', async () => {
    const onCancel = jest.fn();
    const props = {
      show: true,
      title: 'Confirm',
      heading: 'test',
      icon: null,
      body: 'Test body',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      onCancel
    };

    const component = await mountHookComponent(<ConfirmationModal {...props} />);
    expect(component.render()).toMatchSnapshot('show');

    component.find('button[className="pf-c-button pf-m-secondary"]').simulate('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should NOT display a confirmation modal', async () => {
    const props = {
      show: false
    };

    const component = await mountHookComponent(<ConfirmationModal {...props} />);
    expect(component.render()).toMatchSnapshot('hidden');
  });

  it('should allow passed children, or specific props', async () => {
    const props = {
      show: true,
      heading: 'Lorem ipsum',
      children: 'hello world'
    };

    const component = await mountHookComponent(<ConfirmationModal {...props} />);
    expect(component.find('.pf-c-modal-box__body').render()).toMatchSnapshot('heading');

    component.setProps({
      heading: null,
      body: 'Dolor sit'
    });

    expect(component.find('.pf-c-modal-box__body').render()).toMatchSnapshot('body');

    component.setProps({
      body: null
    });

    expect(component.find('.pf-c-modal-box__body').render()).toMatchSnapshot('children');
  });

  it('should allow custom content', async () => {
    const props = {
      show: true,
      isActions: false,
      isClose: false,
      isContentOnly: true
    };

    const component = await mountHookComponent(<ConfirmationModal {...props}>lorem ipsum</ConfirmationModal>);
    expect(component.render()).toMatchSnapshot('custom');
  });
});
