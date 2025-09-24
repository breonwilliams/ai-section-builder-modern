import React, { useState } from 'react';
import MediaLibraryButton from './MediaLibraryButton';

function MediaSelector({ 
  mediaType, 
  onMediaTypeChange, 
  imageUrl, 
  onImageChange, 
  videoUrl, 
  onVideoChange 
}) {
  // Determine initial video source based on current video URL
  const getInitialVideoSource = () => {
    if (!videoUrl) return 'youtube';
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com')) {
      return 'youtube';
    }
    return 'library';
  };
  
  const [videoSource, setVideoSource] = useState(getInitialVideoSource)
  
  const mediaOptions = [
    { value: 'none', label: 'None', icon: 'no' },
    { value: 'image', label: 'Image', icon: 'format-image' },
    { value: 'video', label: 'Video', icon: 'video-alt2' }
  ];

  const handleImageSelect = (media) => {
    // Use the appropriate image size if available
    const imageUrl = media.sizes?.large?.url || media.sizes?.full?.url || media.url;
    onImageChange(imageUrl);
  };

  const handleVideoSelect = (media) => {
    console.log('Video selected from library:', media);
    if (media.url) {
      setVideoSource('library');
      // Force update by clearing then setting
      onVideoChange('');
      setTimeout(() => {
        onVideoChange(media.url);
      }, 0);
    }
  };

  const handleVideoSourceChange = (source) => {
    setVideoSource(source);
    // Clear video URL when switching sources
    if (source !== videoSource) {
      onVideoChange('');
    }
  };

  return (
    <div className="aisb-media-selector">
      <div className="aisb-form-group">
        <label className="aisb-form-label">Media Type</label>
        <div className="aisb-toggle-group">
          {mediaOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`aisb-toggle-btn ${mediaType === option.value ? 'active' : ''}`}
              onClick={() => onMediaTypeChange(option.value)}
            >
              <span className={`dashicons dashicons-${option.icon}`}></span>
              <span className="aisb-toggle-btn__label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {mediaType === 'image' && (
        <div className="aisb-form-group">
          <label className="aisb-form-label">
            Image
          </label>
          
          {!imageUrl ? (
            <MediaLibraryButton
              type="image"
              onSelect={handleImageSelect}
              className="aisb-media-selector__upload-button"
              buttonText="Select from Media Library"
              buttonIcon="format-image"
            />
          ) : (
            <div className="aisb-media-preview">
              <img src={imageUrl} alt="Preview" />
              <div className="aisb-media-preview__actions">
                <MediaLibraryButton
                  type="image"
                  onSelect={handleImageSelect}
                  render={({ onClick }) => (
                    <button 
                      type="button"
                      className="aisb-media-preview__change"
                      onClick={onClick}
                      title="Change Image"
                    >
                      <span className="dashicons dashicons-edit"></span>
                    </button>
                  )}
                />
                <button 
                  type="button" 
                  className="aisb-media-preview__remove"
                  onClick={() => onImageChange('')}
                  title="Remove Image"
                >
                  <span className="dashicons dashicons-no-alt"></span>
                </button>
              </div>
            </div>
          )}
          
          <div className="aisb-media-selector__or-divider">
            <span>OR</span>
          </div>
          
          <input
            type="text"
            className="aisb-form-input"
            value={imageUrl || ''}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="Enter image URL directly"
          />
          <small className="aisb-form-help">
            Upload from Media Library or enter an external image URL
          </small>
        </div>
      )}

      {mediaType === 'video' && (
        <div className="aisb-form-group">
          <label className="aisb-form-label">
            Video Source
          </label>
          
          <div className="aisb-toggle-group">
            <button
              type="button"
              className={`aisb-toggle-btn ${videoSource === 'youtube' ? 'active' : ''}`}
              onClick={() => handleVideoSourceChange('youtube')}
            >
              <span className="dashicons dashicons-video-alt3"></span>
              <span className="aisb-toggle-btn__label">YouTube/Vimeo</span>
            </button>
            <button
              type="button"
              className={`aisb-toggle-btn ${videoSource === 'library' ? 'active' : ''}`}
              onClick={() => handleVideoSourceChange('library')}
            >
              <span className="dashicons dashicons-admin-media"></span>
              <span className="aisb-toggle-btn__label">Media Library</span>
            </button>
          </div>

          {videoSource === 'youtube' ? (
            <div className="aisb-media-selector__video-url">
              <label className="aisb-form-label" htmlFor="video_url">
                Video URL
              </label>
              <input
                type="text"
                id="video_url"
                className="aisb-form-input"
                value={videoUrl || ''}
                onChange={(e) => onVideoChange(e.target.value)}
                placeholder="Enter YouTube or Vimeo URL"
              />
              <small className="aisb-form-help">
                Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </small>
            </div>
          ) : (
            <div className="aisb-media-selector__video-library">
              {!videoUrl ? (
                <MediaLibraryButton
                  type="video"
                  onSelect={handleVideoSelect}
                  className="aisb-media-selector__upload-button"
                  buttonText="Select Video from Media Library"
                  buttonIcon="video-alt2"
                />
              ) : (
                <div className="aisb-media-video-selected">
                  <div className="aisb-media-video-selected__info">
                    <span className="dashicons dashicons-video-alt2"></span>
                    <span className="aisb-media-video-selected__url">{videoUrl}</span>
                  </div>
                  <div className="aisb-media-video-selected__actions">
                    <MediaLibraryButton
                      type="video"
                      onSelect={handleVideoSelect}
                      render={({ onClick }) => (
                        <button 
                          type="button"
                          className="aisb-button-small"
                          onClick={onClick}
                        >
                          Change
                        </button>
                      )}
                    />
                    <button 
                      type="button" 
                      className="aisb-button-small aisb-button-danger"
                      onClick={() => onVideoChange('')}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MediaSelector;