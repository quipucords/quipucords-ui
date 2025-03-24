import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AboutModal as PfAboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import { detect } from 'detect-browser';
import moment from 'moment/moment';
import { helpers } from '../../helpers';
import { useUserApi } from '../../hooks/useLoginApi';
import { useStatusApi, type ApiStatusSuccessType } from '../../hooks/useStatusApi';
import backgroundImageSrc from '../../images/aboutBg.png';

interface AboutModalProps {
  currentYear?: string;
  isOpen?: boolean;
  onClose?: () => void;
  titleImg?: string;
  uiName?: string;
  uiVersion?: string;
  useStatus?: typeof useStatusApi;
  useUser?: typeof useUserApi;
}

const AboutModal: React.FC<AboutModalProps> = ({
  currentYear = moment.utc(helpers.getCurrentDate()).format('YYYY'),
  isOpen = false,
  onClose = Function.prototype,
  titleImg = helpers.getTitleImg(),
  uiName = helpers.UI_NAME,
  uiVersion = helpers.UI_VERSION,
  useStatus = useStatusApi,
  useUser = useUserApi
}) => {
  const { t } = useTranslation();
  const { getStatus } = useStatus();
  const { getUser } = useUser();
  const [userName, setUserName] = useState<string>();
  const [stats, setStats] = useState<ApiStatusSuccessType>();
  const browser = detect();
  const loadingClassName = (!stats && 'fadein') || '';

  useEffect(() => {
    if (isOpen && !stats) {
      getUser().then(username => setUserName(username));
      getStatus().then(
        data => setStats(data),
        error => console.error(`About status error: ${error} `)
      );
    }
  }, [isOpen, getStatus, getUser, stats]);

  return (
    <PfAboutModal
      aria-label={uiName}
      backgroundImageSrc={backgroundImageSrc as string}
      brandImageAlt={uiName}
      brandImageSrc={titleImg}
      isOpen={isOpen}
      onClose={() => onClose()}
      trademark={t('about.copyright', { year: currentYear })}
    >
      <TextContent className={loadingClassName}>
        <TextList component="dl">
          {userName && (
            <React.Fragment>
              <TextListItem component="dt">{t('about.username')}</TextListItem>
              <TextListItem component="dd">{userName}</TextListItem>
            </React.Fragment>
          )}
          {browser && (
            <React.Fragment>
              <TextListItem component="dt">{t('about.browser-version')}</TextListItem>
              <TextListItem component="dd">{`${browser.name} ${browser.version}`}</TextListItem>
            </React.Fragment>
          )}
          {browser && (
            <React.Fragment>
              <TextListItem component="dt">{t('about.browser-os')}</TextListItem>
              <TextListItem component="dd">{browser.os || ''}</TextListItem>
            </React.Fragment>
          )}
          {uiVersion && (
            <React.Fragment>
              <TextListItem component="dt">{t('about.ui-version')}</TextListItem>
              <TextListItem component="dd">{uiVersion}</TextListItem>
            </React.Fragment>
          )}
          {stats?.server_version && (
            <React.Fragment>
              <TextListItem className={loadingClassName} component="dt">
                {t('about.server-version')}
              </TextListItem>
              <TextListItem className={loadingClassName} component="dd">
                {stats.server_version}
              </TextListItem>
            </React.Fragment>
          )}
          {stats?.platform.machine && (
            <React.Fragment>
              <TextListItem className={loadingClassName} component="dt">
                {t('about.server-cpu-arch')}
              </TextListItem>
              <TextListItem className={loadingClassName} component="dd">
                {stats.platform.machine}
              </TextListItem>
            </React.Fragment>
          )}
        </TextList>
      </TextContent>
    </PfAboutModal>
  );
};

export { AboutModal as default, AboutModal, type AboutModalProps };
