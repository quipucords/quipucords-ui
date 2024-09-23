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
  scanJobs?: Pick<ScanJobType, 'id' | 'end_time' | 'report_id' | 'status'>[];
  onDownload?: (number) => void;
  onClose?: () => void;
}

const ShowScansModal: React.FC<ShowScansModalProps> = ({
  isOpen,
  scan,
  scanJobs,
  onDownload = Function.prototype,
  onClose = Function.prototype
}) => {
  const { t } = useTranslation();
  const [activeSortIndex, setActiveSortIndex] = useState<number | undefined>();
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc' | undefined>();
  // const [selectedJobs, setSelectedJobs] = useState<number[]>([]);

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

  /* ToDo: This code is for future use around Discovery-437. If it isn't used when the issue has resolved remove it
 *
  const isJobSelected = (job: ScanJobType) => { return selectedJobs.includes(job.id); };
  const isJobSelectable = (job: ScanJobType) => { return true || job.status === "completed"; };
  const selectableJobs = scanJobs ? scanJobs.filter(isJobSelectable) : [];
  const onSelectJob = (job: ScanJobType, rowIndex: number, isSelecting: boolean) => {
      setSelectedJobs((prevSelected) => {
          const otherSelected = prevSelected.filter((j) => j !== job.id);
          return isSelecting && isJobSelectable(job) ? [...otherSelected, job.id] : otherSelected;
        });
  };
  const areAllJobsSelected = false;

  const selectAllJobs = (isSelecting: boolean = true) => {
      setSelectedJobs(isSelecting ? selectableJobs.map((j) => j.id) : []);
  };
  const getSortableRowValues = (scanJob: ScanJobType): (Date | string)[] => {
  const { end_time, status } = scanJob;
  return [end_time, status];
};

  let sortedJobs = scanJobs;
  if (activeSortIndex !== undefined && scanJobs) {
    sortedJobs = scanJobs.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      console.log({ aValue, bValue });
      if (activeSortDirection === 'asc') {
        return (aValue as string)?.localeCompare(bValue as string);
      }
      return (bValue as string)?.localeCompare(aValue as string);
    });
  }*/

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t('view.label', { context: 'scans-names', name: scan?.name })}
      isOpen={isOpen}
      onClose={() => onClose()}
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
                {/* <Th
                                    select={{
                                        onSelect: (_event, isSelecting) => selectAllJobs(isSelecting),
                                        isSelected: areAllJobsSelected
                                    }}
                                /> */}
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
                  {/* <Td
                                        select={{
                                            rowIndex,
                                            onSelect: (_event, isSelecting) => onSelectJob(job, rowIndex, isSelecting),
                                            isSelected: isJobSelected(job),
                                            isDisabled: !isJobSelectable(job)
                                        }}
                                    /> */}
                  <Td dataLabel="Scan Time">{job.end_time ? helpers.formatDate(job.end_time) : ''}</Td>
                  <Td dataLabel="Scan Result">{job.status}</Td>
                  <Td dataLabel="Download" isActionCell>
                    {job.report_id && (
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
