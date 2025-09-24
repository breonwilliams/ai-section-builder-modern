import React, { useState } from 'react';
import { useEditor } from '../Providers/EditorProvider';
import Icon from '../Common/Icon';
import ToggleSidebarsButton from '../Common/ToggleSidebarsButton';
import ContentImporter from './ContentImporter';

function Toolbar() {
  const { saveSections, isDirty, isSaving } = useEditor();
  const [showImporter, setShowImporter] = useState(false);

  const handleSave = async () => {
    const result = await saveSections();
    if (result) {
      // Show success notification
      console.log('Sections saved successfully');
    } else {
      // Show error notification
      console.error('Failed to save sections');
    }
  };

  // Get post data from WordPress
  const postTitle = window.aisbEditor?.postTitle || 'Untitled';
  const editPostUrl = window.aisbEditor?.editPostUrl;

  return (
    <>
      <div className="aisb-toolbar">
        <div className="aisb-toolbar__left">
          <div className="aisb-toolbar__post-info">
            <span className="aisb-toolbar__label">Editing:</span>
            <strong className="aisb-toolbar__title">{postTitle}</strong>
          </div>
        </div>
        <div className="aisb-toolbar__right">
          <button
            className="aisb-button aisb-button--secondary"
            onClick={() => setShowImporter(true)}
            style={{ marginRight: '10px' }}
            title="Import content from document"
          >
            <Icon name="upload" size="small" />
            Import Content
          </button>
          <ToggleSidebarsButton />
          {editPostUrl && (
            <a
              href={editPostUrl}
              className="aisb-button aisb-button--secondary"
              style={{ marginRight: '10px' }}
            >
              <Icon name="back" size="small" />
              Back to Editor
            </a>
          )}
          <button
            className={`aisb-button aisb-button--primary ${isSaving ? 'is-saving' : ''}`}
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            <Icon name="save" size="small" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {showImporter && (
        <>
          <div className="aisb-content-importer-overlay" onClick={() => setShowImporter(false)} />
          <ContentImporter onClose={() => setShowImporter(false)} />
        </>
      )}
    </>
  );
}

export default Toolbar;