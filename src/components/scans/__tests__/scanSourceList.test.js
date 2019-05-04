import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { ConnectedScanSourceList, ScanSourceList } from '../scanSourceList';

describe('ScanSourceList Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({ scans: { job: {} } });

    const props = {
      id: 1
    };

    const component = shallow(<ConnectedScanSourceList {...props} />, {
      context: { store }
    });

    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      id: 1,
      scanJobList: [
        {
          connectTaskStatus: 'lorem',
          connectTaskStatusMessage: 'ipsum',
          id: 1,
          inspectTaskStatus: 'dolor',
          inspectTaskStatusMessage: 'sit',
          name: 'test',
          sourceType: ''
        }
      ]
    };

    const component = mount(<ScanSourceList {...props} />);

    expect(component.render()).toMatchSnapshot('non-connected');
  });

  it('should render a non-connected component error', () => {
    const props = {
      id: 1,
      error: true,
      errorMessage: 'Lorem Ipsum.'
    };

    const component = shallow(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      id: 1,
      pending: true
    };

    const component = shallow(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('pending');
  });

  it('should handle multiple status messages', () => {
    const props = {
      id: 1,
      scanJobList: [
        {
          connectTaskStatus: 'pending',
          connectTaskStatusMessage: 'ipsum',
          id: 1,
          inspectTaskStatus: 'dolor',
          inspectTaskStatusMessage: 'sit',
          name: 'test',
          sourceType: ''
        }
      ]
    };

    let component = shallow(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('connect status');

    props.scanJobList[0].connectTaskStatus = 'completed';
    component = shallow(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('inspect status');

    props.scanJobList[0].inspectTaskStatus = undefined;
    component = shallow(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('fallback status');
  });
});
