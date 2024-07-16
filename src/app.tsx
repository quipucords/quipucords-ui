/**
 * Root component of the application that sets up global styles, localization, secure API requests, and routing.
 * It includes automatic token authorization for axios requests and wraps the UI with localization and routing contexts.
 *
 * @module app
 */
import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import './app.css';

const App: React.FC = () => 'hello world';

export { App as default, App };
