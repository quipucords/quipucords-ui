import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import App from './app';

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
