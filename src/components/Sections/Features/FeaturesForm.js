import React from 'react';
import TabPanel from '../../Common/TabPanel';
import ButtonGroup from '../../Common/ButtonGroup';
import ToggleGroup from '../../Common/ToggleGroup';
import MediaSelector from '../../Common/MediaSelector';
import RepeaterField from '../../Common/RepeaterField';
import RichTextEditor from '../../Common/RichTextEditor';

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
      type: 'richtext',
      placeholder: 'Brief description of this feature',
      rows: 3,
      required: false,
      help: 'Use the rich text editor to format your card content',
    },
    {
      name: 'image',
      label: 'Card Image',
      type: 'media',
      buttonText: 'Select Card Image',
      required: false,
      help: 'Select from Media Library or enter URL',
    },
    {
      name: 'link',
      label: 'Card Link',
      type: 'url',
      useAutocomplete: true,
      placeholder: 'Search for page or enter URL...',
      required: false,
      help: 'Link to a page, post, or external URL',
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

  // Tab configuration
  const tabs = [
    {
      id: 'content',
      label: 'Content',
      icon: 'edit',
      content: (
        <>
          <div className="aisb-form-group">
            <label htmlFor="eyebrow_heading" className="aisb-form-label">
              Eyebrow Heading
            </label>
            <input
              type="text"
              id="eyebrow_heading"
              className="aisb-form-input"
              value={content.eyebrow_heading || ''}
              onChange={(e) => handleChange('eyebrow_heading', e.target.value)}
              placeholder="Small text above headline"
            />
          </div>

          <div className="aisb-form-group">
            <label htmlFor="heading" className="aisb-form-label">
              Heading <span className="required">*</span>
            </label>
            <input
              type="text"
              id="heading"
              className="aisb-form-input"
              value={content.heading || 'Our Features'}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="Main headline"
              required
            />
          </div>

          <RichTextEditor
            id="content"
            label="Body Content"
            value={content.content || ''}
            onChange={(value) => handleChange('content', value)}
            placeholder="Add your content here..."
            rows={4}
            help="Use the editor to format your content with headings, lists, and more."
          />

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

          <RichTextEditor
            id="outro_content"
            label="Outro Content"
            value={content.outro_content || ''}
            onChange={(value) => handleChange('outro_content', value)}
            placeholder="Optional content after cards..."
            rows={3}
            help="Additional content displayed after feature cards"
          />
        </>
      ),
    },
    {
      id: 'layout',
      label: 'Layout',
      icon: 'layout',
      content: (
        <>
          <ToggleGroup
            label="Layout Variant"
            value={content.layout_variant || 'content-left'}
            onChange={(value) => handleChange('layout_variant', value)}
            options={[
              { 
                value: 'content-left', 
                label: 'Left', 
                icon: 'align-left',
                tooltip: 'Content on the left, media on the right'
              },
              { 
                value: 'center', 
                label: 'Center', 
                icon: 'align-center',
                tooltip: 'Centered content and media'
              },
              { 
                value: 'content-right', 
                label: 'Right', 
                icon: 'align-right',
                tooltip: 'Content on the right, media on the left'
              },
            ]}
          />

          <ToggleGroup
            label="Card Alignment"
            value={content.card_alignment || 'left'}
            onChange={(value) => handleChange('card_alignment', value)}
            options={[
              { 
                value: 'left', 
                label: 'Left', 
                icon: 'editor-alignleft',
                tooltip: 'Left-aligned card content'
              },
              { 
                value: 'center', 
                label: 'Center', 
                icon: 'editor-aligncenter',
                tooltip: 'Center-aligned card content'
              },
            ]}
          />

          <MediaSelector
            mediaType={content.media_type || 'none'}
            onMediaTypeChange={(value) => handleChange('media_type', value)}
            imageUrl={content.featured_image}
            onImageChange={(value) => handleChange('featured_image', value)}
            videoUrl={content.video_url}
            onVideoChange={(value) => handleChange('video_url', value)}
          />
        </>
      ),
    },
    {
      id: 'style',
      label: 'Style',
      icon: 'admin-appearance',
      content: (
        <>
          <ToggleGroup
            label="Theme Variant"
            value={content.theme_variant || 'light'}
            onChange={(value) => handleChange('theme_variant', value)}
            options={[
              { 
                value: 'light', 
                label: 'Light', 
                icon: 'visibility',
                tooltip: 'Light background with dark text'
              },
              { 
                value: 'dark', 
                label: 'Dark', 
                icon: 'hidden',
                tooltip: 'Dark background with light text'
              },
            ]}
          />
        </>
      ),
    },
  ];

  return (
    <div className="aisb-form">
      <TabPanel tabs={tabs} defaultTab="content" />
    </div>
  );
}

export default FeaturesForm;