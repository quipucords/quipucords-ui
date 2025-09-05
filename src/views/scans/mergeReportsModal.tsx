import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { BugIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { useMergeReportsApi, MergeProcessState } from '../../hooks/useScanApi';

interface MergeReportsModalProps {
  isOpen: boolean;
  reportIds: number[];
  onClose?: () => void;
  onSuccess?: (mergedReportId: number) => void;
}

const MergeReportsModal: React.FC<MergeReportsModalProps> = ({
  isOpen,
  reportIds,
  onClose = Function.prototype,
  onSuccess = Function.prototype
}) => {
  const { t } = useTranslation();
  const { requestReportsMerge, cancelReportsMerge, mergeProcessState, errorMessage } = useMergeReportsApi();
  // Workaround the following problem:
  // 1. onSuccess is called. This causes report to download and sets reportIdsToMerge to []
  // 2. empty reportIdsToMerge closes the modal
  // 3. that causes useEffect(..., [mergeProcessState]) to run BEFORE other useEffect manages to
  //    call cancelReportsMerge
  // 4. so onSuccess is called again, causing report to be downloaded again
  // The alternative is to have single useEffect depending on both isOpen and mergeProcessState,
  // and much more complex conditionals inside.
  const initiatedDownload = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && reportIds.length) {
      requestReportsMerge(reportIds);
    } else {
      cancelReportsMerge();
      initiatedDownload.current = false;
    }
  }, [isOpen, requestReportsMerge, cancelReportsMerge, reportIds]);

  useEffect(() => {
    const { state, mergedReportId } = mergeProcessState;
    if (state === MergeProcessState.Successful && mergedReportId !== undefined && !initiatedDownload.current) {
      initiatedDownload.current = true;
      onSuccess(mergedReportId);
    }
  }, [mergeProcessState, onSuccess]);

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t('view.label', { context: 'merge' })}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      {mergeProcessState.state === MergeProcessState.InProgress && (
        <Bullseye>
          <EmptyState headingLevel="h2" icon={Spinner} titleText="Merging reports"></EmptyState>
        </Bullseye>
      )}
      {mergeProcessState.state === MergeProcessState.Successful && (
        <Bullseye>
          <EmptyState headingLevel="h2" icon={CheckCircleIcon} titleText="Success">
            <EmptyStateBody>Your download will start automatically</EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
      {mergeProcessState.state === MergeProcessState.Errored && (
        <Bullseye>
          <EmptyState headingLevel="h2" icon={BugIcon} titleText="Something went wrong">
            <EmptyStateBody>Error would go here: {errorMessage}</EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
    </Modal>
  );
};

export { MergeReportsModal as default, MergeReportsModal, type MergeReportsModalProps };
