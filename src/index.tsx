import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

/**
 * Find root element within HTML template
 */
const element = document.getElementById('root');

/**
 * Attach application to the root element,
 */
if (element) {
  createRoot(element).render(<App />);
}
