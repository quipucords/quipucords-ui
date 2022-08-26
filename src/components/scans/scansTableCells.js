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
  OverflowMenuItem
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { ContextIconAction, ContextIconActionVariant } from '../contextIcon/contextIconAction';
import { Tooltip } from '../tooltip/tooltip';
import { ConnectedScanHostList as ScanHostList } from '../scanHostList/scanHostList';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';
import { DropdownSelect, SelectButtonVariant, SelectDirection, SelectPosition } from '../dropdownSelect/dropdownSelect';
import ScanSourceList from './scanSourceList';
import ScanJobsList from './scanJobsList';

/**
 * Source description and type icon
 *
 * @param {object} params
 * @returns {React.ReactNode}
 */
const description = ({ [apiTypes.API_RESPONSE_SCAN_ID]: id, [apiTypes.API_RESPONSE_SCAN_NAME]: name } = {}) => (
  <Grid hasGutter={false}>
    <GridItem sm={2} />
    <GridItem sm={10}>
      <div>
        <strong>{name || id}</strong>
      </div>
    </GridItem>
  </Grid>
);

/**
 * Scan status, icon and description
 *
 * @param {object} params
 * @param {object} options
 * @param {Function} options.t
 * @param {string} options.viewId
 * @returns {React.ReactNode|null}
 */
const scanStatus = (
  { [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent = {} } = {},
  { t = translate, viewId } = {}
) => {
  const {
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS]: status,
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_END_TIME]: endTime,
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_START_TIME]: startTime
  } = mostRecent;
  const isPending = status === 'created' || status === 'pending' || status === 'running';
  const scanTime = (isPending && startTime) || endTime;

  return (
    <Grid hasGutter={false}>
      <GridItem sm={2}>
        <ContextIcon symbol={ContextIconVariant[status]} />
      </GridItem>
      <GridItem sm={10}>
        <div>{t('table.label', { context: ['status', status, viewId] })}</div>
        {helpers.getTimeDisplayHowLongAgo(scanTime)}
      </GridItem>
    </Grid>
  );
};

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
 * Generate a consistent display row for expandable content.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.status
 * @param {object} options
 * @param {boolean} options.useConnectionResults
 * @param {boolean} options.useInspectionResults
 * @returns {React.ReactNode}
 */
const statusContent = ({ id, status } = {}, { useConnectionResults = false, useInspectionResults = false } = {}) => (
  <ScanHostList
    key={`status-content-${id}-${status}`}
    id={id}
    filter={{ [apiTypes.API_QUERY_STATUS]: status }}
    useConnectionResults={useConnectionResults}
    useInspectionResults={useInspectionResults}
  >
    {({ host }) => (
      <Grid key={`hostsRow-${host?.credentialName}`}>
        <GridItem xs={6} sm={4} md={3}>
          <ContextIcon symbol={ContextIconVariant[host?.status]} /> {host?.name}
        </GridItem>
        <GridItem xs={6} sm={8} md={9}>
          {host?.sourceName}
        </GridItem>
      </Grid>
    )}
  </ScanHostList>
);
/**
 * Failed hosts cell and expandable content.
 *
 * @param {object} params
 * @param {object} options
 * @param {string} options.viewId
 * @returns {{cell: React.ReactNode, content: React.ReactNode}}
 */
const failedHostsCellContent = (
  { [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent = {} } = {},
  { viewId } = {}
) => {
  const {
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_SYS_FAILED]: systemsScanned,
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID]: mostRecentId
  } = mostRecent;
  const count = Number.parseInt(systemsScanned, 10);

  return {
    content: statusCell({ count, status: ContextIconVariant.failed, viewId }),
    expandedContent:
      (count &&
        statusContent({ id: mostRecentId, status: ContextIconVariant.failed }, { useInspectionResults: true })) ||
      undefined
  };
};

/**
 * Ok hosts cell and expandable content.
 *
 * @param {object} params
 * @param {object} options
 * @param {string} options.viewId
 * @returns {{cell: React.ReactNode, content: React.ReactNode}}
 */
const okHostsCellContent = ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent = {} } = {}, { viewId } = {}) => {
  const {
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_SYS_SCANNED]: systemsScanned,
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID]: mostRecentId
  } = mostRecent;
  const count = Number.parseInt(systemsScanned, 10);

  return {
    content: statusCell({ count, status: ContextIconVariant.success, viewId }),
    expandedContent:
      (count &&
        statusContent({ id: mostRecentId, status: ContextIconVariant.success }, { useInspectionResults: true })) ||
      undefined
  };
};

