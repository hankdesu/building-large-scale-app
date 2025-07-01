import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import App from './App.jsx';
import CodeSplittingApp from './CodeSplitting.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <CodeSplittingApp /> */}
  </StrictMode>
);
