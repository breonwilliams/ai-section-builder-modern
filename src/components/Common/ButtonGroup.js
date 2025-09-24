import React from 'react';
import AutocompleteInput from './AutocompleteInput';

function ButtonGroup({ buttons = [], onChange }) {
  const handleAddButton = () => {
    const newButton = {
      text: 'Button',
      url: '#',
      style: 'primary',
      target: '_self',
    };
    onChange([...buttons, newButton]);
  };

  const handleUpdateButton = (index, field, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index] = {
      ...updatedButtons[index],
      [field]: value,
    };
    onChange(updatedButtons);
  };

  const handleRemoveButton = (index) => {
    const updatedButtons = buttons.filter((_, i) => i !== index);
    onChange(updatedButtons);
  };

  const handleMoveButton = (index, direction) => {
    const updatedButtons = [...buttons];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < buttons.length) {
      [updatedButtons[index], updatedButtons[newIndex]] = 
      [updatedButtons[newIndex], updatedButtons[index]];
      onChange(updatedButtons);
    }
  };

  return (
    <div className="aisb-button-group">
      <div className="aisb-button-group__header">
        <label>Buttons</label>
        <button
          type="button"
          className="aisb-button-group__add"
          onClick={handleAddButton}
        >
          <span className="dashicons dashicons-plus-alt"></span>
          Add Button
        </button>
      </div>

      {buttons.length > 0 ? (
        <div className="aisb-button-group__items">
          {buttons.map((button, index) => (
            <div key={index} className="aisb-button-group__item">
              <div className="aisb-button-group__item-header">
                <span className="aisb-button-group__item-title">
                  Button {index + 1}
                </span>
                <div className="aisb-button-group__item-actions">
                  <button
                    type="button"
                    onClick={() => handleMoveButton(index, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    <span className="dashicons dashicons-arrow-up-alt2"></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveButton(index, 'down')}
                    disabled={index === buttons.length - 1}
                    title="Move Down"
                  >
                    <span className="dashicons dashicons-arrow-down-alt2"></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(index)}
                    className="aisb-button-group__remove"
                    title="Remove"
                  >
                    <span className="dashicons dashicons-trash"></span>
                  </button>
                </div>
              </div>

              <div className="aisb-button-group__item-content">
                <div className="aisb-form-group">
                  <label htmlFor={`button-text-${index}`}>Text</label>
                  <input
                    type="text"
                    id={`button-text-${index}`}
                    value={button.text || ''}
                    onChange={(e) => handleUpdateButton(index, 'text', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
                
                <div className="aisb-form-group">
                  <AutocompleteInput
                    id={`button-url-${index}`}
                    label="URL"
                    value={button.url || ''}
                    onChange={(value) => handleUpdateButton(index, 'url', value)}
                    placeholder="Search for page or enter URL..."
                  />
                </div>

                <div className="aisb-form-group">
                  <label htmlFor={`button-style-${index}`}>Style</label>
                  <select
                    id={`button-style-${index}`}
                    value={button.style || 'primary'}
                    onChange={(e) => handleUpdateButton(index, 'style', e.target.value)}
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>
                
                <div className="aisb-form-group">
                  <label htmlFor={`button-target-${index}`}>Target</label>
                  <select
                    id={`button-target-${index}`}
                    value={button.target || '_self'}
                    onChange={(e) => handleUpdateButton(index, 'target', e.target.value)}
                  >
                    <option value="_self">Same Window</option>
                    <option value="_blank">New Window</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="aisb-button-group__empty">
          <p>No buttons added yet</p>
        </div>
      )}
    </div>
  );
}

export default ButtonGroup;