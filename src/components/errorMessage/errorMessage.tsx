import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { helpers } from '../../helpers';

interface ErrorMessageProps {
  description?: string;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ description, title }) => {
  const { t } = useTranslation();
  return (
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateIcon icon={ExclamationCircleIcon} />
      <Title headingLevel="h2" size="lg">
        {title || t('view.error', { context: 'title', appName: helpers.UI_NAME })}
      </Title>
      <EmptyStateBody>{description || t('view.error', { context: 'description' })}</EmptyStateBody>
    </EmptyState>
  );
};

export { ErrorMessage as default, ErrorMessage, type ErrorMessageProps };
