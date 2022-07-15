import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import { AddSourceWizard } from '../addSourceWizard';
import { Wizard } from '../../wizard/wizard';

describe('AddSourceWizard Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a basic component', async () => {
    const props = {
      useGetAddSource: () => ({
        show: true
      })
    };

    const component = await shallowHookComponent(<AddSourceWizard {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should display update steps', async () => {
    const props = {
      useGetAddSource: () => ({
        show: true,
        edit: true
      })
    };

    const component = await shallowHookComponent(<AddSourceWizard {...props} />);
    expect(component).toMatchSnapshot('update');
  });

  it('should not display a wizard', async () => {
    const props = {
      useGetAddSource: () => ({
        show: false
      })
    };

    const component = await mountHookComponent(<AddSourceWizard {...props} />);
    expect(component.find(Wizard).props()?.isOpen).toBe(false);
  });

  it('should allow cancelling the wizard', async () => {
    const mockStore = generateEmptyStore({
      addSourceWizard: {}
    });
    const props = {
      useGetAddSource: () => ({
        show: true
      })
    };

    const component = await mountHookComponent(
      <Provider store={mockStore}>
        <AddSourceWizard {...props} />
      </Provider>
    );

    component.find('button.pf-c-button.pf-m-link').first().simulate('click');
    expect(mockDispatch.mock.calls).toMatchSnapshot('cancel');
  });

  it('should allow closing the wizard on fulfillment', async () => {
    const mockStore = generateEmptyStore({
      addSourceWizard: {}
    });
    const props = {
      useGetAddSource: () => ({
        show: true,
        fulfilled: true
      })
    };

    const component = await mountHookComponent(
      <Provider store={mockStore}>
        <AddSourceWizard {...props} />
      </Provider>
    );

    component.find('button.pf-c-button.pf-m-link').first().simulate('click');
    expect(mockDispatch.mock.calls).toMatchSnapshot('fulfill');
  });
});
