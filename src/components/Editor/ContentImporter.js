import React, { useState } from 'react';
import { useEditor } from '../Providers/EditorProvider';
import axios from 'axios';

function ContentImporter({ onClose }) {
  const { sections, setSections } = useEditor();
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  
  const handleProcess = async () => {
    if (!content.trim()) {
      setError('Please enter some content to process');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${window.aisbEditor.apiUrl}process-content`,
        { content },
        {
          headers: {
            'X-WP-Nonce': window.aisbEditor.nonce,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        setPreview(response.data.sections);
      } else {
        setError(response.data.message || 'Failed to process content');
      }
    } catch (err) {
      console.error('Process error:', err);
      setError('An error occurred while processing the content');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleApply = () => {
    if (preview && preview.length > 0) {
      // Add processed sections to existing sections
      setSections([...sections, ...preview]);
      onClose();
    }
  };
  
  const handleReplace = () => {
    if (preview && preview.length > 0) {
      // Replace all sections with processed sections
      setSections(preview);
      onClose();
    }
  };
  
  return (
    <div className="aisb-content-importer">
      <div className="aisb-content-importer__header">
        <h3>Import Content</h3>
        <button
          type="button"
          className="aisb-content-importer__close"
          onClick={onClose}
        >
          <span className="dashicons dashicons-no"></span>
        </button>
      </div>
      
      <div className="aisb-content-importer__body">
        {!preview ? (
          <>
            <div className="aisb-form-group">
              <label htmlFor="import-content">
                Paste your document content below
              </label>
              <textarea
                id="import-content"
                className="aisb-form-textarea"
                rows="15"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here...

Example:
Welcome to ABC Company
Your trusted partner in business solutions

About Our Services
We offer comprehensive business consulting services including:
• Strategic Planning - Develop long-term growth strategies
• Process Optimization - Streamline your operations
• Digital Transformation - Modernize your technology

Why Choose Us
✓ 20+ years of experience
✓ 500+ satisfied clients
✓ Industry-leading expertise"
              />
              <small className="aisb-form-help">
                The AI will analyze your content and extract appropriate sections.
                Works best with structured business content.
              </small>
            </div>
            
            {error && (
              <div className="aisb-alert aisb-alert-error">
                {error}
              </div>
            )}
            
            <div className="aisb-content-importer__actions">
              <button
                type="button"
                className="aisb-btn aisb-btn-primary"
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="dashicons dashicons-update spin"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="dashicons dashicons-admin-generic"></span>
                    Process Content
                  </>
                )}
              </button>
              <button
                type="button"
                className="aisb-btn aisb-btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="aisb-content-importer__preview">
              <h4>Preview Extracted Sections</h4>
              <div className="aisb-content-importer__sections">
                {preview.map((section, index) => (
                  <div key={index} className="aisb-content-importer__section">
                    <div className="aisb-content-importer__section-type">
                      {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                    </div>
                    <div className="aisb-content-importer__section-content">
                      <strong>{section.content.heading}</strong>
                      {section.type === 'features' && section.content.cards && (
                        <ul>
                          {section.content.cards.map((card, i) => (
                            <li key={i}>{card.heading}</li>
                          ))}
                        </ul>
                      )}
                      {section.type === 'stats' && section.content.stats && (
                        <ul>
                          {section.content.stats.map((stat, i) => (
                            <li key={i}>{stat.value} - {stat.label}</li>
                          ))}
                        </ul>
                      )}
                      {section.type === 'testimonials' && section.content.testimonials && (
                        <ul>
                          {section.content.testimonials.map((testimonial, i) => (
                            <li key={i}>{testimonial.author} - {testimonial.role}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="aisb-content-importer__preview-info">
                <p>
                  <strong>{preview.length}</strong> sections extracted.
                  Visual rhythm applied (alternating themes).
                </p>
              </div>
            </div>
            
            <div className="aisb-content-importer__actions">
              <button
                type="button"
                className="aisb-btn aisb-btn-primary"
                onClick={handleApply}
              >
                Add to Page
              </button>
              <button
                type="button"
                className="aisb-btn aisb-btn-secondary"
                onClick={handleReplace}
              >
                Replace All
              </button>
              <button
                type="button"
                className="aisb-btn aisb-btn-ghost"
                onClick={() => setPreview(null)}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentImporter;