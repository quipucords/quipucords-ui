import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
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
    const component = renderComponent(
      <Provider store={store}>
        <ConnectedConfirmationModal />
      </Provider>
    );

    expect(component.screen.render()).toMatchSnapshot('connected');
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

    const component = renderComponent(<ConfirmationModal {...props} />);
    expect(component.screen.render()).toMatchSnapshot('show');

    const input = component.screen.getByText('Cancel');
    component.fireEvent.click(input);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should NOT display a confirmation modal', () => {
    const props = {
      show: false
    };

    const component = renderComponent(<ConfirmationModal {...props} />);
    expect(component.screen.render()).toMatchSnapshot('hidden');
  });

  it('should allow passed children, or specific props', () => {
    const props = {
      show: true,
      heading: 'Lorem ipsum',
      children: 'hello world'
    };

    const component = renderComponent(<ConfirmationModal {...props} />);
    expect(component.screen.getByRole('heading')).toMatchSnapshot('heading');

    const componentBody = component.setProps({
      heading: null,
      body: 'Dolor sit'
    });

    expect(componentBody.screen.render().querySelector('.pf-c-modal-box__body')).toMatchSnapshot('body');

    const componentChildren = component.setProps({
      body: null
    });

    expect(componentChildren.screen.render().querySelector('.pf-c-modal-box__body')).toMatchSnapshot('children');
  });

  it('should allow custom content', () => {
    const props = {
      show: true,
      isActions: false,
      isClose: false,
      isContentOnly: true
    };

    const component = renderComponent(<ConfirmationModal {...props}>lorem ipsum</ConfirmationModal>);
    expect(component.screen.render()).toMatchSnapshot('custom');
  });
});
