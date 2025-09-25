import React, { useState, useEffect } from 'react';
import { useEditorStore, DEFAULT_GLOBAL_SETTINGS } from '../../stores/editorStore';
import ColorPicker from '../UI/ColorPicker';
import Icon from '../Common/Icon';

const GlobalSettings = ({ onClose }) => {
  const { globalSettings, updateGlobalSettings, saveGlobalSettings, resetGlobalSettings } = useEditorStore();
  const [localSettings, setLocalSettings] = useState(globalSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(globalSettings);
  }, [globalSettings]);

  const handleColorChange = (key, value) => {
    const newSettings = {
      ...localSettings,
      [key]: value
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
    
    // Update live preview immediately
    updateGlobalSettings(newSettings);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveGlobalSettings(localSettings);
      setHasChanges(false);
      // Show success message (could add toast notification here)
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_GLOBAL_SETTINGS);
    resetGlobalSettings();
    setHasChanges(true);
  };

  return (
    <div className="aisb-global-settings">
      <div className="aisb-global-settings__header">
        <h2 className="aisb-global-settings__title">Global Settings</h2>
        <button
          className="aisb-global-settings__close"
          onClick={onClose}
          aria-label="Close settings"
        >
          <Icon name="close" size="medium" />
        </button>
      </div>

      <div className="aisb-global-settings__content">
        <div className="aisb-global-settings__section">
          <h3 className="aisb-global-settings__section-title">Brand Colors</h3>
          <p className="aisb-global-settings__description">
            These colors will be used throughout all your sections
          </p>

          <div className="aisb-global-settings__field">
            <ColorPicker
              label="Primary Color"
              value={localSettings.primary_color}
              onChange={(value) => handleColorChange('primary_color', value)}
              description="Used for primary buttons and key interactive elements"
            />
          </div>

          <div className="aisb-global-settings__field">
            <ColorPicker
              label="Secondary Color"
              value={localSettings.secondary_color}
              onChange={(value) => handleColorChange('secondary_color', value)}
              description="Used for secondary buttons and complementary elements"
            />
          </div>
        </div>
      </div>

      <div className="aisb-global-settings__footer">
        <button
          className="aisb-button aisb-button--ghost"
          onClick={handleReset}
          title="Reset to default colors"
        >
          Reset to Defaults
        </button>
        <button
          className="aisb-button aisb-button--primary"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default GlobalSettings;