import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { useMergeReportsApi } from '../../hooks/useScanApi';

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
  const { requestReportsMerge, cancelReportsMerge, mergeProcessState } = useMergeReportsApi();
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
      initiatedDownload.current = false;
      requestReportsMerge(reportIds);
    } else {
      cancelReportsMerge();
    }
  }, [isOpen, requestReportsMerge, cancelReportsMerge, reportIds]);

  useEffect(() => {
    if (mergeProcessState.state === 'Successful' && !initiatedDownload.current) {
      initiatedDownload.current = true;
      onSuccess(mergeProcessState.mergedReportId);
    }
  }, [mergeProcessState, onSuccess]);

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t('merge.modal', { context: 'title' })}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      {mergeProcessState.state === 'InProgress' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={Spinner}
            titleText={t('merge.modal', { context: 'body-in-progress' })}
          ></EmptyState>
        </Bullseye>
      )}
      {mergeProcessState.state === 'Successful' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={CheckCircleIcon}
            titleText={t('merge.modal', { context: 'header-successful' })}
          >
            <EmptyStateBody>{t('merge.modal', { context: 'body-successful' })}</EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
      {mergeProcessState.state === 'Errored' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={ExclamationCircleIcon}
            titleText={t('merge.modal', { context: 'header-errored' })}
          >
            <EmptyStateBody>
              {t('merge.modal', {
                context: 'body-errored',
                msg: mergeProcessState.errorMessage
              })}
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
    </Modal>
  );
};

export { MergeReportsModal as default, MergeReportsModal, type MergeReportsModalProps };
