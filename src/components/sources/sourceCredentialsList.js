import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'patternfly-react';

const SourceCredentialsList = ({ source }) => {
  const credentials = (source.credentials && [...source.credentials]) || [];

  credentials.sort((item1, item2) => item1.name.localeCompare(item2.name));

  return (
    <Grid fluid>
      {credentials.map(item => (
        <Grid.Row key={item.name}>
          <Grid.Col xs={12} sm={4}>
            <span>
              <Icon type="fa" name="id-card" />
              &nbsp; {item.name}
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
