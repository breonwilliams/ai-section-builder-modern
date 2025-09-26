import React from 'react';
import TabPanel from '../../Common/TabPanel';
import ButtonGroup from '../../Common/ButtonGroup';
import ToggleGroup from '../../Common/ToggleGroup';
import MediaSelector from '../../Common/MediaSelector';
import RepeaterField from '../../Common/RepeaterField';
import RichTextEditor from '../../Common/RichTextEditor';

function StatsForm({ content, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // Define fields for stat items - ITEMS BLOCK specific to stats
  const statFields = [
    {
      name: 'value',
      label: 'Stat Value',
      type: 'text',
      placeholder: 'e.g., 99%, 500+, $1.2M',
      required: true,
      help: 'The number or value to display',
    },
    {
      name: 'label',
      label: 'Stat Label',
      type: 'text',
      placeholder: 'e.g., Customer Satisfaction',
      required: true,
      help: 'Description of what this statistic represents',
    },
    {
      name: 'description',
      label: 'Additional Description',
      type: 'textarea',
      placeholder: 'Optional additional context',
      rows: 2,
      required: false,
      help: 'Optional text to provide more context',
    },
  ];

  // Tab configuration - Same structure as Features
  const tabs = [
    {
      id: 'content',
      label: 'Content',
      icon: 'edit',
      content: (
        <>
          {/* HEADER BLOCK - Identical to Features */}
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
              value={content.heading || 'By the Numbers'}
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

          {/* ITEMS BLOCK - Stats specific */}
          <div className="aisb-form-group">
            <RepeaterField
              items={content.stats || []}
              onChange={(stats) => handleChange('stats', stats)}
              fields={statFields}
              itemLabel="Statistic"
            />
          </div>

          {/* FOOTER BLOCK - Identical to Features */}
          <RichTextEditor
            id="outro_content"
            label="Outro Content"
            value={content.outro_content || ''}
            onChange={(value) => handleChange('outro_content', value)}
            placeholder="Optional content after statistics..."
            rows={3}
            help="Additional content displayed after the statistics"
          />

          <div className="aisb-form-group">
            <ButtonGroup
              buttons={content.buttons || []}
              onChange={(buttons) => handleChange('buttons', buttons)}
            />
          </div>
        </>
      ),
    },
    {
      id: 'layout',
      label: 'Layout',
      icon: 'layout',
      content: (
        <>
          {/* Layout settings - Identical structure to Features */}
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
            label="Stats Per Row"
            value={content.grid_columns || '3'}
            onChange={(value) => handleChange('grid_columns', value)}
            options={[
              { 
                value: '2', 
                label: '2',
                tooltip: 'Two stats per row'
              },
              { 
                value: '3', 
                label: '3',
                tooltip: 'Three stats per row (default)'
              },
              { 
                value: '4', 
                label: '4',
                tooltip: 'Four stats per row'
              },
            ]}
          />

          <ToggleGroup
            label="Stat Alignment"
            value={content.stat_alignment || 'center'}
            onChange={(value) => handleChange('stat_alignment', value)}
            options={[
              { 
                value: 'left', 
                label: 'Left', 
                icon: 'editor-alignleft',
                tooltip: 'Left-aligned statistics'
              },
              { 
                value: 'center', 
                label: 'Center', 
                icon: 'editor-aligncenter',
                tooltip: 'Center-aligned statistics'
              },
              { 
                value: 'right', 
                label: 'Right', 
                icon: 'editor-alignright',
                tooltip: 'Right-aligned statistics'
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
          {/* Style settings - Identical to Features */}
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

export default StatsForm;