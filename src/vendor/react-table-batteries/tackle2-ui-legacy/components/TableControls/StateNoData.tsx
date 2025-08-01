import React from 'react';
import { NoDataEmptyState } from './NoDataEmptyState';

// TODO support i18n / custom text here -- or just don't have this component?
export const StateNoData: React.FC = () => (
  <NoDataEmptyState title="No data available" description="No data available to be shown here" />
);
