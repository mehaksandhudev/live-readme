import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Notify the VS Code extension host that the webview React app is ready.
// This replaces the fragile setTimeout approach in extension.ts.
if (typeof acquireVsCodeApi !== 'undefined') {
  const vscode = acquireVsCodeApi();
  vscode.postMessage({ type: 'webview_ready' });
}
