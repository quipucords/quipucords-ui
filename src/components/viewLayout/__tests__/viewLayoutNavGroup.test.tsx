import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
jest.mock('../../../routes', () => {
  const actual = jest.requireActual('../../../routes');
  return {
    ...actual,
    routes: [
      {
        id: 'credentials',
        component: <div></div>,
        label: 'Credentials',
        path: '/credentials',
        title: 'Credentials'
      },
      {
        id: 'scans',
        label: 'Scans',
        routes: [
          {
            id: 'scans-results',
            component: <div></div>,
            label: 'Results',
            path: '/scans-results',
            title: 'Scans results'
          },
          {
            id: 'scans-running',
            component: <div></div>,
            label: 'Running',
            path: '/scans-running',
            title: 'Scans running'
          }
        ]
      }
    ]
  };
});
import { AppLayout as ViewLayout } from '../viewLayout';

describe('ViewLayout', () => {
  it('should render a basic component with NavGroup', async () => {
    const props = {
      children: 'Lorem ipsum'
    };
    const component = await shallowComponent(<ViewLayout {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
