import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { ConnectedAddSourceWizardStepThree, AddSourceWizardStepThree } from '../addSourceWizardStepThree';

describe('AccountWizardStepResults Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a basic component with error', () => {
    const store = generateEmptyStore({
      addSourceWizard: {
        error: true,
        errorMessage: 'Lorem ipsum'
      }
    });
    const component = renderComponent(
      <Provider store={store}>
        (<ConnectedAddSourceWizardStepThree />
      </Provider>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render a wizard results step with error', async () => {
    const props = {
      add: false,
      error: true,
      errorMessage: 'lorem ipsum'
    };

    const component = await shallowComponent(<AddSourceWizardStepThree {...props} />);
    expect(component).toMatchSnapshot('error updated');

    const componentErrCreated = await component.setProps({ add: true });
    expect(componentErrCreated).toMatchSnapshot('error created');
  });

  it('should render a wizard results step with pending', async () => {
    const props = {
      add: false,
      pending: true,
      name: 'Dolor'
    };

    const component = await shallowComponent(<AddSourceWizardStepThree {...props} />);
    expect(component).toMatchSnapshot('pending updated');

    const componentPendingCreated = await component.setProps({ add: true });
    expect(componentPendingCreated).toMatchSnapshot('pending created');
  });

  it('should render a wizard results step with fulfilled', async () => {
    const props = {
      add: false,
      fulfilled: true,
      name: 'Dolor'
    };

    const component = await shallowComponent(<AddSourceWizardStepThree {...props} />);
    expect(component).toMatchSnapshot('fulfilled updated');

    const componentFulfilledCreated = await component.setProps({ add: true });
    expect(componentFulfilledCreated).toMatchSnapshot('fulfilled created');
  });
});
