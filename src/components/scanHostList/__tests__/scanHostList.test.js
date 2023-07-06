import React from 'react';
import { ScanHostList } from '../scanHostList';

describe('ScanHostList Component', () => {
  it('should render a basic component', () => {
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

    const component = renderComponent(<ScanHostList {...props}>{({ host }) => JSON.stringify(host)}</ScanHostList>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render a component error', () => {
    const props = {
      id: 1,
      error: true,
      errorMessage: 'Lorem Ipsum.'
    };

    const component = renderComponent(<ScanHostList {...props}>{({ host }) => JSON.stringify(host)}</ScanHostList>);
    expect(component).toMatchSnapshot('error');
  });

  it('should render a component pending', () => {
    const props = {
      id: 1,
      pending: true
    };

    const component = renderComponent(<ScanHostList {...props}>{({ host }) => JSON.stringify(host)}</ScanHostList>);
    expect(component).toMatchSnapshot('pending');
  });
});
