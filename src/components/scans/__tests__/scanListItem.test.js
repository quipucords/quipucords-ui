import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import { ConnectedScanListItem, ScanListItem } from '../scanListItem';
import { viewTypes } from '../../../redux/constants';

describe('ScanListItem Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ viewOptions: { [viewTypes.SCANS_VIEW]: {} } });

    const props = {
      lastRefresh: 0,
      scan: {
        jobsTotal: 1,
        id: 42,
        mostRecentEndTime: '',
        mostRecentId: 2,
        mostRecentReportId: 3,
        mostRecentStatus: 'completed',
        mostRecentStartTime: '',
        mostRecentStatusMessage: 'Lorem ipsum',
        mostRecentSysFailed: 1,
        mostRecentSysScanned: 20,
        name: 'lorem',
        sourcesTotal: 1
      }
    };

    const component = shallow(
      <Provider store={store}>
        <ConnectedScanListItem {...props} />
      </Provider>
    );

    expect(component.find(ConnectedScanListItem)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      lastRefresh: 0,
      scan: {
        jobsTotal: 1,
        id: 42,
        mostRecentEndTime: '',
        mostRecentId: 2,
        mostRecentReportId: 3,
        mostRecentStatus: 'completed',
        mostRecentStartTime: '',
        mostRecentStatusMessage: 'Lorem ipsum',
        mostRecentSysFailed: 1,
        mostRecentSysScanned: 20,
        name: 'lorem',
        sourcesTotal: 1
      }
    };

    const component = shallow(<ScanListItem {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
