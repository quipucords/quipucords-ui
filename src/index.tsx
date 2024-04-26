import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import App from 'src/app';

if (process.env.NODE_ENV !== 'production') {
  const config = {
    rules: [
      {
        id: 'color-contrast',
        enabled: false
      }
    ]
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef,global-require
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000, config);
}

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <SessionProvider> TODO: possibly add this back in when we do login/auth stuff */}
      <App />
      {/* </SessionProvider> */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
