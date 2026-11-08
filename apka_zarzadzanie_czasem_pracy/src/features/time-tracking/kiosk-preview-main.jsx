
import React from 'react';
import { createRoot } from 'react-dom/client';
import KioskPreview from './KioskPreview';
import '../../index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KioskPreview />
  </React.StrictMode>
);
