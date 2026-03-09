import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Bullseye, Button, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { ExclamationCircleIcon, CheckCircleIcon, PendingIcon } from '@patternfly/react-icons';
import { helpers } from '../../helpers/helpers';
import { type LightspeedAuthFlowState } from '../../hooks/useAuthApi';

interface LightspeedAuthProps {
  lightspeedAuthFlowState: LightspeedAuthFlowState;
}

const LightspeedAuth: React.FC<LightspeedAuthProps> = ({ lightspeedAuthFlowState: lightspeedAuthFlowState }) => {
  const { t } = useTranslation();

  return (
    <div>
      {lightspeedAuthFlowState.state === 'Initiated' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={Spinner}
            titleText={t('external-auth.lightspeed.flow', { context: 'body-initiated' })}
          ></EmptyState>
        </Bullseye>
      )}
      {lightspeedAuthFlowState.state === 'AwaitingAuthorization' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={PendingIcon}
            titleText={t('external-auth.lightspeed.flow', {
              context: 'header-awaiting-authorization',
              appName: helpers.UI_NAME
            })}
          >
            <EmptyStateBody>
              <p>
                {t('external-auth.lightspeed.flow', {
                  context: 'body-awaiting-authorization',
                  appName: helpers.UI_NAME
                })}
              </p>
              <p className="pf-v6-u-mt-xl">
                <Button component="a" href={lightspeedAuthFlowState.uri} target="_blank" variant="primary" size="lg">
                  {t('external-auth.lightspeed.flow', {
                    context: 'body-awaiting-authorization-button'
                  })}
                </Button>
              </p>
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
      {lightspeedAuthFlowState.state === 'Successful' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={CheckCircleIcon}
            titleText={t('external-auth.lightspeed.flow', { context: 'header-successful' })}
          >
            <EmptyStateBody>
              {t('external-auth.lightspeed.flow', {
                context: 'body-successful'
              })}
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
      {lightspeedAuthFlowState.state === 'Errored' && (
        <Bullseye>
          <EmptyState
            headingLevel="h2"
            icon={ExclamationCircleIcon}
            titleText={t('external-auth.lightspeed.flow', { context: 'header-errored' })}
          >
            <EmptyStateBody>
              <Trans
                i18nKey="external-auth.lightspeed.flow"
                context="body-errored"
                components={[<p key="p1" />, <p key="p2" />]}
                values={{ msg: lightspeedAuthFlowState.errorMessage }}
              />
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      )}
    </div>
  );
};

export { LightspeedAuth as default, LightspeedAuth, LightspeedAuthProps };
