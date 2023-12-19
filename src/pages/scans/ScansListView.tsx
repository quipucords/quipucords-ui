import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const SOURCES_LIST_QUERY = 'scansList';

const ScansListView: React.FunctionComponent = () => {
  useQuery({
    queryKey: [SOURCES_LIST_QUERY],
    queryFn: () => axios.get(`${process.env.REACT_APP_SCANS_SERVICE}`).then(res => res.data)
  });

  return (
    <PageSection>
      <Title headingLevel="h1" size="lg">
        Scans table goes here
      </Title>
    </PageSection>
  );
};

export default ScansListView;
