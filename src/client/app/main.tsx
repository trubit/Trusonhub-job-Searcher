import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import RootWithProviders from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('[Talentra] Root element #root not found in DOM.');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <RootWithProviders />
  </StrictMode>,
);
