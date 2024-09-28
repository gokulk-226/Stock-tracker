//index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Grab the root element
const rootElement = document.getElementById('root');

// Create a root using createRoot
const root = createRoot(rootElement);

// Render the App component
root.render(<App />);