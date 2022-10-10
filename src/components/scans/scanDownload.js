import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { useOnScanAction } from './scansContext';
import { Tooltip } from '../tooltip/tooltip';
import { translate } from '../i18n/i18n';

/**
 * Scan job download button
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {object} props.job
 * @param {Function} props.t
 * @param {*} props.tooltip
 * @param {Function} props.useOnScanAction
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const ScanDownload = ({ children, job, t, tooltip, useOnScanAction: useAliasOnScanAction, ...props }) => {
  const { onDownloadJob } = useAliasOnScanAction();

  const button = (
    <Button
      title={t('table.label', { context: ['action', 'scan', 'download'] })}
      onClick={() => onDownloadJob(job)}
      {...props}
    >
      {children || t('table.label', { context: ['action', 'scan', 'download'] })}
    </Button>
  );

  return (tooltip && <Tooltip content={tooltip}>{button}</Tooltip>) || button;
};

/**
 * Prop types
 *
 * @type {{t: Function, children: React.ReactNode, useOnScanAction: Function, tooltip: string, job: object}}
 */
ScanDownload.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.string,
  job: PropTypes.object.isRequired,
  t: PropTypes.func,
  useOnScanAction: PropTypes.func
};

/**
 * Default props
 *
 * @type {{t: translate, children: React.ReactNode, useOnScanAction: Function, tooltip: string}}
 */
ScanDownload.defaultProps = {
  children: null,
  tooltip: null,
  t: translate,
  useOnScanAction
};

export { ScanDownload as default, ScanDownload };
