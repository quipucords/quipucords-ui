import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { type AxiosResponse, isAxiosError } from 'axios';
import helpers from '../helpers';
import apiHelpers from '../helpers/apiHelpers';
import {
  type ExternalAuthLoginLightspeedResponseType,
  type ExternalAuthStatusLightspeedResponseType
} from '../types/types';

interface InitiatedState {
  state: 'Initiated';
}

interface AwaitingAuthorizationState {
  state: 'AwaitingAuthorization';
  uri: string;
}

interface SuccessfulState {
  state: 'Successful';
}

interface ErroredState {
  state: 'Errored';
  errorMessage: string;
}

type LightspeedAuthFlowState = InitiatedState | AwaitingAuthorizationState | SuccessfulState | ErroredState;

const useLightspeedAuthApi = () => {
  const [lightspeedAuthFlowState, setLightspeedAuthFlowState] = useState<LightspeedAuthFlowState>({
    state: 'Initiated'
  });
  const [lightspeedPollingTrigger, setLightspeedPollingTrigger] = useState<boolean>(false);
  const [lightspeedAuthPollAttempt, setLightspeedAuthPollAttempt] = useState<number>(0);
  const [lightspeedIsAuthenticated, setLightspeedIsAuthenticated] = useState<boolean>(
    helpers.isLightspeedAuthenticated()
  );
  const { t } = useTranslation();

  const waitInterval = process.env.REACT_APP_EXTERNAL_AUTH_POLL_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_EXTERNAL_AUTH_POLL_INTERVAL, 10)
    : 1000;

  const currentLightspeedAuthStatus = useCallback(() => {
    return axios
      .get(`${process.env.REACT_APP_AUTH_SERVICE_EXTERNAL_STATUS}`)
      .then((response: AxiosResponse<ExternalAuthStatusLightspeedResponseType>) => response.data);
  }, []);

  const requestLightspeedAuth = useCallback(async () => {
    let response: AxiosResponse<ExternalAuthLoginLightspeedResponseType>;
    try {
      response = await axios.post(`${process.env.REACT_APP_AUTH_SERVICE_EXTERNAL_LOGIN}`);
      const verificationUri = response.data.verification_uri_complete;
      if (!verificationUri) {
        throw new Error(t('external-auth.lightspeed.error', { context: 'no-uri', appName: helpers.UI_NAME }));
      }
      setLightspeedAuthFlowState({ state: 'AwaitingAuthorization', uri: verificationUri });
      setLightspeedPollingTrigger(true);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = [error.message, apiHelpers.extractErrorMessage(error.response?.data)].join(': ');
        setLightspeedAuthFlowState({ state: 'Errored', errorMessage: errorMessage });
      } else if (error instanceof Error) {
        setLightspeedAuthFlowState({ state: 'Errored', errorMessage: error.message });
      } else {
        setLightspeedAuthFlowState({
          state: 'Errored',
          errorMessage: t('external-auth.lightspeed.error', { context: 'unknown' })
        });
      }
    }
  }, [t]);

  const cancelLightspeedAuth = useCallback((): void => {
    setLightspeedAuthFlowState({ state: 'Initiated' });
    setLightspeedPollingTrigger(false);
    setLightspeedAuthPollAttempt(0);
    setLightspeedIsAuthenticated(helpers.isLightspeedAuthenticated());
  }, []);

  const requestLightspeedAuthLogout = useCallback(async () => {
    await axios.post(`${process.env.REACT_APP_AUTH_SERVICE_EXTERNAL_LOGOUT}`).finally(() => {
      helpers.setLightspeedUsername(undefined);
      setLightspeedIsAuthenticated(helpers.isLightspeedAuthenticated());
    });
  }, []);

  const requestLightspeedAuthStatus = useCallback((): void => {
    currentLightspeedAuthStatus()
      .then(data => {
        const status = data.status;

        if (status === 'valid') {
          helpers.setLightspeedUsername(data.metadata.username);
          setLightspeedIsAuthenticated(helpers.isLightspeedAuthenticated());
          return;
        }

        throw new Error('Lightspeed not authenticated');
      })
      .catch(_error => {
        helpers.setLightspeedUsername();
        setLightspeedIsAuthenticated(helpers.isLightspeedAuthenticated());
      });
  }, [currentLightspeedAuthStatus]);

  useEffect(() => {
    if (!lightspeedPollingTrigger) {
      return () => {};
    }

    let pollingTimer: NodeJS.Timeout;

    currentLightspeedAuthStatus()
      .then(data => {
        const status = data.status;

        if (status === 'valid') {
          setLightspeedAuthFlowState({ state: 'Successful' });
          helpers.setLightspeedUsername(data.metadata.username);
          setLightspeedIsAuthenticated(helpers.isLightspeedAuthenticated());
          return;
        }

        if (status === 'failed') {
          setLightspeedAuthFlowState({ state: 'Errored', errorMessage: data.metadata.status_reason });
          return;
        }

        if (['missing', 'expired'].includes(status)) {
          setLightspeedAuthFlowState({
            state: 'Errored',
            errorMessage: t('external-auth.lightspeed.error', { context: status, appName: helpers.UI_NAME })
          });
          return;
        }

        pollingTimer = setTimeout(
          () => setLightspeedAuthPollAttempt(prevPollAttempt => prevPollAttempt + 1),
          waitInterval
        );
      })
      .catch(error => {
        if (isAxiosError(error)) {
          const errorMessage = [error.message, apiHelpers.extractErrorMessage(error.response?.data)].join(': ');
          setLightspeedAuthFlowState({ state: 'Errored', errorMessage: errorMessage });
        } else if (error instanceof Error) {
          setLightspeedAuthFlowState({ state: 'Errored', errorMessage: error.message });
        } else {
          setLightspeedAuthFlowState({
            state: 'Errored',
            errorMessage: t('external-auth.lightspeed.error', { context: 'unknown' })
          });
        }
      });

    return () => {
      clearTimeout(pollingTimer);
    };
  }, [currentLightspeedAuthStatus, lightspeedPollingTrigger, lightspeedAuthPollAttempt, waitInterval, t]);

  return {
    requestLightspeedAuth,
    requestLightspeedAuthLogout,
    requestLightspeedAuthStatus,
    cancelLightspeedAuth,
    lightspeedAuthFlowState,
    lightspeedIsAuthenticated
  };
};

export { useLightspeedAuthApi, LightspeedAuthFlowState };
