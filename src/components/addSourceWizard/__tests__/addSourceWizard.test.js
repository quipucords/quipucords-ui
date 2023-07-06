import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import { AddSourceWizard } from '../addSourceWizard';

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

    const component = await shallowComponent(<AddSourceWizard {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow navigating to the next step on wizard fulfillment', () => {
    const mockStore = generateEmptyStore({
      addSourceWizard: {}
    });
    const props = {
      useGetAddSource: () => ({
        show: true,
        fulfilled: true
      })
    };

    const component = renderComponent(
      <Provider store={mockStore}>
        <AddSourceWizard {...props} />
      </Provider>
    );

    const input = component.screen.getByText('Next');
    component.fireEvent.click(input);
    expect(mockDispatch.mock.calls).toMatchSnapshot('next');
  });

  it('should allow closing the wizard on fulfillment', () => {
    const mockStore = generateEmptyStore({
      addSourceWizard: {}
    });
    const props = {
      useGetAddSource: () => ({
        show: true,
        fulfilled: true
      })
    };

    const component = renderComponent(
      <Provider store={mockStore}>
        <AddSourceWizard {...props} />
      </Provider>
    );

    const input = component.screen.getByLabelText('Close');
    component.fireEvent.click(input);
    expect(mockDispatch.mock.calls).toMatchSnapshot('close');
  });
});
