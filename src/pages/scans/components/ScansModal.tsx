import * as React from 'react';
import {
    Bullseye,
    Button,
    EmptyState,
    EmptyStateHeader,
    EmptyStateIcon,
    Modal,
    ModalVariant,
    Spinner,
    Text,
    TextContent,
} from '@patternfly/react-core';
import { ScanJobType, ScanType } from 'src/types';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { DownloadIcon } from '@patternfly/react-icons';

export interface ScansModalProps {
    scan: ScanType;
    scanJobs?: ScanJobType[];
    onDownload: (number) => void;
    onClose: () => void;
}

export const ScansModal: React.FC<ScansModalProps> = ({ scan, scanJobs, onDownload, onClose }) => {
    const { t } = useTranslation();
    const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>();
    const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | undefined>();
    // const [selectedJobs, setSelectedJobs] = React.useState<number[]>([]);

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

    const formatDate = (date: Date) => {
        return moment.utc(date).tz('America/New_York').format('DD MMMM Y, h:MM A z');
    }
    // const isJobSelected = (job: ScanJobType) => { return selectedJobs.includes(job.id); };
    // const isJobSelectable = (job: ScanJobType) => { return true || job.status === "completed"; };
    // const selectableJobs = scanJobs ? scanJobs.filter(isJobSelectable) : [];
    // const onSelectJob = (job: ScanJobType, rowIndex: number, isSelecting: boolean) => {
    //     setSelectedJobs((prevSelected) => {
    //         const otherSelected = prevSelected.filter((j) => j !== job.id);
    //         return isSelecting && isJobSelectable(job) ? [...otherSelected, job.id] : otherSelected;
    //       });
    // };
    // const areAllJobsSelected = false;

    // const selectAllJobs = (isSelecting: boolean = true) => {
    //     setSelectedJobs(isSelecting ? selectableJobs.map((j) => j.id) : []);
    // };

    const getSortableRowValues = (scanJob: ScanJobType): (Date | string)[] => {
        const { end_time, status } = scanJob;
        return [end_time, status];
    };

    let sortedJobs = scanJobs;
    if (activeSortIndex !== undefined && scanJobs) {
        sortedJobs = scanJobs.sort((a, b) => {
            const aValue = getSortableRowValues(a)[activeSortIndex];
            const bValue = getSortableRowValues(b)[activeSortIndex];
            console.log({ aValue, bValue })
            if (activeSortDirection === 'asc') {
                return (aValue as string)?.localeCompare(bValue as string);
            }
            return (bValue as string)?.localeCompare(aValue as string);
        });
    }

    return (
        <Modal variant={ModalVariant.medium} title={t('view.label', { context: 'scans-ids', name: scan.id })} isOpen onClose={onClose}>
            {scanJobs && (
                <>
                    <div>{scanJobs?.length} scan{scanJobs?.length === 1 ? ' has' : 's have'} run</div><br />
                    <Table aria-label="Scan jobs table">
                        <Thead>
                            <Tr>
                                {/* <Th
                                    select={{
                                        onSelect: (_event, isSelecting) => selectAllJobs(isSelecting),
                                        isSelected: areAllJobsSelected
                                    }}
                                /> */}
                                <Th sort={getSortParams(0)}>Scan Time</Th>
                                <Th sort={getSortParams(1)}>Scan Result</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {scanJobs.map((job, rowIndex) => (
                                <Tr key={job.id}>
                                    {/* <Td
                                        select={{
                                            rowIndex,
                                            onSelect: (_event, isSelecting) => onSelectJob(job, rowIndex, isSelecting),
                                            isSelected: isJobSelected(job),
                                            isDisabled: !isJobSelectable(job)
                                        }}
                                    /> */}
                                    <Td dataLabel="Scan Time">{job.end_time ? formatDate(job.end_time) : ''}</Td>
                                    <Td dataLabel="Scan Result">{job.status}</Td>
                                    <Td dataLabel="Download" isActionCell>
                                        {job.report_id && (
                                            <Button
                                                onClick={() => onDownload(job.report_id)}
                                                icon={<DownloadIcon />}
                                                variant="link">
                                                Download
                                            </Button>
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </>
            )}
            {!scanJobs && (
                <Bullseye>
                    <EmptyState>
                        <EmptyStateHeader titleText="Loading scans" headingLevel="h2" icon={<EmptyStateIcon icon={Spinner} />} />
                    </EmptyState>
                </Bullseye>
            )}

        </Modal>
    );
};