import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/roboto-serif/opsz.css';
import '@fontsource-variable/roboto-serif/opsz-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '../style.css';
import './docs.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Docs from './Docs.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Docs />
  </StrictMode>,
);
