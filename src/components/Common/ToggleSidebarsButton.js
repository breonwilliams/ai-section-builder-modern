/**
 * Toggle Sidebars Button Component
 * Allows users to hide/show sidebars for full-width canvas experience
 * Includes keyboard shortcut (Shift+S)
 */
import React, { useEffect } from 'react';
import Icon from './Icon';
import { useEditor } from '../Providers/EditorProvider';

function ToggleSidebarsButton() {
  const { sidebarsVisible, toggleSidebars } = useEditor();

  // Check if user is typing in an input field
  const isInputFocused = () => {
    const activeElement = document.activeElement;
    const tagName = activeElement.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      activeElement.contentEditable === 'true'
    );
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger when Shift+S is pressed and user is not typing
      if (e.shiftKey && e.key === 'S' && !isInputFocused()) {
        e.preventDefault();
        toggleSidebars();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [toggleSidebars]);

  return (
    <button
      className="aisb-button aisb-button--ghost"
      onClick={toggleSidebars}
      aria-pressed={!sidebarsVisible}
      aria-label={sidebarsVisible ? 'Hide sidebars' : 'Show sidebars'}
      title="Toggle Sidebars (Shift+S)"
    >
      <Icon 
        name={sidebarsVisible ? 'visibility' : 'hidden'} 
        size="small" 
      />
      <span className="aisb-button__text">
        {sidebarsVisible ? 'Hide Panels' : 'Show Panels'}
      </span>
    </button>
  );
}

export default ToggleSidebarsButton;