import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { RebootingIcon } from '@patternfly/react-icons';
import { helpers } from '../../common/helpers';

type RefreshTimeButtonProps = {
  lastRefresh: number;
  onRefresh: () => void;
};

const RefreshTimeButton: React.FC<RefreshTimeButtonProps> = ({ lastRefresh = 0, onRefresh }) => {
  const { t } = useTranslation();
  const [refresh, setRefresh] = React.useState<string | null>(
    lastRefresh ? helpers.getTimeDisplayHowLongAgo(lastRefresh) : null
  );

  const pollingInterval = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    pollingInterval.current = setInterval(() => {
      if (lastRefresh) {
        setRefresh(helpers.getTimeDisplayHowLongAgo(lastRefresh));
      }
    }, 3000);

    return () => {
      clearInterval(pollingInterval.current);
      pollingInterval.current = undefined;
    };
  }, [lastRefresh]);

  return (
    <Button variant="link" icon={<RebootingIcon />} onClick={onRefresh} ouiaId="refresh">
      <span className="last-refresh-time">
        {t('refresh-time-button.refreshed', {
          context: lastRefresh && 'load',
          refresh: lastRefresh && refresh
        })}
      </span>
    </Button>
  );
};

export { RefreshTimeButton as default, RefreshTimeButton };
