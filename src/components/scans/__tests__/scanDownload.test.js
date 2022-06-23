import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { ConnectedScanDownload, ScanDownload } from '../scanDownload';

describe('ScanDownload Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({});

    const props = {
      downloadId: 1
    };

    const component = shallow(
      <Provider store={store}>
        <ConnectedScanDownload {...props} />
      </Provider>
    );

    expect(component.render()).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      downloadId: 1
    };

    const component = mount(<ScanDownload {...props} />);

    expect(component.render()).toMatchSnapshot('non-connected');
  });

  it('should handle custom children', () => {
    const props = {
      downloadId: 1
    };

    const component = mount(<ScanDownload {...props}>lorem ipsum</ScanDownload>);

    expect(component.render()).toMatchSnapshot('custom');
  });

  it('should have an optional tooltip', () => {
    const props = {
      downloadId: 1,
      tooltip: 'Lorem ipsum dolor sit'
    };

    const component = mount(<ScanDownload {...props} />);

    expect(component).toMatchSnapshot('tooltip');
  });
});
