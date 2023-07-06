import React from 'react';
import { ScanSourceList } from '../scanSourceList';

describe('ScanSourceList Component', () => {
  it('should render a basic component', () => {
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

    const component = renderComponent(<ScanSourceList {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render a basic component error', () => {
    const props = {
      id: 1,
      error: true,
      errorMessage: 'Lorem Ipsum.'
    };

    const component = renderComponent(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('error');
  });

  it('should render a basic component pending', () => {
    const props = {
      id: 1,
      pending: true
    };

    const component = renderComponent(<ScanSourceList {...props} />);
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

    const component = renderComponent(<ScanSourceList {...props} />);
    expect(component).toMatchSnapshot('connect status');

    props.scanJobList[0].connectTaskStatus = 'completed';
    const componentInspect = renderComponent(<ScanSourceList {...props} />);
    expect(componentInspect).toMatchSnapshot('inspect status');

    props.scanJobList[0].inspectTaskStatus = undefined;
    const componentFallback = renderComponent(<ScanSourceList {...props} />);
    expect(componentFallback).toMatchSnapshot('fallback status');
  });
});
