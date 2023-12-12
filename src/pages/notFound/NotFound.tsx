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
          We didn&apos;t find a page that matches the address you navigated to.
        </EmptyStateBody>
        <EmptyStateFooter>
          <GoHomeBtn />
        </EmptyStateFooter>
      </EmptyState>
    </PageSection>
  );
};

export default NotFound;
