import React from 'react';
import DOMPurify from 'dompurify';

function FeaturesPreview({ content }) {
  const {
    eyebrow_heading,
    heading,
    content: bodyContent,
    outro_content,
    theme_variant = 'light',
    layout_variant = 'content-left',
    grid_columns = '3',
    card_alignment = 'left',
    media_type = 'none',
    featured_image,
    video_url,
    buttons = [],
    cards = [],
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
    'aisb-features',
    `aisb-section--${theme_variant}`,
    `aisb-section--${layout_variant}`,
    `aisb-features--${grid_columns}-columns`,
    `aisb-features--cards-${card_alignment}`,
  ].join(' ');

  return (
    <section className={sectionClasses}>
      <div className="aisb-features__container">
        {/* Top section with content and optional media */}
        <div className="aisb-features__top">
          <div className="aisb-features__content">
            {eyebrow_heading && (
              <div className="aisb-features__eyebrow">{eyebrow_heading}</div>
            )}
            
            <h2 className="aisb-features__heading">
              {heading || 'Our Features'}
            </h2>
            
            {sanitizedContent && (
              <div
                className="aisb-features__body"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}
          </div>

          {media_type !== 'none' && (
            <div className="aisb-features__media">
              {media_type === 'image' && featured_image && (
                <img
                  src={featured_image}
                  alt={heading}
                  className="aisb-features__image"
                />
              )}
              {media_type === 'video' && video_url && (() => {
                const youtubeId = getYouTubeId(video_url);
                const vimeoId = getVimeoId(video_url);
                
                if (youtubeId) {
                  return (
                    <iframe
                      className="aisb-features__video"
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
                      className="aisb-features__video"
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
                      className="aisb-features__video" 
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
                    <div className="aisb-features__video-placeholder">
                      <p>Invalid video URL. Please use YouTube, Vimeo, or select from Media Library.</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>

        {/* Feature cards grid */}
        {cards && cards.length > 0 && (
          <div className="aisb-features__grid">
            {cards.map((card, index) => {
              const sanitizedCardContent = DOMPurify.sanitize(card.content || '');
              return (
                <div key={index} className="aisb-features__item">
                  {card.image && (
                    <div className="aisb-features__item-image-wrapper">
                      <img
                        src={card.image}
                        alt={card.heading || ''}
                        className="aisb-features__item-image"
                      />
                    </div>
                  )}
                  
                  <div className="aisb-features__item-content">
                    {card.heading && (
                      <h3 className="aisb-features__item-title">{card.heading}</h3>
                    )}
                    
                    {sanitizedCardContent && (
                      <div 
                        className="aisb-features__item-description"
                        dangerouslySetInnerHTML={{ __html: sanitizedCardContent }}
                      />
                    )}
                    
                    {card.link && card.link_text && (
                      <a
                        href={card.link}
                        className="aisb-features__item-link"
                        target={card.link_target || '_self'}
                        rel={card.link_target === '_blank' ? 'noopener noreferrer' : ''}
                      >
                        {card.link_text}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sanitizedOutro && !isContentEmpty(sanitizedOutro) && (
          <div
            className="aisb-features__outro"
            dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
          />
        )}

        {/* Buttons - positioned after outro */}
        {buttons && buttons.length > 0 && (
          <div className="aisb-features__buttons">
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

export default FeaturesPreview;