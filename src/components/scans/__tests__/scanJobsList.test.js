import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { ConnectedScanJobsList, ScanJobsList } from '../scanJobsList';

describe('ScanJobsList Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ scans: { jobs: {} } });

    const props = {
      id: 1
    };

    const component = shallow(<ConnectedScanJobsList {...props} />, {
      context: { store }
    });

    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      id: 1,
      scanJobsList: [
        {
          endTime: '2019-05-03',
          id: 14,
          reportId: 15,
          startTime: '2019-05-03',
          status: 'completed',
          systemsScanned: 10,
          systemsFailed: 10
        }
      ]
    };

    const component = shallow(<ScanJobsList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a non-connected component error', () => {
    const props = {
      id: 1,
      error: true,
      errorMessage: 'Lorem Ipsum.'
    };

    const component = shallow(<ScanJobsList {...props} />);
    expect(component).toMatchSnapshot('error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      id: 1,
      pending: true
    };

    const component = shallow(<ScanJobsList {...props} />);
    expect(component).toMatchSnapshot('pending');
  });
});
