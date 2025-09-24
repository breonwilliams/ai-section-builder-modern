import React, { useEffect, useRef } from 'react';

function MediaLibraryButton({ 
  onSelect, 
  type = 'image', // 'image' or 'video'
  buttonText,
  buttonIcon = 'admin-media',
  className = '',
  render 
}) {
  const frameRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (frameRef.current) {
        frameRef.current.off();
        frameRef.current = null;
      }
    };
  }, []);

  const openMediaLibrary = (e) => {
    e.preventDefault();

    // Check if wp.media is available
    if (!window.wp || !window.wp.media) {
      console.error('WordPress Media Library is not available');
      alert('Media Library is not available. Please ensure you are in the WordPress admin.');
      return;
    }

    // Create or reuse the media frame
    if (!frameRef.current) {
      const fileType = type === 'video' ? 'video' : 'image';
      
      frameRef.current = window.wp.media({
        title: type === 'video' ? 'Select Video' : 'Select Image',
        button: {
          text: type === 'video' ? 'Use this video' : 'Use this image',
        },
        library: {
          type: fileType,
        },
        multiple: false,
      });

      // When media is selected
      frameRef.current.on('select', function() {
        const attachment = frameRef.current.state().get('selection').first().toJSON();
        
        // Pass the selected media to the parent component
        if (onSelect) {
          onSelect({
            id: attachment.id,
            url: attachment.url,
            title: attachment.title,
            alt: attachment.alt,
            caption: attachment.caption,
            description: attachment.description,
            width: attachment.width,
            height: attachment.height,
            sizes: attachment.sizes,
            type: attachment.type,
            subtype: attachment.subtype,
            mime: attachment.mime,
          });
        }
      });
    }

    // Open the media frame
    frameRef.current.open();
  };

  // Allow custom render function
  if (render) {
    return render({ onClick: openMediaLibrary });
  }

  // Default button render
  return (
    <button
      type="button"
      className={`aisb-media-library-button ${className}`}
      onClick={openMediaLibrary}
    >
      {buttonIcon && (
        <span className={`dashicons dashicons-${buttonIcon}`}></span>
      )}
      {buttonText || (type === 'video' ? 'Select Video' : 'Select Image')}
    </button>
  );
}

export default MediaLibraryButton;