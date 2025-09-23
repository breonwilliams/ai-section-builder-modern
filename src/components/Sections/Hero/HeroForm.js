import React from 'react';
import ButtonGroup from '../../Common/ButtonGroup';

function HeroForm({ content, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="aisb-form">
      <div className="aisb-form-group">
        <label htmlFor="eyebrow_heading">Eyebrow Heading</label>
        <input
          type="text"
          id="eyebrow_heading"
          value={content.eyebrow_heading || ''}
          onChange={(e) => handleChange('eyebrow_heading', e.target.value)}
          placeholder="Small text above headline"
        />
      </div>

      <div className="aisb-form-group">
        <label htmlFor="heading">
          Heading <span className="required">*</span>
        </label>
        <input
          type="text"
          id="heading"
          value={content.heading || ''}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder="Main headline"
          required
        />
      </div>

      <div className="aisb-form-group">
        <label htmlFor="content">Body Content</label>
        <textarea
          id="content"
          value={content.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Add your content here..."
          rows={6}
        />
        <small>HTML is supported. Content will be sanitized for security.</small>
      </div>

      <div className="aisb-form-group">
        <label htmlFor="outro_content">Outro Content</label>
        <textarea
          id="outro_content"
          value={content.outro_content || ''}
          onChange={(e) => handleChange('outro_content', e.target.value)}
          placeholder="Optional content after buttons..."
          rows={3}
        />
        <small>Additional content displayed after buttons</small>
      </div>

      <div className="aisb-form-group">
        <label htmlFor="theme_variant">Theme Variant</label>
        <select
          id="theme_variant"
          value={content.theme_variant || 'light'}
          onChange={(e) => handleChange('theme_variant', e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="aisb-form-group">
        <label htmlFor="layout_variant">Layout Variant</label>
        <select
          id="layout_variant"
          value={content.layout_variant || 'content-left'}
          onChange={(e) => handleChange('layout_variant', e.target.value)}
        >
          <option value="content-left">Content Left</option>
          <option value="content-right">Content Right</option>
          <option value="center">Center</option>
        </select>
      </div>

      <div className="aisb-form-group">
        <label htmlFor="media_type">Media Type</label>
        <select
          id="media_type"
          value={content.media_type || 'none'}
          onChange={(e) => handleChange('media_type', e.target.value)}
        >
          <option value="none">None</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      {content.media_type === 'image' && (
        <div className="aisb-form-group">
          <label htmlFor="featured_image">Featured Image URL</label>
          <input
            type="text"
            id="featured_image"
            value={content.featured_image || ''}
            onChange={(e) => handleChange('featured_image', e.target.value)}
            placeholder="Image URL or media library ID"
          />
        </div>
      )}

      {content.media_type === 'video' && (
        <div className="aisb-form-group">
          <label htmlFor="video_url">Video URL</label>
          <input
            type="text"
            id="video_url"
            value={content.video_url || ''}
            onChange={(e) => handleChange('video_url', e.target.value)}
            placeholder="YouTube or Vimeo URL"
          />
        </div>
      )}

      <div className="aisb-form-group">
        <ButtonGroup
          buttons={content.buttons || []}
          onChange={(buttons) => handleChange('buttons', buttons)}
        />
      </div>
    </div>
  );
}

export default HeroForm;