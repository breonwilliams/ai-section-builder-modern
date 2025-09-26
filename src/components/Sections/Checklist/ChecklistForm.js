import React from 'react';
import TabPanel from '../../Common/TabPanel';
import ButtonGroup from '../../Common/ButtonGroup';
import ToggleGroup from '../../Common/ToggleGroup';
import MediaSelector from '../../Common/MediaSelector';
import RichTextEditor from '../../Common/RichTextEditor';
import RepeaterField from '../../Common/RepeaterField';

function ChecklistForm({ content, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const checklistItemFields = [
    {
      name: 'heading',
      label: 'Item Heading',
      type: 'text',
      placeholder: 'Feature name...',
      required: true,
    },
    {
      name: 'content',
      label: 'Item Description',
      type: 'text',
      placeholder: 'Brief description (optional)...',
      required: false,
      help: 'Optional description for this checklist item',
    },
  ];

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
              value={content.heading || ''}
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
            help="Content displayed before checklist items"
          />

          <div className="aisb-form-group">
            <RepeaterField
              items={content.items || []}
              onChange={(items) => handleChange('items', items)}
              fields={checklistItemFields}
              itemLabel="Item"
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
            placeholder="Optional content after buttons..."
            rows={3}
            help="Additional content displayed after buttons"
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

export default ChecklistForm;