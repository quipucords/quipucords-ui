import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  Modal,
  ModalVariant,
  Spinner
} from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import { Table, Thead, Tr, Th, Tbody, Td, type ThProps } from '@patternfly/react-table';
import { helpers } from '../../helpers';
import { type Scan, type ScanJobType } from '../../types/types';

type PartialScanJob = Pick<ScanJobType, 'id' | 'start_time' | 'report_id' | 'status' | 'end_time'>;

interface ShowScansModalProps {
  isOpen: boolean;
  scan?: Pick<Scan, 'name'>;
  scanJobs?: PartialScanJob[];
  onDownload?: (report_id: number) => void;
  onClose?: () => void;
  actions?: React.ReactNode[];
}

/**
 * Sorts scan jobs by the latest scan time in descending order.
 */
const sortByLatestTime = (jobs: PartialScanJob[]) => {
  return [...jobs].sort((a, b) => {
    const timeA = new Date(a.end_time || a.start_time).getTime();
    const timeB = new Date(b.end_time || b.start_time).getTime();
    return timeB - timeA; // Descending order (latest first)
  });
};

/**
 * Returns the sorting value for a scan job based on column index.
 */
const getSortValue = (job: PartialScanJob, index: number) => {
  if (index === 0) {
    return new Date(job.end_time || job.start_time).getTime();
  }
  if (index === 1) {
    return job.status;
  }
  return '';
};

/**
 * Sorts scan jobs by the specified column and direction.
 */
const sortJobs = (jobs: PartialScanJob[], index: number, direction: 'asc' | 'desc') => {
  return [...jobs].sort((a, b) => {
    const valA = getSortValue(a, index);
    const valB = getSortValue(b, index);

    if (valA === valB) {
      return 0;
    }

    if (direction === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });
};

const ShowScansModal: React.FC<ShowScansModalProps> = ({
  isOpen,
  scan,
  scanJobs = [],
  onDownload = Function.prototype,
  onClose = Function.prototype,
  actions
}) => {
  const { t } = useTranslation();
  const [activeSortIndex, setActiveSortIndex] = useState<number | undefined>();
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [sortedScanJobs, setSortedScanJobs] = useState<PartialScanJob[]>([]);

  useEffect(() => {
    if (scanJobs.length) {
      setSortedScanJobs(sortByLatestTime(scanJobs));
    }
  }, [scanJobs]);

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
      setSortedScanJobs(prevJobs => sortJobs(prevJobs, index, direction));
    },
    columnIndex
  });

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t('view.label', { context: 'scans-names', name: scan?.name })}
      isOpen={isOpen}
      onClose={() => onClose()}
      {...(actions && { actions })}
    >
      {sortedScanJobs.length ? (
        <React.Fragment>
          <div>
            {sortedScanJobs.length} scan{sortedScanJobs.length === 1 ? ' has' : 's have'} run
          </div>
          <br />
          <Table aria-label="Scan jobs table" ouiaId="scan_jobs_table">
            <Thead>
              <Tr>
                <Th sort={getSortParams(0)}>Scan Time</Th>
                <Th sort={getSortParams(1)}>Scan Result</Th>
                <Th screenReaderText="Download column"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedScanJobs.map(job => (
                <Tr key={job.id}>
                  <Td dataLabel="Scan Time">{helpers.formatDate(job.end_time || job.start_time)}</Td>
                  <Td dataLabel="Scan Result">{job.status}</Td>
                  <Td dataLabel="Download" isActionCell>
                    {helpers.canDownloadReport(job) && (
                      <Button onClick={() => onDownload(job.report_id)} icon={<DownloadIcon />} variant="link">
                        Download
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </React.Fragment>
      ) : (
        <Bullseye>
          <EmptyState>
            <EmptyStateHeader titleText="Loading scans" headingLevel="h2" icon={<EmptyStateIcon icon={Spinner} />} />
          </EmptyState>
        </Bullseye>
      )}
    </Modal>
  );
};

export {
  ShowScansModal as default,
  ShowScansModal,
  type ShowScansModalProps,
  sortByLatestTime,
  getSortValue,
  sortJobs
};
