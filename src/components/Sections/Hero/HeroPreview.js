import React from 'react';
import DOMPurify from 'dompurify';

function HeroPreview({ content }) {
  const {
    eyebrow_heading,
    heading,
    content: bodyContent,
    outro_content,
    theme_variant = 'light',
    layout_variant = 'content-left',
    media_type = 'none',
    featured_image,
    video_url,
    buttons = [],
  } = content;

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(bodyContent || '');
  const sanitizedOutro = DOMPurify.sanitize(outro_content || '');

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
    'aisb-hero',
    `aisb-section--${theme_variant}`,
    `aisb-section--${layout_variant}`,
  ].join(' ');

  return (
    <section className={sectionClasses}>
      <div className="aisb-hero__container">
        <div className="aisb-hero__content">
          {eyebrow_heading && (
            <div className="aisb-hero__eyebrow">{eyebrow_heading}</div>
          )}
          
          <h1 className="aisb-hero__heading">
            {heading || 'Your Headline Here'}
          </h1>
          
          {sanitizedContent && (
            <div
              className="aisb-hero__body"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}

          {buttons && buttons.length > 0 && (
            <div className="aisb-hero__buttons">
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

          {sanitizedOutro && (
            <div
              className="aisb-hero__outro"
              dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
            />
          )}
        </div>

        {media_type !== 'none' && (
          <div className="aisb-hero__media">
            {media_type === 'image' && featured_image && (
              <img
                src={featured_image}
                alt={heading}
                className="aisb-hero__image"
              />
            )}
            {media_type === 'video' && video_url && (() => {
              const youtubeId = getYouTubeId(video_url);
              const vimeoId = getVimeoId(video_url);
              
              if (youtubeId) {
                return (
                  <iframe
                    className="aisb-hero__video"
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
                    className="aisb-hero__video"
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
                    className="aisb-hero__video" 
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
                  <div className="aisb-hero__video-placeholder">
                    <p>Invalid video URL. Please use YouTube, Vimeo, or select from Media Library.</p>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroPreview;