import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListDescription,
  DescriptionListGroup,
  Title
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { helpers } from '../../helpers';
import { type ReportAggregateDiagnosticsType, type ReportAggregateResultsType } from '../../types/types';

type PartialReportsAggregateResponse = {
  results?: Partial<ReportAggregateResultsType>;
  diagnostics?: Partial<ReportAggregateDiagnosticsType>;
};

type Report = {
  id: number;
  report: PartialReportsAggregateResponse;
};

interface ShowAggregateReportModalProps {
  isOpen: boolean;
  report?: Report;
  onClose?: () => void;
  actions?: React.ReactNode[];
}

/**
 * A filter list for displaying specific report properties. Order does not represent display sort.
 */
const statsFilter = [
  'ansible_hosts_all',
  'instances_hypervisor',
  'instances_physical',
  'instances_virtual',
  'openshift_cores',
  'socket_pairs',
  'system_creation_date_average',
  'vmware_hosts',
  'inspect_result_status_failed',
  'inspect_result_status_success',
  'inspect_result_status_unknown',
  'inspect_result_status_unreachable',
  'missing_pem_files',
  'missing_system_creation_date',
  'missing_system_purpose'
];

/**
 * Apply list format, sort, and filter to report
 */
const formatSortFilterReportStats = (
  report: PartialReportsAggregateResponse = {},
  { filter = statsFilter }: { filter?: string[] } = {}
) => {
  const { results: resultStats = {}, diagnostics: diagnosticStats = {} } = report;

  return [...Object.entries(resultStats || {}), ...Object.entries(diagnosticStats || {})]
    .filter(([key]) => filter.includes(key))
    .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
    .map(([key, value]) => {
      const updatedValue = (
        (key === 'system_creation_date_average' && helpers.formatDate(value as Date, 'DD MMMM Y')) ||
        value
      )?.toString();

      return [key, updatedValue];
    });
};

/**
 * Modal display for report summary stats.
 */
const ShowAggregateReportModal: React.FC<ShowAggregateReportModalProps> = ({
  isOpen,
  report,
  onClose = Function.prototype,
  actions
}) => {
  const { t } = useTranslation();
  const stats = formatSortFilterReportStats(report?.report);

  return (
    <Modal
      variant={ModalVariant.small}
      title={t('modal.title', { context: 'scan-summary' })}
      isOpen={isOpen}
      onClose={() => onClose()}
      {...(actions && { actions })}
    >
      <Title className="pf-v6-u-mb-lg" headingLevel="h2" size="md">
        {t('modal.subtitle', { context: 'scan-id', value: report?.id })}
      </Title>
      <DescriptionList isHorizontal isFluid isCompact>
        {stats.map(([key, value]) => {
          return (
            <DescriptionListGroup data-ouia-component-id={key} key={key}>
              <DescriptionListTerm>{t('modal.label', { context: key })}</DescriptionListTerm>
              <DescriptionListDescription>{value}</DescriptionListDescription>
            </DescriptionListGroup>
          );
        })}
      </DescriptionList>
    </Modal>
  );
};

export {
  ShowAggregateReportModal as default,
  ShowAggregateReportModal,
  formatSortFilterReportStats,
  statsFilter,
  type PartialReportsAggregateResponse,
  type Report,
  type ShowAggregateReportModalProps
};
