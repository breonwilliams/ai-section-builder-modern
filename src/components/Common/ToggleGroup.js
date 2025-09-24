import React from 'react';

function ToggleGroup({ 
  options, 
  value, 
  onChange, 
  label,
  fullWidth = true,
  columns = null 
}) {
  return (
    <div className="aisb-form-group">
      {label && (
        <label className="aisb-form-label">{label}</label>
      )}
      <div 
        className={`aisb-toggle-group ${columns ? `aisb-toggle-group--${columns}-col` : ''} ${fullWidth ? 'aisb-toggle-group--full' : ''}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`aisb-toggle-btn ${value === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            title={option.tooltip || option.label}
          >
            {option.icon && (
              <span className={`dashicons dashicons-${option.icon}`}></span>
            )}
            {option.label && (
              <span className="aisb-toggle-btn__label">{option.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ToggleGroup;