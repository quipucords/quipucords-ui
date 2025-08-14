import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';

export interface NoDataEmptyStateProps {
  title: string;
  description?: string;
}

export const NoDataEmptyState: React.FC<NoDataEmptyStateProps> = ({ title, description }) => (
  <EmptyState titleText={<Title headingLevel="h2" size="lg">
      {title}
    </Title>} icon={CubesIcon} variant={EmptyStateVariant.sm}>
    {description && <EmptyStateBody>{description}</EmptyStateBody>}
  </EmptyState>
);
