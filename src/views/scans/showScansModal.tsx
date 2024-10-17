import React, { useState } from 'react';
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

interface ShowScansModalProps {
  isOpen: boolean;
  scan?: Pick<Scan, 'name'>;
  scanJobs?: Pick<ScanJobType, 'id' | 'start_time' | 'report_id' | 'status' | 'end_time'>[];
  onDownload?: (report_id: number) => void;
  onClose?: () => void;
  actions?: React.ReactNode[];
}

const ShowScansModal: React.FC<ShowScansModalProps> = ({
  isOpen,
  scan,
  scanJobs,
  onDownload = Function.prototype,
  onClose = Function.prototype,
  actions
}) => {
  const { t } = useTranslation();
  const [activeSortIndex, setActiveSortIndex] = useState<number | undefined>();
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc' | undefined>();

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
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
      {(scanJobs && (
        <React.Fragment>
          <div>
            {scanJobs?.length} scan{scanJobs?.length === 1 ? ' has' : 's have'} run
          </div>
          <br />
          <Table aria-label="Scan jobs table" ouiaId="scan_jobs_table">
            <Thead>
              <Tr>
                <Th aria-labelledby="Sort by column" sort={getSortParams(0)}>
                  Scan Time
                </Th>
                <Th aria-labelledby="Sort by column" sort={getSortParams(1)}>
                  Scan Result
                </Th>
                <Th screenReaderText="Download column"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {scanJobs.map(job => (
                <Tr key={job.id}>
                  <Td dataLabel="Scan Time">{helpers.formatDate(job.end_time || job.start_time)}</Td>
                  <Td dataLabel="Scan Result">{job.status}</Td>
                  <Td dataLabel="Download" isActionCell>
                    {job.report_id && job.end_time && (
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
      )) || (
        <Bullseye>
          <EmptyState>
            <EmptyStateHeader titleText="Loading scans" headingLevel="h2" icon={<EmptyStateIcon icon={Spinner} />} />
          </EmptyState>
        </Bullseye>
      )}
    </Modal>
  );
};

export { ShowScansModal as default, ShowScansModal, type ShowScansModalProps };
