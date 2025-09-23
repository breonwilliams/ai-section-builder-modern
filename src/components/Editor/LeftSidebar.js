import React from 'react';
import { useEditor } from '../Providers/EditorProvider';
import HeroForm from '../Sections/Hero/HeroForm';
import FeaturesForm from '../Sections/Features/FeaturesForm';
import Icon from '../Common/Icon';

function LeftSidebar() {
  const { addSection, sections, currentSectionIndex, updateSection } = useEditor();

  const handleAddSection = (type) => {
    addSection(type);
  };

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="aisb-left-sidebar">
      <div className="aisb-sidebar-tabs">
        <button className="aisb-tab active">Add Section</button>
        {currentSection && <button className="aisb-tab">Edit Section</button>}
      </div>

      <div className="aisb-sidebar-content">
        {!currentSection ? (
          <div className="aisb-section-library">
            <h3>Available Sections</h3>
            <div className="aisb-section-grid">
              <button
                className="aisb-section-card"
                onClick={() => handleAddSection('hero')}
              >
                <div className="aisb-section-card__icon">
                  <Icon name="hero" size="large" />
                </div>
                <div className="aisb-section-card__title">Hero</div>
                <div className="aisb-section-card__desc">
                  Eye-catching opener with headline
                </div>
              </button>
              <button
                className="aisb-section-card"
                onClick={() => handleAddSection('features')}
              >
                <div className="aisb-section-card__icon">
                  <Icon name="features" size="large" />
                </div>
                <div className="aisb-section-card__title">Features</div>
                <div className="aisb-section-card__desc">
                  Showcase key features with cards
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="aisb-section-form">
            <h3>Edit {currentSection.type} Section</h3>
            {currentSection.type === 'hero' && (
              <HeroForm
                content={currentSection.content}
                onChange={(updates) => updateSection(currentSectionIndex, updates)}
              />
            )}
            {currentSection.type === 'features' && (
              <FeaturesForm
                content={currentSection.content}
                onChange={(updates) => updateSection(currentSectionIndex, updates)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftSidebar;