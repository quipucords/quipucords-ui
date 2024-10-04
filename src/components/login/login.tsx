/**
 * Provides a login. Handles user authentication with visual feedback.
 * Uses PatternFly for UI and Axios for API requests, redirecting on successful login or displaying errors on failure.
 *
 * @module login
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm, LoginPage } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { useLoginApi, useGetSetAuthApi } from '../../hooks/useLoginApi';
import bgImage from '../../images/aboutBg.png';

interface LoginProps {
  children: React.ReactNode;
  useGetSetAuth?: typeof useGetSetAuthApi;
  useLogin?: typeof useLoginApi;
}

const Login: React.FC<LoginProps> = ({ children, useGetSetAuth = useGetSetAuthApi, useLogin = useLoginApi }) => {
  const { t } = useTranslation();
  const { isAuthorized } = useGetSetAuth();
  const { login } = useLogin();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginError, setIsLoginError] = useState<boolean>(false);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    setIsLoggedIn(isAuthorized);
  }, [isAuthorized]);

  const onChangeUsername = (event: React.FormEvent<HTMLInputElement>, value: string) => {
    setIsValidUsername(value !== '');
    setUsername(value);
  };

  const onChangePassword = (event: React.FormEvent<HTMLInputElement>, value: string) => {
    setIsValidPassword(value !== '');
    setPassword(value);
  };

  const onLoginButtonClick = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      { username, password }: { username: string; password: string }
    ) => {
      event.preventDefault();

      if (!isLoading && username && password) {
        setIsLoading(true);

        login({ username, password })
          .then(
            () => {
              setIsLoggedIn(true);
            },
            () => {
              setIsLoginError(true);
            }
          )
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    [isLoading, login]
  );

  if (isLoggedIn) {
    return children;
  }

  return (
    <LoginPage
      className="fadein"
      loginTitle={t('login.title')}
      textContent={t('login.description')}
      backgroundImgSrc={bgImage}
    >
      <LoginForm
        style={{ opacity: (isLoading && 0.5) || 1 }}
        showHelperText={isLoginError}
        helperText={t('login.invalid')}
        helperTextIcon={<ExclamationCircleIcon />}
        usernameLabel={t('login.label', { context: 'username' })}
        usernameValue={username}
        onChangeUsername={onChangeUsername}
        isValidUsername={isValidUsername}
        passwordLabel={t('login.label', { context: 'password' })}
        passwordValue={password}
        onChangePassword={onChangePassword}
        isValidPassword={isValidPassword}
        onLoginButtonClick={event => onLoginButtonClick(event, { username, password })}
        loginButtonLabel={t('login.label', { context: 'login' })}
      />
    </LoginPage>
  );
};

export { Login as default, Login, type LoginProps };
