import React, { useState } from 'react';
import { useEditor } from '../Providers/EditorProvider';
import Icon from '../Common/Icon';

function RightSidebar() {
  const { sections, currentSectionIndex, setCurrentSection, deleteSection, reorderSections } = useEditor();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(index);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderSections(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
              } ${
                draggedIndex === index ? 'is-dragging' : ''
              } ${
                dragOverIndex === index ? 'is-drag-over' : ''
              }`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div
                className="aisb-section-item__content"
                onClick={() => setCurrentSection(index)}
              >
                <span className="aisb-section-item__drag-handle">
                  <span className="dashicons dashicons-move"></span>
                </span>
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