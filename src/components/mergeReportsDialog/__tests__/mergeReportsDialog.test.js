import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { ConnectedMergeReportsDialog, MergeReportsDialog } from '../mergeReportsDialog';

describe('MergeReportsDialog Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      scans: {
        mergeDialog: {
          show: true,
          scans: [
            { id: 1, mostRecentStatus: 'completed', mostRecentReportId: 2, name: 'lorem' },
            { id: 2, mostRecentStatus: 'pending', mostRecentReportId: 2, name: 'ipsum' }
          ]
        }
      }
    });

    const props = {};
    const component = shallow(
      <Provider store={store}>
        <ConnectedMergeReportsDialog {...props} />
      </Provider>
    );

    expect(component.find(ConnectedMergeReportsDialog)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component, failure and success', () => {
    const props = {
      show: true,
      scans: [
        { id: 1, mostRecentStatus: 'completed', mostRecentReportId: 2, name: 'lorem' },
        { id: 2, mostRecentStatus: 'pending', mostRecentReportId: 2, name: 'ipsum' }
      ]
    };

    const component = mount(<MergeReportsDialog {...props} />);
    expect(component.render()).toMatchSnapshot('non-connected');
  });

  it('should render a component, pending', () => {
    const props = {
      pending: true,
      show: true,
      scans: [
        { id: 1, mostRecentStatus: 'completed', mostRecentReportId: 2, name: 'lorem' },
        { id: 2, mostRecentStatus: 'pending', mostRecentReportId: 2, name: 'ipsum' }
      ]
    };

    const component = mount(<MergeReportsDialog {...props} />);
    expect(component.render()).toMatchSnapshot('pending');
  });
});
