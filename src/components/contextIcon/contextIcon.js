import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  DisconnectedIcon,
  DownloadIcon,
  ErrorCircleOIcon,
  ExclamationTriangleIcon,
  IdCardIcon,
  PencilAltIcon,
  PficonNetworkRangeIcon,
  PficonSatelliteIcon,
  PficonVcenterIcon,
  TrashIcon,
  UnknownIcon,
  IconSize,
  ClipboardCheckIcon,
  CrosshairsIcon
} from '@patternfly/react-icons';
import {
  global_Color_dark_100 as gray,
  global_success_color_100 as green,
  global_warning_color_100 as yellow,
  global_danger_color_100 as red
} from '@patternfly/react-tokens';

/**
 * Context icon colors, for consistency
 *
 * @type {{ red: object, gray: object, green: object, yellow: object }}
 */
const ContextIconColors = {
  gray,
  green,
  yellow,
  red
};

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
  paused: 'paused',
  download: 'download',
  idCard: 'idCard',
  network: 'network',
  pencil: 'pencil',
  satellite: 'satellite',
  scans: 'scans',
  sources: 'sources',
  trash: 'trash',
  unknown: 'unknown',
  unreachable: 'unreachable',
  vcenter: 'vcenter'
};

/**
 * Emulate pf icon sizing for custom SVGs
 *
 * @param {string} size
 * @returns {string} em measurement
 */
const svgSize = size => {
  if (!Number.isNaN(Number.parseFloat(size))) {
    return size;
  }

  switch (size) {
    case 'md':
      return '1.5em';
    case 'lg':
      return '2em';
    case 'xl':
      return '3em';
    case 'sm':
    default:
      return '1em';
  }
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
    case ContextIconVariant.download:
      return <DownloadIcon {...props} />;
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
      const updatedSize = { style: { display: 'inline-block' } };

      if (props.size) {
        updatedSize.size = undefined;
        updatedSize.style.height = svgSize(props.size);
        updatedSize.style.width = svgSize(props.size);
      }

      return <Spinner isSVG {...{ ...props, ...updatedSize }} />;
    case ContextIconVariant.satellite:
      return <PficonSatelliteIcon {...props} />;
    case ContextIconVariant.scans:
      return <ClipboardCheckIcon {...props} />;
    case ContextIconVariant.sources:
      return <CrosshairsIcon {...props} />;
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
  symbol: PropTypes.oneOf([...Object.values(ContextIconVariant)]),
  size: PropTypes.oneOf([...Object.values(IconSize)])
};

/**
 * Default props
 *
 * @type {{symbol: null}}
 */
ContextIcon.defaultProps = {
  symbol: null,
  size: IconSize.sm
};

export { ContextIcon as default, ContextIcon, ContextIconColors, ContextIconVariant };
