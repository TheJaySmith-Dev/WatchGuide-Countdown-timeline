
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("CineTime: Initializing application...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("CineTime Error: Could not find root element with id 'root'");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("CineTime: App rendered successfully");
  } catch (error) {
    console.error("CineTime: Critical error during initial render:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: white; background: #900; font-family: sans-serif;">
      <h1>Critical Error</h1>
      <p>The application failed to start.</p>
      <pre style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;">${error instanceof Error ? error.stack || error.message : String(error)}</pre>
    </div>`;
  }
}
