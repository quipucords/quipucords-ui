import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'patternfly-react';
import { apiTypes } from '../../constants/apiConstants';

const SourceCredentialsList = ({ source }) => {
  const credentials =
    (source[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS] && [...source[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS]]) || [];

  credentials.sort((item1, item2) =>
    item1[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_NAME].localeCompare(
      item2[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_NAME]
    )
  );

  return (
    <Grid fluid>
      {credentials.map(credential => (
        <Grid.Row key={credential[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_NAME]}>
          <Grid.Col xs={12} sm={4}>
            <span>
              <Icon type="fa" name="id-card" />
              &nbsp; {credential[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_NAME]}
            </span>
          </Grid.Col>
        </Grid.Row>
      ))}
    </Grid>
  );
};

SourceCredentialsList.propTypes = {
  source: PropTypes.shape({
    credentials: PropTypes.array
  }).isRequired
};

export { SourceCredentialsList as default, SourceCredentialsList };
