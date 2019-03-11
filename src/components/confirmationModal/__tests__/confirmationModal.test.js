import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
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
    const component = shallow(<ConnectedConfirmationModal />, { context: { store } });

    expect(component.dive()).toMatchSnapshot('connected');
  });

  it('should display a confirmation modal', () => {
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

    const component = mount(<ConfirmationModal {...props} />);

    expect(component.render()).toMatchSnapshot('show');

    component.find('button[className="btn btn-default"]').simulate('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should NOT display a confirmation modal', () => {
    const props = {
      show: false
    };

    const component = mount(<ConfirmationModal {...props} />);

    expect(component.render()).toMatchSnapshot('hidden');
  });
});
