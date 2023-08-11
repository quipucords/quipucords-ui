import React from 'react';
import {
  Button,
  ButtonVariant,
  Grid,
  GridItem,
  OverflowMenu,
  OverflowMenuControl,
  OverflowMenuContent,
  OverflowMenuGroup,
  OverflowMenuItem,
  List,
  ListItem
} from '@patternfly/react-core';
import { EllipsisVIcon, EyeIcon, TrashIcon } from '@patternfly/react-icons';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { Tooltip } from '../tooltip/tooltip';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';
import { DropdownSelect, SelectButtonVariant, SelectDirection, SelectPosition } from '../dropdownSelect/dropdownSelect';

/**
 * Source description and type icon.
 *
 * @param {object} params
 * @alias {string} params.id
 * @alias {string} params.name
 * @alias {string} params.credType
 * @param {object} options
 * @param {Function} options.t
 * @param {string} options.viewId
 * @returns {React.ReactNode}
 */
const description = (
  {
    [apiTypes.API_RESPONSE_CREDENTIAL_ID]: id,
    [apiTypes.API_RESPONSE_CREDENTIAL_NAME]: name,
    [apiTypes.API_RESPONSE_CREDENTIAL_CRED_TYPE]: credType
  } = {},
  { t = translate, viewId } = {}
) => (
  <Grid hasGutter={false}>
    <GridItem sm={2}>
      <Tooltip content={t('table.label', { context: [credType, viewId] })}>
        <ContextIcon symbol={ContextIconVariant[credType]} />
      </Tooltip>
    </GridItem>
    <GridItem sm={10}>
      <div>
        <strong data-test="item_name">{name || id}</strong>
      </div>
    </GridItem>
  </Grid>
);

/**
 * Scan status, icon and description.
 *
 * @param {object} params
 * @alias {string} params.sshKeyfile
 * @param {object} options
 * @param {Function} options.t
 * @param {string} options.viewId
 * @returns {React.ReactNode|null}
 */
const authType = (
  {
    [apiTypes.API_RESPONSE_CREDENTIAL_AUTH_TOKEN]: authToken,
    [apiTypes.API_RESPONSE_CREDENTIAL_SSH_KEYFILE]: sshKeyfile
  } = {},
  { t = translate, viewId } = {}
) => (
  <Tooltip content={t('table.label', { context: ['auth', 'tooltip', viewId] })}>
    {t('table.label', {
      context: ['auth', 'cell', sshKeyfile && 'sshKey', authToken && 'authToken']
    })}
  </Tooltip>
);

/**
 * Generate a consistent status cell.
 *
 * @param {object} params
 * @param {number} params.count
 * @param {string} params.status
 * @param {Function} params.t
 * @param {string} params.viewId
 * @returns {React.ReactNode}
 */
const statusCell = ({ count, status = ContextIconVariant.unknown, t = translate, viewId } = {}) => {
  let updatedCount = count || 0;

  if (helpers.DEV_MODE) {
    updatedCount = helpers.devModeNormalizeCount(updatedCount);
  }

  return (
    <Tooltip content={t('table.label', { context: ['status', 'tooltip', status, viewId], count: updatedCount })}>
      {t('table.label', { context: ['status', 'cell', viewId], count: updatedCount }, [
        <ContextIcon symbol={status} />,
        <strong />
      ])}
    </Tooltip>
  );
};

/**
 * Generate sources expandable content.
 *
 * @param {object} source
 * @returns {React.ReactNode}
 */
