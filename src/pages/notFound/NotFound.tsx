/**
 * Displays a "404 Page Not Found" message with an option to navigate back to the homepage. Utilizes PatternFly components
 * for a consistent and accessible UI, providing a clear indication that the requested page could not be found.
 * @module NotFound
 */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  PageSection
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const NotFound: React.FunctionComponent = () => {
  const GoHomeBtn = () => {
    const navigate = useNavigate();
    const handleClick = () => {
      navigate('/');
    };
    return <Button onClick={handleClick}>Take me home</Button>;
  };

  return (
    <PageSection>
      <EmptyState variant="full">
        <EmptyStateHeader
          titleText="404 Page not found"
          icon={<EmptyStateIcon icon={ExclamationTriangleIcon} />}
          headingLevel="h1"
        />
        <EmptyStateBody>
          Page not found
        </EmptyStateBody>
        <EmptyStateFooter>
          <GoHomeBtn />
        </EmptyStateFooter>
      </EmptyState>
    </PageSection>
  );
};

export default NotFound;
