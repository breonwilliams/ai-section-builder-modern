import React from 'react';
import DOMPurify from 'dompurify';

function ChecklistPreview({ content }) {
  const {
    eyebrow_heading,
    heading,
    content: bodyContent,
    items = [],
    buttons = [],
    outro_content,
    theme_variant = 'light',
    layout_variant = 'content-left',
    media_type = 'none',
    featured_image,
    video_url,
  } = content;

  const sanitizedContent = DOMPurify.sanitize(bodyContent || '');
  const sanitizedOutro = DOMPurify.sanitize(outro_content || '');
  
  const isContentEmpty = (html) => {
    if (!html) return true;
    const stripped = html.replace(/<br\s*\/?>/gi, '').trim();
    return stripped === '' || stripped === '<p></p>';
  };

  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/ |.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVimeoId = (url) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const sectionClasses = [
    'aisb-checklist',
    `aisb-section--${theme_variant}`,
    `aisb-section--${layout_variant}`,
  ].join(' ');

  const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section className={sectionClasses}>
      <div className="aisb-checklist__container">
        {layout_variant !== 'center' ? (
          <div className="aisb-checklist__columns">
            <div className="aisb-checklist__content-column">
              {eyebrow_heading && (
                <div className="aisb-checklist__eyebrow">{eyebrow_heading}</div>
              )}
              
              <h2 className="aisb-checklist__heading">
                {heading || 'Everything You Need'}
              </h2>
              
              {sanitizedContent && (
                <div
                  className="aisb-checklist__content"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              )}

              {items && items.length > 0 && (
                <div className="aisb-checklist__items">
                  {items.map((item, index) => (
                    <div key={index} className="aisb-checklist__item">
                      <div className="aisb-checklist__item-icon">
                        <CheckIcon />
                      </div>
                      <div className="aisb-checklist__item-content">
                        <h4 className="aisb-checklist__item-heading">
                          {item.heading || 'Checklist Item'}
                        </h4>
                        {item.content && (
                          <p className="aisb-checklist__item-text">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {buttons && buttons.length > 0 && (
                <div className="aisb-checklist__buttons">
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

              {sanitizedOutro && !isContentEmpty(sanitizedOutro) && (
                <div
                  className="aisb-checklist__outro"
                  dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
                />
              )}
            </div>

            {media_type !== 'none' && (
              <div className="aisb-checklist__media-column">
                {media_type === 'image' && featured_image && (
                  <div className="aisb-checklist__media">
                    <img
                      src={featured_image}
                      alt={heading}
                      className="aisb-checklist__image"
                    />
                  </div>
                )}
                {media_type === 'video' && video_url && (() => {
                  const youtubeId = getYouTubeId(video_url);
                  const vimeoId = getVimeoId(video_url);
                  
                  if (youtubeId) {
                    return (
                      <div className="aisb-checklist__media">
                        <iframe
                          className="aisb-checklist__video"
                          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video"
                        />
                      </div>
                    );
                  } else if (vimeoId) {
                    return (
                      <div className="aisb-checklist__media">
                        <iframe
                          className="aisb-checklist__video"
                          src={`https://player.vimeo.com/video/${vimeoId}`}
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title="Video"
                        />
                      </div>
                    );
                  } else if (video_url.match(/\.(mp4|webm|ogg)$/i) || video_url.includes('/wp-content/')) {
                    return (
                      <div className="aisb-checklist__media">
                        <video 
                          className="aisb-checklist__video" 
                          controls 
                          preload="metadata"
                        >
                          <source src={video_url} type="video/mp4" />
                          <source src={video_url} type="video/webm" />
                          <source src={video_url} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  } else {
                    return (
                      <div className="aisb-checklist__media">
                        <div className="aisb-checklist__video-placeholder">
                          <p>Invalid video URL. Please use YouTube, Vimeo, or select from Media Library.</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        ) : (
          <div className="aisb-checklist__center">
            {eyebrow_heading && (
              <div className="aisb-checklist__eyebrow">{eyebrow_heading}</div>
            )}
            
            <h2 className="aisb-checklist__heading">
              {heading || 'Everything You Need'}
            </h2>
            
            {sanitizedContent && (
              <div
                className="aisb-checklist__content"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}

            {items && items.length > 0 && (
              <div className="aisb-checklist__items">
                {items.map((item, index) => (
                  <div key={index} className="aisb-checklist__item">
                    <div className="aisb-checklist__item-icon">
                      <CheckIcon />
                    </div>
                    <div className="aisb-checklist__item-content">
                      <h4 className="aisb-checklist__item-heading">
                        {item.heading || 'Checklist Item'}
                      </h4>
                      {item.content && (
                        <p className="aisb-checklist__item-text">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {buttons && buttons.length > 0 && (
              <div className="aisb-checklist__buttons">
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

            {sanitizedOutro && !isContentEmpty(sanitizedOutro) && (
              <div
                className="aisb-checklist__outro"
                dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
              />
            )}

            {media_type !== 'none' && (
              <>
                {media_type === 'image' && featured_image && (
                  <div className="aisb-checklist__media">
                    <img
                      src={featured_image}
                      alt={heading}
                      className="aisb-checklist__image"
                    />
                  </div>
                )}
                {media_type === 'video' && video_url && (() => {
                  const youtubeId = getYouTubeId(video_url);
                  const vimeoId = getVimeoId(video_url);
                  
                  if (youtubeId) {
                    return (
                      <div className="aisb-checklist__media">
                        <iframe
                          className="aisb-checklist__video"
                          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video"
                        />
                      </div>
                    );
                  } else if (vimeoId) {
                    return (
                      <div className="aisb-checklist__media">
                        <iframe
                          className="aisb-checklist__video"
                          src={`https://player.vimeo.com/video/${vimeoId}`}
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title="Video"
                        />
                      </div>
                    );
                  } else if (video_url.match(/\.(mp4|webm|ogg)$/i) || video_url.includes('/wp-content/')) {
                    return (
                      <div className="aisb-checklist__media">
                        <video 
                          className="aisb-checklist__video" 
                          controls 
                          preload="metadata"
                        >
                          <source src={video_url} type="video/mp4" />
                          <source src={video_url} type="video/webm" />
                          <source src={video_url} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  } else {
                    return (
                      <div className="aisb-checklist__media">
                        <div className="aisb-checklist__video-placeholder">
                          <p>Invalid video URL. Please use YouTube, Vimeo, or select from Media Library.</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ChecklistPreview;