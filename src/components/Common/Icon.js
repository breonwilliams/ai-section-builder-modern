/**
 * Icon Component
 * Uses WordPress Dashicons for consistency with WordPress admin
 * Reference: https://developer.wordpress.org/resource/dashicons/
 */
import React from 'react';

// Map semantic icon names to Dashicon classes
const iconMap = {
  // Section types
  'hero': 'dashicons-welcome-widgets-menus',
  'features': 'dashicons-screenoptions',
  'faq': 'dashicons-editor-help',
  'stats': 'dashicons-chart-bar',
  'testimonials': 'dashicons-format-quote',
  'checklist': 'dashicons-editor-ul',
  'hero-form': 'dashicons-feedback',
  
  // Actions
  'add': 'dashicons-plus-alt2',
  'delete': 'dashicons-trash',
  'edit': 'dashicons-edit',
  'save': 'dashicons-saved',
  'back': 'dashicons-arrow-left-alt2',
  'settings': 'dashicons-admin-generic',
  'close': 'dashicons-no-alt',
  'drag': 'dashicons-move',
  'duplicate': 'dashicons-admin-page',
  'visibility': 'dashicons-visibility',
  'hidden': 'dashicons-hidden',
  
  // Media
  'image': 'dashicons-format-image',
  'video': 'dashicons-format-video',
  'upload': 'dashicons-upload',
  
  // Layout
  'align-left': 'dashicons-align-left',
  'align-center': 'dashicons-align-center',
  'align-right': 'dashicons-align-right',
  
  // UI
  'chevron-up': 'dashicons-arrow-up-alt2',
  'chevron-down': 'dashicons-arrow-down-alt2',
  'chevron-left': 'dashicons-arrow-left-alt2',
  'chevron-right': 'dashicons-arrow-right-alt2',
  'info': 'dashicons-info-outline',
  'warning': 'dashicons-warning',
  'success': 'dashicons-yes-alt',
  'error': 'dashicons-dismiss',
};

function Icon({ name, className = '', size = 'normal', ...props }) {
  const dashiconClass = iconMap[name] || 'dashicons-marker';
  
  // Size classes
  const sizeClass = size === 'small' ? 'aisb-icon--small' : 
                     size === 'large' ? 'aisb-icon--large' : '';
  
  return (
    <span 
      className={`dashicons ${dashiconClass} aisb-icon ${sizeClass} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Icon;