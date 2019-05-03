import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { ConnectedScansEmptyState, ScansEmptyState } from '../scansEmptyState';

describe('ScansEmptyState Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ scansEmptyState: { sourcesExist: false } });
    const props = {};

    const component = shallow(<ConnectedScansEmptyState {...props} />, {
      context: { store }
    });

    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      sourcesExist: true
    };

    let component = mount(<ScansEmptyState {...props} />);
    expect(component.render()).toMatchSnapshot('non-connected exist');

    props.sourcesExist = false;
    component = mount(<ScansEmptyState {...props} />);
    expect(component.render()).toMatchSnapshot('non-connected do not exist');
  });
});
