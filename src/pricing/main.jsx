import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/roboto-serif/opsz.css';
import '@fontsource-variable/roboto-serif/opsz-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '../style.css';
import './pricing.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PricingPage from './PricingPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PricingPage />
  </StrictMode>,
);
