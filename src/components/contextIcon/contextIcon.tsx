/**
 * Provides a React component for rendering context-specific icons based on status or type, using PatternFly icons
 * and styling tokens for color consistency. Supports various icon sizes and custom props for additional configuration.
 *
 * @module contextIcon
 */
import * as React from 'react';
import { Icon, Spinner } from '@patternfly/react-core';
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
      return (
        <Icon status="danger">
          <ExclamationCircleIcon {...props} />
        </Icon>
      );
    case ContextIconVariant.idCard:
      return (
        <Icon {...{ '--pf-v6-c-icon__content--Color': '--pf-t--global--text--color--regular' }}>
          <IdCardIcon {...props} />
        </Icon>
      );
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
      return (
        <Icon status="warning">
          <ExclamationTriangleIcon {...props} />
        </Icon>
      );
    case ContextIconVariant.pencil:
      return <PencilAltIcon {...props} />;
    case ContextIconVariant.pending:
      return (
        <Icon size={size || 'sm'} isInline>
          <Spinner />
        </Icon>
      );
    case ContextIconVariant.satellite:
      return <PficonSatelliteIcon {...props} />;
    case ContextIconVariant.scans:
      return <ClipboardCheckIcon {...props} />;
    case ContextIconVariant.sources:
      return <CrosshairsIcon {...props} />;
    case ContextIconVariant.success:
      return (
        <Icon status="success">
          <CheckCircleIcon {...props} />
        </Icon>
      );
    case ContextIconVariant.trash:
      return <TrashIcon {...props} />;
    case ContextIconVariant.unreachable:
      return (
        <Icon status="danger">
          <DisconnectedIcon {...props} />
        </Icon>
      );
    case ContextIconVariant.user:
      return <UserIcon {...props} />;
    case ContextIconVariant.vcenter:
      return <PficonVcenterIcon {...props} />;
    case ContextIconVariant.unknown:
    default:
      return <UnknownIcon {...props} />;
  }
};

export { ContextIcon as default, ContextIcon, ContextIconVariant };
