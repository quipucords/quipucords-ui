import React from 'react';
import PropTypes from 'prop-types';
import { Button, EmptyState, Grid, Row } from 'patternfly-react';
import helpers from '../../common/helpers';

const SourcesEmptyState = ({ onAddSource, uiShortName }) => (
  <Grid fluid className="fadein">
    <Row>
      <EmptyState className="full-page-blank-slate">
        <EmptyState.Icon />
        <EmptyState.Title>Welcome to {uiShortName}</EmptyState.Title>
        <EmptyState.Info>
          Begin by adding one or more sources. A source contains a collection of network information, <br />
          including systems management solution information, IP addresses, or host names, in addition to <br />
          SSH ports and credentials.
        </EmptyState.Info>
        <EmptyState.Action>
          <Button bsStyle="primary" bsSize="large" onClick={onAddSource}>
            Add Source
          </Button>
        </EmptyState.Action>
      </EmptyState>
    </Row>
  </Grid>
);

SourcesEmptyState.propTypes = {
  onAddSource: PropTypes.func,
  uiShortName: PropTypes.string
};

SourcesEmptyState.defaultProps = {
  onAddSource: helpers.noop,
  uiShortName: helpers.UI_SHORT_NAME
};

export { SourcesEmptyState as default, SourcesEmptyState };
