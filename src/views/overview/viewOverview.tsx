/**
 * OverviewView Component
 *
 * This component provides a view for managing scans, including adding, running and deleting scans,
 * and also managing reports.
 *
 * @module overview
 */
import * as React from 'react';
import PageHeader from '@patternfly/react-component-groups/dist/dynamic/PageHeader';
import { PageSection } from '@patternfly/react-core';

const OverviewView: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false}>
      <PageHeader title="Overview" />
    </PageSection>
  );
};

export default OverviewView;
