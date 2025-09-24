import React from 'react';
import RichTextEditor from './RichTextEditor';
import AutocompleteInput from './AutocompleteInput';
import MediaLibraryButton from './MediaLibraryButton';

function RepeaterField({ items = [], onChange, fields, itemLabel = 'Item' }) {
  const handleAddItem = () => {
    const newItem = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {});
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    onChange(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  const handleMoveItem = (index, direction) => {
    const updatedItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < items.length) {
      [updatedItems[index], updatedItems[newIndex]] = 
      [updatedItems[newIndex], updatedItems[index]];
      onChange(updatedItems);
    }
  };

  const renderField = (field, item, index) => {
    const value = item[field.name] || '';
    const fieldId = `${field.name}-${index}`;

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="aisb-form-group">
            <label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id={fieldId}
              value={value}
              onChange={(e) => handleUpdateItem(index, field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.help && <small>{field.help}</small>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="aisb-form-group">
            <label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleUpdateItem(index, field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              required={field.required}
            />
            {field.help && <small>{field.help}</small>}
          </div>
        );

      case 'richtext':
        return (
          <div key={field.name} className="aisb-form-group">
            <RichTextEditor
              id={fieldId}
              label={field.label}
              value={value}
              onChange={(newValue) => handleUpdateItem(index, field.name, newValue)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              help={field.help}
            />
          </div>
        );


      case 'url':
        // Check if this is a link field that needs autocomplete
        if (field.useAutocomplete) {
          return (
            <div key={field.name} className="aisb-form-group">
              <AutocompleteInput
                id={fieldId}
                label={field.label}
                value={value}
                onChange={(newValue) => handleUpdateItem(index, field.name, newValue)}
                placeholder={field.placeholder || 'Search for page or enter URL...'}
              />
              {field.help && <small>{field.help}</small>}
            </div>
          );
        }
        
        return (
          <div key={field.name} className="aisb-form-group">
            <label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="url"
              id={fieldId}
              value={value}
              onChange={(e) => handleUpdateItem(index, field.name, e.target.value)}
              placeholder={field.placeholder || 'https://...'}
              required={field.required}
            />
            {field.help && <small>{field.help}</small>}
          </div>
        );
      
      case 'media':
        return (
          <div key={field.name} className="aisb-form-group">
            <label className="aisb-form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            
            {!value ? (
              <MediaLibraryButton
                type="image"
                onSelect={(media) => handleUpdateItem(index, field.name, media.url)}
                className="aisb-media-selector__upload-button"
                buttonText={field.buttonText || 'Select from Media Library'}
                buttonIcon="format-image"
              />
            ) : (
              <div className="aisb-media-preview">
                <img src={value} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                <div className="aisb-media-preview__actions">
                  <MediaLibraryButton
                    type="image"
                    onSelect={(media) => handleUpdateItem(index, field.name, media.url)}
                    render={({ onClick }) => (
                      <button 
                        type="button"
                        className="aisb-media-preview__change"
                        onClick={onClick}
                        title="Change Image"
                      >
                        <span className="dashicons dashicons-edit"></span>
                      </button>
                    )}
                  />
                  <button 
                    type="button" 
                    className="aisb-media-preview__remove"
                    onClick={() => handleUpdateItem(index, field.name, '')}
                    title="Remove Image"
                  >
                    <span className="dashicons dashicons-no-alt"></span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="aisb-media-selector__or-divider">
              <span>OR</span>
            </div>
            
            <input
              type="text"
              className="aisb-form-input"
              value={value || ''}
              onChange={(e) => handleUpdateItem(index, field.name, e.target.value)}
              placeholder="Enter image URL directly"
            />
            {field.help && <small>{field.help}</small>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="aisb-form-group">
            <label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={fieldId}
              value={value}
              onChange={(e) => handleUpdateItem(index, field.name, e.target.value)}
              required={field.required}
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.help && <small>{field.help}</small>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="aisb-repeater-field">
      <div className="aisb-repeater-field__header">
        <label>{itemLabel}s</label>
        <button
          type="button"
          className="aisb-repeater-field__add"
          onClick={handleAddItem}
        >
          <span className="dashicons dashicons-plus-alt"></span>
          Add {itemLabel}
        </button>
      </div>

      {items.length > 0 ? (
        <div className="aisb-repeater-field__items">
          {items.map((item, index) => (
            <div key={index} className="aisb-repeater-field__item">
              <div className="aisb-repeater-field__item-header">
                <span className="aisb-repeater-field__item-title">
                  {itemLabel} {index + 1}
                </span>
                <div className="aisb-repeater-field__item-actions">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    <span className="dashicons dashicons-arrow-up-alt2"></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move Down"
                  >
                    <span className="dashicons dashicons-arrow-down-alt2"></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="aisb-repeater-field__remove"
                    title="Remove"
                  >
                    <span className="dashicons dashicons-trash"></span>
                  </button>
                </div>
              </div>

              <div className="aisb-repeater-field__item-content">
                {fields.map(field => renderField(field, item, index))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="aisb-repeater-field__empty">
          <p>No {itemLabel.toLowerCase()}s added yet</p>
        </div>
      )}
    </div>
  );
}

export default RepeaterField;