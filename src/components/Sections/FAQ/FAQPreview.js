import React, { useState } from 'react';
import DOMPurify from 'dompurify';

function FAQPreview({ content }) {
  const {
    eyebrow_heading,
    heading,
    content: bodyContent,
    questions = [],
    buttons = [],
    outro_content,
    theme_variant = 'light',
    layout_variant = 'content-left',
    media_type = 'none',
    featured_image,
    video_url,
  } = content;

  const [expandedItems, setExpandedItems] = useState([]);

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

  const toggleItem = (index) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sectionClasses = [
    'aisb-faq',
    `aisb-section--${theme_variant}`,
    `aisb-section--${layout_variant}`,
  ].join(' ');

  return (
    <section className={sectionClasses}>
      <div className="aisb-faq__container">
        {layout_variant !== 'center' ? (
          <div className="aisb-faq__columns">
            <div className="aisb-faq__content-column">
              {eyebrow_heading && (
                <div className="aisb-faq__eyebrow">{eyebrow_heading}</div>
              )}
              
              <h2 className="aisb-faq__heading">
                {heading || 'Frequently Asked Questions'}
              </h2>
              
              {sanitizedContent && (
                <div
                  className="aisb-faq__content"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              )}

              {questions && questions.length > 0 && (
                <div className="aisb-faq__items">
                  {questions.map((item, index) => (
                    <div 
                      key={index} 
                      className={`aisb-faq__item ${expandedItems.includes(index) ? 'aisb-faq__item--expanded' : ''}`}
                    >
                      <div 
                        className="aisb-faq__item-question"
                        onClick={() => toggleItem(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleItem(index);
                          }
                        }}
                      >
                        {item.question || 'Question'}
                      </div>
                      <div className="aisb-faq__item-answer">
                        <div className="aisb-faq__item-answer-inner">
                          <div className="aisb-faq__item-answer-content">
                            {item.answer && (
                              <div dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(item.answer) 
                              }} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {buttons && buttons.length > 0 && (
                <div className="aisb-faq__buttons">
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
                  className="aisb-faq__outro"
                  dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
                />
              )}
            </div>

            {media_type !== 'none' && (
              <div className="aisb-faq__media-column">
                {media_type === 'image' && featured_image && (
                  <div className="aisb-faq__media">
                    <img
                      src={featured_image}
                      alt={heading}
                      className="aisb-faq__image"
                    />
                  </div>
                )}
                {media_type === 'video' && video_url && (() => {
                  const youtubeId = getYouTubeId(video_url);
                  const vimeoId = getVimeoId(video_url);
                  
                  if (youtubeId) {
                    return (
                      <div className="aisb-faq__media">
                        <iframe
                          className="aisb-faq__video"
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
                      <div className="aisb-faq__media">
                        <iframe
                          className="aisb-faq__video"
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
                      <div className="aisb-faq__media">
                        <video 
                          className="aisb-faq__video" 
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
                      <div className="aisb-faq__media">
                        <div className="aisb-faq__video-placeholder">
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
          <div className="aisb-faq__center">
            {eyebrow_heading && (
              <div className="aisb-faq__eyebrow">{eyebrow_heading}</div>
            )}
            
            <h2 className="aisb-faq__heading">
              {heading || 'Frequently Asked Questions'}
            </h2>
            
            {sanitizedContent && (
              <div
                className="aisb-faq__content"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}

            {questions && questions.length > 0 && (
              <div className="aisb-faq__items">
                {questions.map((item, index) => (
                  <div 
                    key={index} 
                    className={`aisb-faq__item ${expandedItems.includes(index) ? 'aisb-faq__item--expanded' : ''}`}
                  >
                    <div 
                      className="aisb-faq__item-question"
                      onClick={() => toggleItem(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleItem(index);
                        }
                      }}
                    >
                      {item.question || 'Question'}
                    </div>
                    <div className="aisb-faq__item-answer">
                      <div className="aisb-faq__item-answer-inner">
                        <div className="aisb-faq__item-answer-content">
                          {item.answer && (
                            <div dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(item.answer) 
                            }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {buttons && buttons.length > 0 && (
              <div className="aisb-faq__buttons">
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
                className="aisb-faq__outro"
                dangerouslySetInnerHTML={{ __html: sanitizedOutro }}
              />
            )}

            {media_type !== 'none' && (
              <>
                {media_type === 'image' && featured_image && (
                  <div className="aisb-faq__media">
                    <img
                      src={featured_image}
                      alt={heading}
                      className="aisb-faq__image"
                    />
                  </div>
                )}
                {media_type === 'video' && video_url && (() => {
                  const youtubeId = getYouTubeId(video_url);
                  const vimeoId = getVimeoId(video_url);
                  
                  if (youtubeId) {
                    return (
                      <div className="aisb-faq__media">
                        <iframe
                          className="aisb-faq__video"
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
                      <div className="aisb-faq__media">
                        <iframe
                          className="aisb-faq__video"
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
                      <div className="aisb-faq__media">
                        <video 
                          className="aisb-faq__video" 
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
                      <div className="aisb-faq__media">
                        <div className="aisb-faq__video-placeholder">
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

export default FAQPreview;