const sourcesContent = ({
  [apiTypes.API_RESPONSE_CREDENTIAL_SOURCES]: sources,
  [apiTypes.API_RESPONSE_CREDENTIAL_CRED_TYPE]: credType
} = {}) => {
  const updatedSources = (sources && [...sources]) || [];

  updatedSources.sort((item1, item2) =>
    item1[apiTypes.API_RESPONSE_CREDENTIAL_SOURCES_NAME].localeCompare(
      item2[apiTypes.API_RESPONSE_CREDENTIAL_SOURCES_NAME]
    )
  );

  return (
    <List isPlain>
      {updatedSources?.map(
        ({
          [apiTypes.API_RESPONSE_CREDENTIAL_SOURCES_NAME]: sourceName,
          [apiTypes.API_RESPONSE_CREDENTIAL_SOURCES_SOURCE_TYPE]: sourceType
        }) => (
          <ListItem key={sourceName}>
            <ContextIcon symbol={ContextIconVariant[sourceType || credType]} /> {sourceName}
          </ListItem>
        )
      )}
    </List>
  );
};

/**
 * Sources cell status, and expandable content.
 *
 * @param {object} item
 * @param {Array} item.sources
 * @param {object} options
 * @param {string} options.viewId
 * @returns {{expandedContent: (React.ReactNode|undefined), content: React.ReactNode}}
 */
const sourcesCellContent = (item = {}, { viewId } = {}) => {
  const { [apiTypes.API_RESPONSE_CREDENTIAL_SOURCES]: sources } = item;
  const count = sources?.length;

  return {
    content: statusCell({ count, status: 'sources', viewId }),
    expandedContent: (count && sourcesContent(item)) || undefined
  };
};

// FixMe: PF Overflow menu is attempting state updates on unmounted components
/**
 * Action cell content
 *
 * @param {object} params
 * @param {boolean} params.isFirst
 * @param {boolean} params.isLast
 * @param {object} params.item
 * @param {Function} params.onDelete
 * @param {Function} params.onEdit
 * @param {Function} params.t
 * @returns {React.ReactNode}
 */
const actionsCell = ({
  isFirst = false,
  isLast = false,
  item = {},
  onDelete = helpers.noop,
  onEdit = helpers.noop,
  t = translate
} = {}) => {
  const onSelect = ({ value }) => {
    switch (value) {
      case 'delete':
        return onDelete(item);
      case 'edit':
      default:
        return onEdit(item);
    }
  };

  return (
    <OverflowMenu breakpoint="lg">
      <OverflowMenuContent>
        <OverflowMenuGroup groupType="button">
          <OverflowMenuItem key="tooltip-edit">
            <Tooltip content={t('table.label', { context: 'view' })}>
              <Button
                className="quipucords-view__row-button"
                onClick={() => onEdit(item)}
                aria-label={t('table.label', { context: 'view' })}
                variant={ButtonVariant.plain}
              >
                <EyeIcon />
              </Button>
            </Tooltip>
          </OverflowMenuItem>
          <OverflowMenuItem key="tooltip-delete">
            <Tooltip content={t('table.label', { context: 'delete' })}>
              <Button
                className="quipucords-view__row-button"
                onClick={() => onDelete(item)}
                aria-label={t('table.label', { context: 'delete' })}
                variant={ButtonVariant.plain}
              >
                <TrashIcon />
              </Button>
            </Tooltip>
          </OverflowMenuItem>
        </OverflowMenuGroup>
      </OverflowMenuContent>
      <OverflowMenuControl>
        <DropdownSelect
          onSelect={onSelect}
          isDropdownButton
          buttonVariant={SelectButtonVariant.plain}
          direction={(isLast && !isFirst && SelectDirection.up) || undefined}
          position={SelectPosition.right}
          placeholder={<EllipsisVIcon />}
          options={[
            { title: t('table.label', { context: 'edit' }), value: 'edit' },
            { title: t('table.label', { context: 'delete' }), value: 'delete' }
          ]}
        />
      </OverflowMenuControl>
    </OverflowMenu>
  );
};

const credentialsTableCells = {
  actionsCell,
  authType,
  description,
  sourcesCellContent,
  sourcesContent,
  statusCell
};

export {
  credentialsTableCells as default,
  credentialsTableCells,
  actionsCell,
  authType,
  description,
  sourcesCellContent,
  sourcesContent,
  statusCell
};
