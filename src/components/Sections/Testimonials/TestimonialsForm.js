import React from 'react';
import TabPanel from '../../Common/TabPanel';
import ButtonGroup from '../../Common/ButtonGroup';
import ToggleGroup from '../../Common/ToggleGroup';
import MediaSelector from '../../Common/MediaSelector';
import RepeaterField from '../../Common/RepeaterField';
import RichTextEditor from '../../Common/RichTextEditor';

function TestimonialsForm({ content, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // Define fields for testimonial items - ITEMS BLOCK specific to testimonials
  const testimonialFields = [
    {
      name: 'rating',
      label: 'Star Rating',
      type: 'rating',
      defaultValue: 5,
      required: false,
      help: 'Click left half for half star, right half for full star',
    },
    {
      name: 'content',
      label: 'Testimonial Quote',
      type: 'richtext',
      placeholder: 'Enter the testimonial or quote...',
      rows: 4,
      required: true,
      help: 'The main testimonial text or customer quote',
    },
    {
      name: 'author',
      label: 'Author Name',
      type: 'text',
      placeholder: 'John Doe',
      required: true,
      help: 'The person who gave this testimonial',
    },
    {
      name: 'role',
      label: 'Author Role/Title',
      type: 'text',
      placeholder: 'CEO, Company Name',
      required: false,
      help: 'Job title and company or additional context',
    },
    {
      name: 'avatar',
      label: 'Author Avatar',
      type: 'media',
      buttonText: 'Select Avatar Image',
      required: false,
      help: 'Optional profile photo (displays as circular image to left of name)',
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
              value={content.heading || 'What Our Clients Say'}
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

          {/* ITEMS BLOCK - Testimonials specific */}
          <div className="aisb-form-group">
            <RepeaterField
              items={content.testimonials || []}
              onChange={(testimonials) => handleChange('testimonials', testimonials)}
              fields={testimonialFields}
              itemLabel="Testimonial"
            />
          </div>

          {/* FOOTER BLOCK - Identical to Features */}
          <RichTextEditor
            id="outro_content"
            label="Outro Content"
            value={content.outro_content || ''}
            onChange={(value) => handleChange('outro_content', value)}
            placeholder="Optional content after testimonials..."
            rows={3}
            help="Additional content displayed after testimonials"
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
            label="Testimonials Per Row"
            value={content.grid_columns || '3'}
            onChange={(value) => handleChange('grid_columns', value)}
            options={[
              { 
                value: '2', 
                label: '2',
                tooltip: 'Two testimonials per row'
              },
              { 
                value: '3', 
                label: '3',
                tooltip: 'Three testimonials per row (default)'
              },
              { 
                value: '4', 
                label: '4',
                tooltip: 'Four testimonials per row'
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

export default TestimonialsForm;