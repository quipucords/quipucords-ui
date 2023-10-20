import React from 'react';
import PropTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateHeader
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { translate } from '../i18n/i18n';

const TableEmpty = ({ t }) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.sm}>
      <EmptyStateHeader
        titleText={<React.Fragment>{t('table.empty-state_title', 'No results found')}</React.Fragment>}
        icon={<EmptyStateIcon icon={SearchIcon} />}
        headingLevel="h2"
      />
      <EmptyStateBody>{t('table.empty-state_description', 'Clear all filters and try again.')}</EmptyStateBody>
    </EmptyState>
  </Bullseye>
);

TableEmpty.propTypes = {
  t: PropTypes.func
};

TableEmpty.defaultProps = {
  t: translate
};

export { TableEmpty as default, TableEmpty };
