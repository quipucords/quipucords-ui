import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { ConnectedSourceListItem, SourceListItem } from '../sourceListItem';
import { reduxTypes } from '../../../redux';
import { apiTypes } from '../../../constants/apiConstants';

describe('SourceListItem Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component with default props', () => {
    const store = generateEmptyStore({ sources: { view: {} }, viewOptions: { [reduxTypes.view.SOURCES_VIEW]: {} } });
    const props = {
      item: {
        [apiTypes.API_RESPONSE_SOURCE_ID]: 1,
        [apiTypes.API_RESPONSE_SOURCE_SOURCE_TYPE]: 'network'
      }
    };
    const component = shallow(<ConnectedSourceListItem {...props} />, { context: { store } });

    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      item: {
        [apiTypes.API_RESPONSE_SOURCE_ID]: 1,
        [apiTypes.API_RESPONSE_SOURCE_SOURCE_TYPE]: 'network'
      }
    };

    const component = mount(<SourceListItem {...props} />);

    expect(component.render()).toMatchSnapshot('non-connected');
  });
});
