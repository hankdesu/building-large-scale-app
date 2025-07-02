import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
// import App from './App.jsx';
// import CodeSplittingApp from './CodeSplitting.jsx';
import DynamicImport from './DynamicImport.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <CodeSplittingApp /> */}
    <DynamicImport />
  </StrictMode>
);
