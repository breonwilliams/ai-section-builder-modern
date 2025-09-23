import React from 'react';
import ButtonGroup from '../../Common/ButtonGroup';
import RepeaterField from '../../Common/RepeaterField';

function FeaturesForm({ content, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // Define fields for feature cards
  const cardFields = [
    {
      name: 'heading',
      label: 'Card Heading',
      type: 'text',
      placeholder: 'Feature title',
      required: true,
    },
    {
      name: 'content',
      label: 'Card Description',
      type: 'textarea',
      placeholder: 'Brief description of this feature',
      rows: 3,
      required: false,
    },
    {
      name: 'image',
      label: 'Card Image URL',
      type: 'url',
      placeholder: 'https://... or media library URL',
      required: false,
      help: 'Optional image for this feature card',
    },
    {
      name: 'link',
      label: 'Card Link URL',
      type: 'url',
      placeholder: 'https://...',
      required: false,
    },
    {
      name: 'link_text',
      label: 'Link Text',
      type: 'text',
      placeholder: 'Learn More',
      defaultValue: 'Learn More',
      required: false,
    },
    {
      name: 'link_target',
      label: 'Link Target',
      type: 'select',
      options: [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' },
      ],
      defaultValue: '_self',
      required: false,
    },
  ];

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
          value={content.heading || 'Our Features'}
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
          rows={4}
        />
        <small>HTML is supported. Content will be sanitized for security.</small>
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
        <label htmlFor="card_alignment">Card Alignment</label>
        <select
          id="card_alignment"
          value={content.card_alignment || 'left'}
          onChange={(e) => handleChange('card_alignment', e.target.value)}
        >
          <option value="left">Left</option>
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
        <RepeaterField
          items={content.cards || []}
          onChange={(cards) => handleChange('cards', cards)}
          fields={cardFields}
          itemLabel="Feature Card"
        />
      </div>

      <div className="aisb-form-group">
        <ButtonGroup
          buttons={content.buttons || []}
          onChange={(buttons) => handleChange('buttons', buttons)}
        />
      </div>

      <div className="aisb-form-group">
        <label htmlFor="outro_content">Outro Content</label>
        <textarea
          id="outro_content"
          value={content.outro_content || ''}
          onChange={(e) => handleChange('outro_content', e.target.value)}
          placeholder="Optional content after cards..."
          rows={3}
        />
        <small>Additional content displayed after feature cards</small>
      </div>
    </div>
  );
}

export default FeaturesForm;