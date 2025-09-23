import React from 'react';
import { useEditor } from '../Providers/EditorProvider';
import Icon from '../Common/Icon';

function RightSidebar() {
  const { sections, currentSectionIndex, setCurrentSection, deleteSection } = useEditor();

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(index);
    }
  };

  return (
    <div className="aisb-right-sidebar">
      <h3>Page Structure</h3>
      <div className="aisb-section-list">
        {sections.length === 0 ? (
          <p className="aisb-section-list__empty">No sections added</p>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className={`aisb-section-item ${
                index === currentSectionIndex ? 'is-active' : ''
              }`}
            >
              <div
                className="aisb-section-item__content"
                onClick={() => setCurrentSection(index)}
              >
                <span className="aisb-section-item__type">
                  {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                </span>
                <span className="aisb-section-item__title">
                  {section.content.heading || 'Untitled'}
                </span>
              </div>
              <div className="aisb-section-item__actions">
                <button
                  className="aisb-section-item__delete"
                  onClick={() => handleDelete(index)}
                  title="Delete section"
                  aria-label="Delete section"
                >
                  <Icon name="delete" size="small" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RightSidebar;