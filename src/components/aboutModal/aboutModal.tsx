import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AboutModal as PfAboutModal, Content } from '@patternfly/react-core';
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
      <Content className={loadingClassName}>
        <Content component="dl">
          {userName && (
            <React.Fragment>
              <Content component="dt">{t('about.username')}</Content>
              <Content component="dd">{userName}</Content>
            </React.Fragment>
          )}
          {browser && (
            <React.Fragment>
              <Content component="dt">{t('about.browser-version')}</Content>
              <Content component="dd">{`${browser.name} ${browser.version}`}</Content>
            </React.Fragment>
          )}
          {browser && (
            <React.Fragment>
              <Content component="dt">{t('about.browser-os')}</Content>
              <Content component="dd">{browser.os || ''}</Content>
            </React.Fragment>
          )}
          {uiVersion && (
            <React.Fragment>
              <Content component="dt">{t('about.ui-version')}</Content>
              <Content component="dd">{uiVersion}</Content>
            </React.Fragment>
          )}
          {stats?.server_version && (
            <React.Fragment>
              <Content className={loadingClassName} component="dt">
                {t('about.server-version')}
              </Content>
              <Content className={loadingClassName} component="dd">
                {stats.server_version}
              </Content>
            </React.Fragment>
          )}
          {stats?.platform.machine && (
            <React.Fragment>
              <Content className={loadingClassName} component="dt">
                {t('about.server-cpu-arch')}
              </Content>
              <Content className={loadingClassName} component="dd">
                {stats.platform.machine}
              </Content>
            </React.Fragment>
          )}
        </Content>
      </Content>
    </PfAboutModal>
  );
};

export { AboutModal as default, AboutModal, type AboutModalProps };
