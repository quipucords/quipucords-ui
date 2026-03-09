import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { type AxiosResponse, isAxiosError } from 'axios';
import helpers from '../helpers';
import apiHelpers from '../helpers/apiHelpers';
import {
  type ExternalAuthLoginLightspeedResponseType,
  type ExternalAuthStatusLightspeedResponseType,
  type ExternalAuthParamsType
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
  const { t } = useTranslation();

  const waitInterval = process.env.REACT_APP_EXTERNAL_AUTH_POLL_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_EXTERNAL_AUTH_POLL_INTERVAL, 10)
    : 1000;

  const requestLightspeedAuth = useCallback(async () => {
    let response: AxiosResponse<ExternalAuthLoginLightspeedResponseType>;
    const config: { params: ExternalAuthParamsType } = {
      params: { auth_type: 'lightspeed' }
    };
    try {
      response = await axios.post(`${process.env.REACT_APP_AUTH_SERVICE_EXTERNAL_LOGIN}`, {}, config);
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
  }, []);

  useEffect(() => {
    if (!lightspeedPollingTrigger) {
      return () => {};
    }

    let pollingTimer: NodeJS.Timeout;

    const config: { params: ExternalAuthParamsType } = {
      params: { auth_type: 'lightspeed' }
    };

    axios
      .get(`${process.env.REACT_APP_AUTH_SERVICE_EXTERNAL_STATUS}`, config)
      .then((response: AxiosResponse<ExternalAuthStatusLightspeedResponseType>) => {
        const status = response.data.status;

        if (status === 'valid') {
          setLightspeedAuthFlowState({ state: 'Successful' });
          helpers.setLightspeedUsername(response.data.metadata.username);
          return;
        }

        if (status === 'failed') {
          setLightspeedAuthFlowState({ state: 'Errored', errorMessage: response.data.metadata.status_reason });
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
  }, [lightspeedPollingTrigger, lightspeedAuthPollAttempt, waitInterval, t]);

  return {
    requestLightspeedAuth,
    cancelLightspeedAuth,
    lightspeedAuthFlowState
  };
};

export { useLightspeedAuthApi, LightspeedAuthFlowState };
