import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = ({ label, value, onChange, description }) => {
  const [localValue, setLocalValue] = useState(value || '#000000');
  const colorInputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '#000000');
  }, [value]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const openColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className="aisb-color-picker">
      {label && (
        <label className="aisb-color-picker__label">{label}</label>
      )}
      
      <div className="aisb-color-picker__control">
        <div className="aisb-color-picker__field" onClick={openColorPicker}>
          <span 
            className="aisb-color-picker__swatch"
            style={{ backgroundColor: localValue }}
          />
          <input
            type="text"
            value={localValue}
            onChange={handleTextChange}
            onClick={(e) => e.stopPropagation()}
            className="aisb-color-picker__hex-input"
            placeholder="#000000"
            maxLength="7"
          />
          <input
            ref={colorInputRef}
            type="color"
            value={localValue}
            onChange={handleColorChange}
            className="aisb-color-picker__native-input"
            tabIndex="-1"
          />
        </div>
      </div>

      {description && (
        <p className="aisb-color-picker__description">{description}</p>
      )}
    </div>
  );
};

export default ColorPicker;