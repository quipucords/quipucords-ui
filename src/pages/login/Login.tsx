import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, LoginPage } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import axios from 'axios';
import bgImage from '../../styles/images/about-bg.png';

export const Login: React.FunctionComponent = () => {
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const nav = useNavigate();

  axios
    .get('https://0.0.0.0:9443/api/v1/users/current/')
    .then(() => {
      //already logged in..
      nav('/');
    })
    .catch(() => {
      //this is good, catch the error and let them log in
    });

  const handleUsernameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setPassword(value);
  };

  const onLoginButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);
    if (username && password) {
      const noInteceptAxios = axios.create();
      noInteceptAxios
        .post('https://0.0.0.0:9443/api/v1/token/', {
          username: username,
          password: password
        })
        .then(res => {
          localStorage.setItem('authToken', res.data.token);
          if (localStorage.getItem('authToken')) {
            axios.interceptors.request.use(
              config => {
                config.headers['Authorization'] = `Token ${res.data.token}`;
                return config;
              },
              error => {
                console.error('Failed to set config', error);
              }
            );
          }
          nav('/');
        })
        .catch(err => {
          console.error({ err });
          setIsValidPassword(false);
          setIsValidUsername(false);
          setShowHelperText(true);
        });
    }
  };

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText="Invalid login credentials."
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Username"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Password"
      passwordValue={password}
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Log in"
    />
  );

  return (
    <LoginPage
      loginTitle="Log in to your account"
      textContent="Welcome to Quipucords! This inspection and reporting tool is designed to identify and report environment data, or facts, such as the number of physical and virtual systems on a network, their operating systems, and other configuration data."
      backgroundImgSrc={bgImage}
    >
      {loginForm}
    </LoginPage>
  );
};
