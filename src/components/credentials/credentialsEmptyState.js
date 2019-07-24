import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropdownButton, EmptyState, Grid, MenuItem, Row } from 'patternfly-react';
import helpers from '../../common/helpers';

const CredentialsEmptyState = ({ onAddCredential, onAddSource, uiSentenceStartName, uiShortName }) => (
  <Grid fluid>
    <Row>
      <EmptyState className="full-page-blank-slate">
        <EmptyState.Icon />
        <EmptyState.Title>Welcome to {uiShortName}</EmptyState.Title>
        <EmptyState.Info>
          Credentials contain authentication information needed to scan a source. A credential includes <br />a username
          and a password or SSH key. {uiSentenceStartName} uses SSH to connect to servers <br /> on the network and uses
          credentials to access those servers.
        </EmptyState.Info>
        <EmptyState.Action>
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
        </EmptyState.Action>
        <EmptyState.Action secondary>
          <Button bsStyle="default" onClick={onAddSource}>
            Add Source
          </Button>
        </EmptyState.Action>
      </EmptyState>
    </Row>
  </Grid>
);

CredentialsEmptyState.propTypes = {
  onAddCredential: PropTypes.func,
  onAddSource: PropTypes.func,
  uiSentenceStartName: PropTypes.string,
  uiShortName: PropTypes.string
};

CredentialsEmptyState.defaultProps = {
  onAddCredential: helpers.noop,
  onAddSource: helpers.noop,
  uiSentenceStartName: helpers.UI_SENTENCE_START_NAME,
  uiShortName: helpers.UI_SHORT_NAME
};

export { CredentialsEmptyState as default, CredentialsEmptyState };
