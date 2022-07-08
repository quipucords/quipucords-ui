import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { DropdownButton, Grid, MenuItem, Row } from 'patternfly-react';
import helpers from '../../common/helpers';
import { translate } from '../i18n/i18n';

const CredentialsEmptyState = ({ onAddCredential, onAddSource, t, uiSentenceStartName, uiShortName }) => (
  <Grid fluid>
    <Row>
      <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={AddCircleOIcon} />
        <Title headingLevel="h1">{t('view.empty-state', { context: 'title', name: uiShortName })}</Title>
        <EmptyStateBody>
          {t('view.empty-state', { context: ['description', 'credentials'], name: uiSentenceStartName })}
        </EmptyStateBody>
        <EmptyStatePrimary>
          <DropdownButton bsStyle="primary" bsSize="large" title="Add Credential" pullRight id="createCredentialButton">
            <MenuItem eventKey="1" onClick={() => onAddCredential('network')}>
              Network Credential
            </MenuItem>
            <MenuItem eventKey="2" onClick={() => onAddCredential('satellite')}>
              Satellite Credential
            </MenuItem>
            <MenuItem eventKey="2" onClick={() => onAddCredential('vcenter')}>
              VCenter Credential
            </MenuItem>
          </DropdownButton>
        </EmptyStatePrimary>
        <EmptyStateSecondaryActions>
          <Button variant={ButtonVariant.link} onClick={onAddSource}>
            {t('view.empty-state', { context: ['label', 'source'] })}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </Row>
  </Grid>
);

CredentialsEmptyState.propTypes = {
  onAddCredential: PropTypes.func,
  onAddSource: PropTypes.func,
  t: PropTypes.func,
  uiSentenceStartName: PropTypes.string,
  uiShortName: PropTypes.string
};

CredentialsEmptyState.defaultProps = {
  onAddCredential: helpers.noop,
  onAddSource: helpers.noop,
  t: translate,
  uiSentenceStartName: helpers.UI_SENTENCE_START_NAME,
  uiShortName: helpers.UI_SHORT_NAME
};

export { CredentialsEmptyState as default, CredentialsEmptyState };
