import React from 'react';
import DOMPurify from 'dompurify';

function TestimonialsPreview({ content }) {
  const {
    eyebrow_heading,
    heading,
    content: bodyContent,
    outro_content,
    theme_variant = 'light',
    layout_variant = 'content-left',
    grid_columns = '3',
    media_type = 'none',
    featured_image,
    video_url,
    buttons = [],
    testimonials = [],
  } = content;

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(bodyContent || '');
  const sanitizedOutro = DOMPurify.sanitize(outro_content || '');
  
  // Helper to check if content is actually empty (ignoring <br> tags and whitespace)
  const isContentEmpty = (html) => {
    if (!html) return true;
    const stripped = html.replace(/<br\s*\/?>/gi, '').trim();
    return stripped === '' || stripped === '<p></p>';
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Check if it's a Vimeo URL and extract ID
  const getVimeoId = (url) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const sectionClasses = [
    'aisb-section',
    'aisb-testimonials',
    `aisb-section--${theme_variant}`,
    `aisb-section--${layout_variant}`,
    `aisb-testimonials--${grid_columns}-columns`,
  ].join(' ');

  return (
    <section className={sectionClasses}>
      <div className="aisb-testimonials__container">
        {/* HEADER BLOCK - Identical structure to Features */}
        <div className="aisb-testimonials__top">
          <div className="aisb-testimonials__content">
            {eyebrow_heading && (
              <div className="aisb-testimonials__eyebrow">{eyebrow_heading}</div>
            )}
            
            <h2 className="aisb-testimonials__heading">
              {heading || 'What Our Clients Say'}
            </h2>
            
            {sanitizedContent && (
              <div
                className="aisb-testimonials__body"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}
          </div>

          {media_type !== 'none' && (
            <div className="aisb-testimonials__media">
              {media_type === 'image' && featured_image && (
                <img
                  src={featured_image}
                  alt={heading}
                  className="aisb-testimonials__image"
                />
              )}
              {media_type === 'video' && video_url && (() => {
                const youtubeId = getYouTubeId(video_url);
                const vimeoId = getVimeoId(video_url);
                
                if (youtubeId) {
                  return (
                    <iframe
                      className="aisb-testimonials__video"
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video"
                    />
                  );
                } else if (vimeoId) {
                  return (
                    <iframe
                      className="aisb-testimonials__video"
                      src={`https://player.vimeo.com/video/${vimeoId}`}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Video"
                    />
                  );
                } else if (video_url.match(/\.(mp4|webm|ogg)$/i) || video_url.includes('/wp-content/')) {
                  // Direct video file (from Media Library or external)
                  return (
                    <video 
                      className="aisb-testimonials__video" 
                      controls 
                      preload="metadata"
                    >
                      <source src={video_url} type="video/mp4" />
                      <source src={video_url} type="video/webm" />
                      <source src={video_url} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  return (
                    <div className="aisb-testimonials__video-placeholder">
                      <p>Invalid video URL. Please use YouTube, Vimeo, or select from Media Library.</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>

        {/* ITEMS BLOCK - Testimonials grid instead of cards */}
        {testimonials && testimonials.length > 0 && (
          <div className="aisb-testimonials__grid">
            {testimonials.map((testimonial, index) => {
              // Sanitize the testimonial content HTML
              const sanitizedTestimonial = testimonial.content 
                ? DOMPurify.sanitize(testimonial.content, {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
                    ALLOWED_ATTR: ['href', 'target', 'rel']
                  })
                : '';
              
              // Get rating (default to 5 if not provided)
              const rating = testimonial.rating || 5;
              
              // Render stars function
              const renderStars = () => {
                const stars = [];
                for (let i = 1; i <= 5; i++) {
                  if (i <= Math.floor(rating)) {
                    // Full star
                    stars.push(<span key={i} className="aisb-testimonials__star aisb-testimonials__star--filled">★</span>);
                  } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                    // Half star
                    stars.push(<span key={i} className="aisb-testimonials__star aisb-testimonials__star--half">★</span>);
                  } else {
                    // Empty star
                    stars.push(<span key={i} className="aisb-testimonials__star">☆</span>);
                  }
                }
                return stars;
              };
              
              // Check if avatar exists for conditional layout
              const hasAvatar = testimonial.avatar && testimonial.avatar.trim() !== '';
              const authorSectionClass = `aisb-testimonials__author-section${hasAvatar ? ' aisb-testimonials__author-section--with-avatar' : ''}`;
                
              return (
                <div key={index} className="aisb-testimonials__item">
                  <div className="aisb-testimonials__item-content">
                    {/* Star rating */}
                    <div className="aisb-testimonials__rating">
                      {renderStars()}
                    </div>
                    
                    {/* Testimonial quote */}
                    {sanitizedTestimonial && (
                      <div 
                        className="aisb-testimonials__quote"
                        dangerouslySetInnerHTML={{ __html: sanitizedTestimonial }}
                      />
                    )}
                    
                    {/* Author section with conditional layout */}
                    <div className={authorSectionClass}>
                      {hasAvatar && (
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author || ''} 
                          className="aisb-testimonials__avatar"
                        />
                      )}
                      
                      <div className="aisb-testimonials__author-info">
                        {testimonial.author && (
                          <div className="aisb-testimonials__author">{testimonial.author}</div>
                        )}
                        
                        {testimonial.role && (
                          <div className="aisb-testimonials__role">{testimonial.role}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER BLOCK - Identical to Features */}
        {sanitizedOutro && !isContentEmpty(sanitizedOutro) && (
          <div
            className="aisb-testimonials__outro"
            dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
          />
        )}

        {/* Buttons - positioned after outro */}
        {buttons && buttons.length > 0 && (
          <div className="aisb-testimonials__buttons">
            {buttons.map((button, index) => (
              <a
                key={index}
                href={button.url || '#'}
                className={`aisb-btn aisb-btn-${button.style || 'primary'}`}
                target={button.target || '_self'}
                rel={button.target === '_blank' ? 'noopener noreferrer' : ''}
              >
                {button.text || 'Button'}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsPreview;