import React from 'react';
import { ScanJobsList } from '../scanJobsList';

describe('ScanJobsList Component', () => {
  it('should render a basic component', () => {
    const props = {
      id: 1,
      scanJobsList: [
        {
          _original: {
            endTime: '2019-05-03',
            id: 14,
            reportId: 15,
            startTime: '2019-05-03',
            status: 'completed',
            systemsScanned: 10,
            systemsFailed: 10
          },
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

    const component = renderComponent(<ScanJobsList {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render a component error', () => {
    const props = {
      id: 1,
      error: true,
      errorMessage: 'Lorem Ipsum.'
    };

    const component = renderComponent(<ScanJobsList {...props} />);
    expect(component).toMatchSnapshot('error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      id: 1,
      pending: true
    };

    const component = renderComponent(<ScanJobsList {...props} />);
    expect(component).toMatchSnapshot('pending');
  });
});
