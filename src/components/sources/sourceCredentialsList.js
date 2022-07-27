import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import { List, ListItem } from '@patternfly/react-core';
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
    <List isPlain>
      {credentials?.map(credential => (
        <ListItem
          key={credential[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_NAME]}
          icon={<Icon type="fa" name="id-card" />}
        >
          {credential[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_NAME]}
        </ListItem>
      ))}
    </List>
  );
};

SourceCredentialsList.propTypes = {
  source: PropTypes.shape({
    credentials: PropTypes.array
  }).isRequired
};

export { SourceCredentialsList as default, SourceCredentialsList };
