/**
 * Displays a "404 Page Not Found" message with an option to navigate back to the homepage.
 * Utilizes PatternFly components for a consistent and accessible UI,
 * providing a clear indication that the requested page could not be found.
 *
 * @module notFound
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, EmptyStateBody, EmptyStateFooter, PageSection } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageSection hasBodyWrapper={false}>
      <EmptyState
        headingLevel="h1"
        icon={ExclamationTriangleIcon}
        titleText={t('view.empty-state_title_not-found')}
        variant="full"
      >
        <EmptyStateBody>{t('view.empty-state_description_not-found')}</EmptyStateBody>
        <EmptyStateFooter>
          <Button onClick={() => navigate('/')}>{t('view.label_not-found_home')}</Button>
        </EmptyStateFooter>
      </EmptyState>
    </PageSection>
  );
};

export { NotFound as default, NotFound };
