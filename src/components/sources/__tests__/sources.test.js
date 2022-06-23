import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { ConnectedSources, Sources } from '../sources';
import { apiTypes } from '../../../constants/apiConstants';

describe('Sources Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component with default props', () => {
    const store = generateEmptyStore({ sources: { view: {} }, viewOptions: {} });
    const component = shallow(
      <Provider store={store}>
        <ConnectedSources />
      </Provider>
    );

    expect(component.find(ConnectedSources)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      fulfilled: true,
      sources: [
        {
          [apiTypes.API_RESPONSE_SOURCE_ID]: '1',
          [apiTypes.API_RESPONSE_SOURCE_NAME]: 'lorem'
        }
      ],
      viewOptions: {
        selectedItems: []
      }
    };

    const component = shallow(<Sources {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a non-connected component error', () => {
    const props = {
      error: true
    };

    const component = shallow(<Sources {...props} />);

    expect(component.render()).toMatchSnapshot('error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      pending: true,
      sources: []
    };

    const component = mount(<Sources {...props} />);

    expect(component.render()).toMatchSnapshot('pending');
  });

  it('should render a non-connected component with empty state', () => {
    const props = {};

    const component = mount(<Sources {...props} />);

    expect(component.find('button').length).toEqual(1);
    expect(component.render()).toMatchSnapshot('empty state');
  });
});