const sourcesCellContent = (
  { [apiTypes.API_RESPONSE_SCAN_ID]: id, [apiTypes.API_RESPONSE_SCAN_SOURCES]: sources = [] } = {},
  { viewId } = {}
) => {
  const count = sources?.length;

  return {
    content: statusCell({ count, status: 'sources', viewId }),
    expandedContent: (count && <ScanSourceList key={`sources-${id}`} id={id} />) || undefined
  };
};

const scansCellContent = (
  {
    [apiTypes.API_RESPONSE_SCAN_ID]: id,
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent = {},
    [apiTypes.API_RESPONSE_SCAN_JOBS]: scanJobs = []
  } = {},
  { viewId } = {}
) => {
  const { [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID]: mostRecentId } = mostRecent;
  const count = scanJobs?.length;

  return {
    content: statusCell({ count, status: 'scans', viewId }),
    expandedContent: (count && <ScanJobsList key={`jobs-${id}`} id={id} mostRecentId={mostRecentId} />) || undefined
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
 * @param {Function} params.onCancel
 * @param {Function} params.onDownload
 * @param {Function} params.onRestart
 * @param {Function} params.onPause
 * @param {Function} params.onStart
 * @param {Function} params.t
 * @returns {React.ReactNode}
 */
const actionsCell = ({
  isFirst = false,
  isLast = false,
  item = {},
  onCancel = helpers.noop,
  onDownload = helpers.noop,
  onRestart = helpers.noop,
  onPause = helpers.noop,
  onStart = helpers.noop,
  t = translate
} = {}) => {
  const { [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: scan = {} } = item;
  const {
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_REPORT_ID]: mostRecentReportId,
    [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS]: mostRecentStatus
  } = scan;

  /**
   * Determine the correct context action to use for both dropdown,
   * and callbacks.
   *
   * @param {object} event
   * @param {string} event.value
   * @returns {void}
   */
  const onSelect = ({ value }) => {
    switch (value) {
      case 'download':
        return onDownload(item);
      case 'created':
      case 'running':
        return onPause(item);
      case 'paused':
        return onRestart(item);
      case 'pending':
        return onCancel(item);
      case 'completed':
      case 'failed':
      case 'canceled':
      case 'cancelled':
      default:
        return onStart(item);
    }
  };

  /**
   * Generate a consistent menu item.
   *
   * @param {string} context
   * @returns {React.ReactNode}
   */
  const menuItem = context => ({
    dropdownMenuItem: { title: t('table.label', { context: ['action', 'scan', context] }), value: context },
    overflowMenuItem: (
      <OverflowMenuItem key={`menuItem-${context}`}>
        <Tooltip content={t('table.label', { context: ['action', 'scan', context] })}>
          <Button
            className="quipucords-view__row-button"
            onClick={() => onSelect({ value: context })}
            aria-label={t('table.label', { context: ['action', 'scan', context] })}
            variant={ButtonVariant.plain}
          >
            <ContextIconAction symbol={ContextIconActionVariant[context]} />
          </Button>
        </Tooltip>
      </OverflowMenuItem>
    )
  });

  const menuItems = [];

  if (mostRecentStatus) {
    if (mostRecentStatus === ('created' || 'running')) {
      menuItems.push(menuItem(mostRecentStatus), menuItem(ContextIconActionVariant.pending));
    } else {
      menuItems.push(menuItem(mostRecentStatus));
    }
  }

  if (mostRecentReportId) {
    menuItems.push({
      dropdownMenuItem: { title: t('table.label', { context: ['action', 'scan', 'download'] }), value: 'download' },
      overflowMenuItem: (
        <OverflowMenuItem key="button-download">
          <Button onClick={() => onSelect({ value: 'download' })} variant={ButtonVariant.secondary}>
            {t('table.label', { context: ['action', 'scan', 'download'] })}
          </Button>
        </OverflowMenuItem>
      )
    });
  }

  return (
    <OverflowMenu breakpoint="lg">
      <OverflowMenuContent>
        <OverflowMenuGroup groupType="button">
          {menuItems.map(({ overflowMenuItem }) => overflowMenuItem)}
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
          options={menuItems.map(({ dropdownMenuItem }) => dropdownMenuItem)}
        />
      </OverflowMenuControl>
    </OverflowMenu>
  );
};

const scansTableCells = {
  actionsCell,
  description,
  failedHostsCellContent,
  okHostsCellContent,
  scanStatus,
  scansCellContent,
  sourcesCellContent,
  statusCell,
  statusContent
};

export {
  scansTableCells as default,
  scansTableCells,
  actionsCell,
  description,
  failedHostsCellContent,
  okHostsCellContent,
  scanStatus,
  scansCellContent,
  sourcesCellContent,
  statusCell,
  statusContent
};