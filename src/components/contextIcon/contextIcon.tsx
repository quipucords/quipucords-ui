/**
 * Provides a React component for rendering context-specific icons based on status or type, using PatternFly icons
 * and styling tokens for color consistency. Supports various icon sizes and custom props for additional configuration.
 *
 * @module contextIcon
 */
import * as React from 'react';
import { Spinner } from '@patternfly/react-core';
import {
  AnsibleTowerIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  CloudSecurityIcon,
  CrosshairsIcon,
  DisconnectedIcon,
  DownloadIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  IdCardIcon,
  InfoCircleIcon,
  OffIcon,
  OpenshiftIcon,
  PencilAltIcon,
  PficonNetworkRangeIcon,
  PficonSatelliteIcon,
  PficonVcenterIcon,
  TrashIcon,
  UnknownIcon,
  UserIcon
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
type colorToken = {
  name: string;
  value: string;
  var: string;
};

const ContextIconColors: {
  gray: colorToken;
  green: colorToken;
  yellow: colorToken;
  red: colorToken;
} = {
  gray,
  green,
  yellow,
  red
};

const ContextIconVariant: { [key: string]: string } = {
  completed: 'success',
  success: 'success',
  error: 'failed',
  failed: 'failed',
  canceled: 'failed',
  cancelled: 'failed',
  created: 'pending',
  pending: 'pending',
  running: 'pending',
  paused: 'warning',
  warning: 'warning',
  download: 'download',
  idCard: 'idCard',
  info: 'info',
  network: 'network',
  off: 'off',
  openshift: 'openshift',
  pencil: 'pencil',
  satellite: 'satellite',
  scans: 'scans',
  sources: 'sources',
  trash: 'trash',
  unknown: 'unknown',
  unreachable: 'unreachable',
  user: 'user',
  vcenter: 'vcenter',
  ansible: 'ansible',
  acs: 'acs'
};

const ContextIcon: React.FC<{
  symbol: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ symbol, size, ...props }) => {
  switch (symbol) {
    case ContextIconVariant.ansible:
      return <AnsibleTowerIcon {...props} />;
    case ContextIconVariant.download:
      return <DownloadIcon {...props} />;
    case ContextIconVariant.failed:
      return <ExclamationCircleIcon {...{ ...{ color: red.value }, ...props }} />;
    case ContextIconVariant.idCard:
      return <IdCardIcon {...{ ...{ color: gray.value }, ...props }} />;
    case ContextIconVariant.info:
      return <InfoCircleIcon {...props} />;
    case ContextIconVariant.network:
      return <PficonNetworkRangeIcon {...props} />;
    case ContextIconVariant.off:
      return <OffIcon {...props} />;
    case ContextIconVariant.openshift:
      return <OpenshiftIcon {...props} />;
    case ContextIconVariant.acs:
      return <CloudSecurityIcon {...props} />;
    case ContextIconVariant.warning:
      return <ExclamationTriangleIcon {...{ ...{ color: yellow.value }, ...props }} />;
    case ContextIconVariant.pencil:
      return <PencilAltIcon {...props} />;
    case ContextIconVariant.pending:
      return <Spinner size={size || 'sm'} {...props} />;
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
    case ContextIconVariant.user:
      return <UserIcon {...props} />;
    case ContextIconVariant.vcenter:
      return <PficonVcenterIcon {...props} />;
    case ContextIconVariant.unknown:
    default:
      return <UnknownIcon {...props} />;
  }
};

export { ContextIcon as default, ContextIcon, ContextIconColors, ContextIconVariant };
