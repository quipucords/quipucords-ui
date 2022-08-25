import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  DisconnectedIcon,
  ErrorCircleOIcon,
  ExclamationTriangleIcon,
  IdCardIcon,
  PencilAltIcon,
  PficonNetworkRangeIcon,
  PficonSatelliteIcon,
  PficonVcenterIcon,
  TrashIcon,
  UnknownIcon,
  IconSize
} from '@patternfly/react-icons';
import {
  global_Color_dark_100 as gray,
  global_success_color_100 as green,
  global_warning_color_100 as yellow,
  global_danger_color_100 as red
} from '@patternfly/react-tokens';

/**
 * Context icon variants
 *
 * @type {{running: string, canceled: string, paused: string, unreachable: string, success: string, created: string,
 *     pending: string, cancelled: string, completed: string, failed: string}}
 */
const ContextIconVariant = {
  completed: 'success',
  success: 'success',
  failed: 'failed',
  canceled: 'failed',
  cancelled: 'failed',
  created: 'pending',
  pending: 'pending',
  running: 'pending',
  idCard: 'idCard',
  network: 'network',
  paused: 'paused',
  pencil: 'pencil',
  satellite: 'satellite',
  trash: 'trash',
  unknown: 'unknown',
  unreachable: 'unreachable',
  vcenter: 'vcenter'
};

/**
 * Return an icon from context/symbol
 *
 * @param {object} props
 * @param {string} props.symbol
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const ContextIcon = ({ symbol, ...props }) => {
  switch (symbol) {
    case ContextIconVariant.failed:
      return <ErrorCircleOIcon {...{ ...{ color: red.value }, ...props }} />;
    case ContextIconVariant.idCard:
      return <IdCardIcon {...{ ...{ color: gray.value }, ...props }} />;
    case ContextIconVariant.network:
      return <PficonNetworkRangeIcon {...props} />;
    case ContextIconVariant.paused:
      return <ExclamationTriangleIcon {...{ ...{ color: yellow.value }, ...props }} />;
    case ContextIconVariant.pencil:
      return <PencilAltIcon {...props} />;
    case ContextIconVariant.pending:
      return <Spinner isSVG {...{ ...{ size: IconSize.md }, ...props }} />;
    case ContextIconVariant.satellite:
      return <PficonSatelliteIcon {...props} />;
    case ContextIconVariant.success:
      return <CheckCircleIcon {...{ ...{ color: green.value }, ...props }} />;
    case ContextIconVariant.trash:
      return <TrashIcon {...props} />;
    case ContextIconVariant.unreachable:
      return <DisconnectedIcon {...{ ...{ color: red.value }, ...props }} />;
    case ContextIconVariant.vcenter:
      return <PficonVcenterIcon {...props} />;
    case ContextIconVariant.unknown:
    default:
      return <UnknownIcon {...props} />;
  }
};

/**
 * Prop types
 *
 * @type {{symbol: string}}
 */
ContextIcon.propTypes = {
  symbol: PropTypes.oneOf([...Object.values(ContextIconVariant)])
};

/**
 * Default props
 *
 * @type {{symbol: null}}
 */
ContextIcon.defaultProps = {
  symbol: null
};

export { ContextIcon as default, ContextIcon, ContextIconVariant };
