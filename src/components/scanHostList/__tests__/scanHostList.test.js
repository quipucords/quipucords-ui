import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { ConnectedScanHostList, ScanHostList } from '../scanHostList';

describe('ScanHostList Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      scans: {
        connection: {},
        inspection: {}
      }
    });

    const props = {
      id: 1,
      filter: { lorem: 'ipsum' },
      useConnectionResults: true,
      useInspectionResults: true
    };

    const component = shallow(
      <Provider store={store}>
        <ConnectedScanHostList {...props}>{() => 'lorem ipsum'}</ConnectedScanHostList>
      </Provider>
    );

    expect(component.find(ConnectedScanHostList)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component', () => {
    const props = {
      id: 1,
      useConnectionResults: true,
      useInspectionResults: true,
      hostsList: [
        {
          credentialName: 'dolor',
          jobType: 'connection',
          name: 'lorem',
          sourceId: 15,
          sourceName: 'lorem source'
        },
        {
          credentialName: 'set',
          jobType: 'inspection',
          name: 'ipsum',
          sourceId: 16,
          sourceName: 'ipsum source'
        }
      ]
    };

    const component = mount(<ScanHostList {...props}>{({ host }) => JSON.stringify(host)}</ScanHostList>);

    expect(component.render()).toMatchSnapshot('non-connected');
  });

  it('should render a non-connected component error', () => {
    const props = {
      id: 1,
      error: true,
      errorMessage: 'Lorem Ipsum.'
    };

    const component = shallow(<ScanHostList {...props}>{({ host }) => JSON.stringify(host)}</ScanHostList>);
    expect(component).toMatchSnapshot('error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      id: 1,
      pending: true
    };

    const component = shallow(<ScanHostList {...props}>{({ host }) => JSON.stringify(host)}</ScanHostList>);
    expect(component).toMatchSnapshot('pending');
  });
});
