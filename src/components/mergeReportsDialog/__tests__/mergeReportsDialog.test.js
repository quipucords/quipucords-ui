import React from 'react';
import { MergeReportsDialog } from '../mergeReportsDialog';

describe('MergeReportsDialog Component', () => {
  it('should render a basic component', () => {
    const props = {
      show: true,
      scans: [
        { id: 1, mostRecentStatus: 'completed', mostRecentReportId: 2, name: 'lorem' },
        { id: 2, mostRecentStatus: 'pending', mostRecentReportId: 2, name: 'ipsum' }
      ]
    };

    const component = renderComponent(<MergeReportsDialog {...props} />);
    expect(component.screen.render()).toMatchSnapshot('basic');
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

    const component = renderComponent(<MergeReportsDialog {...props} />);
    expect(component.screen.render().querySelector('.pf-c-modal-box__body')).toMatchSnapshot('pending');
  });
});
