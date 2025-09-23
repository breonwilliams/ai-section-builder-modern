module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Preserve CSS variables - don't purge them
  safelist: [
    // Preserve all CSS variables
    { pattern: /^--aisb-/ },
    // Preserve dynamic classes that may be added via JS
    { pattern: /^aisb-/ },
    // Preserve animation classes
    'animate-pulse',
    'is-saving',
    'is-active',
    // Preserve section modifiers
    'aisb-section--dark',
    'aisb-section--light',
    'aisb-section--center',
    'aisb-section--content-left', 
    'aisb-section--content-right',
  ],
  theme: {
    extend: {
      // Map Tailwind utilities to our design tokens where needed
      colors: {
        // Editor tokens - for editor UI only
        'editor-accent': 'var(--aisb-editor-accent)',
        'editor-bg': 'var(--aisb-editor-bg-base)',
        'editor-surface': 'var(--aisb-editor-bg-surface)',
        'editor-text': 'var(--aisb-editor-text-primary)',
        // Section tokens - for content rendering
        'section-primary': 'var(--aisb-color-primary)',
        'section-text': 'var(--aisb-color-text)',
        'section-bg': 'var(--aisb-color-background)',
      },
      fontFamily: {
        'editor': 'var(--aisb-editor-font-family)',
        'section': 'var(--aisb-section-font-family)',
      },
      spacing: {
        'editor-toolbar': 'var(--aisb-editor-toolbar-height)',
        'editor-panel-left': 'var(--aisb-editor-panel-left-width)',
        'editor-panel-right': 'var(--aisb-editor-panel-right-width)',
      }
    },
  },
  plugins: [],
  // Ensure CSS variables are preserved in production build
  important: false,
  corePlugins: {
    // Disable preflight to prevent CSS reset conflicts with WordPress
    preflight: false,
  }
}