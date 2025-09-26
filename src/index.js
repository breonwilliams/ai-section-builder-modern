/**
 * Editor entry point
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import DOMPurify from 'dompurify';
// Import design tokens first, then editor styles
import './styles/tokens/index.css';
import './styles/editor.css';
// Import component styles
import './styles/components/global-settings.css';
// Import section styles for preview
import './styles/sections/hero.css';
import './styles/sections/features.css';
import './styles/sections/stats.css';
import App from './App';

// Configure DOMPurify globally
window.DOMPurify = DOMPurify;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('aisb-editor-root');
  
  if (rootElement) {
    // Create React root and render app
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Once React is mounted, hide loading and show body
    setTimeout(() => {
      const loadingElement = document.getElementById('aisb-editor-loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      
      // Add ready class to show the editor
      document.body.classList.add('aisb-editor-ready');
    }, 100); // Small delay to ensure React has rendered
  }
});