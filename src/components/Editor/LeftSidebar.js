import React from 'react';
import { useEditor } from '../Providers/EditorProvider';
import HeroForm from '../Sections/Hero/HeroForm';
import FeaturesForm from '../Sections/Features/FeaturesForm';
import Icon from '../Common/Icon';

function LeftSidebar() {
  const { addSection, sections, currentSectionIndex, updateSection, setCurrentSection } = useEditor();
  const [showSectionList, setShowSectionList] = React.useState(false);

  const handleAddSection = (type) => {
    addSection(type);
    setShowSectionList(false);
  };

  // Reset to edit view when section changes
  React.useEffect(() => {
    if (currentSectionIndex !== null && currentSectionIndex >= 0) {
      setShowSectionList(false);
    }
  }, [currentSectionIndex]);

  const currentSection = sections[currentSectionIndex];

  // Show section list if no current section or user clicked back
  const shouldShowSectionList = !currentSection || showSectionList;

  return (
    <div className="aisb-left-sidebar">
      <div className="aisb-sidebar-header">
        {currentSection && !showSectionList && (
          <button 
            className="aisb-back-to-sections"
            onClick={() => setShowSectionList(true)}
            title="Back to section list"
          >
            <Icon name="arrow-left" size="small" />
          </button>
        )}
        <div className="aisb-sidebar-title">
          {shouldShowSectionList ? (
            <span>Add Section</span>
          ) : (
            <>
              <span className="aisb-sidebar-title__type">
                {currentSection?.type.charAt(0).toUpperCase() + currentSection?.type.slice(1)}
              </span>
              <span className="aisb-sidebar-title__name">
                {currentSection?.content.heading || 'Untitled'}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="aisb-sidebar-content">
        {shouldShowSectionList ? (
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