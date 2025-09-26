import React, { useState, useEffect } from 'react';
import { useEditor } from '../Providers/EditorProvider';
import HeroForm from '../Sections/Hero/HeroForm';
import FeaturesForm from '../Sections/Features/FeaturesForm';
import StatsForm from '../Sections/Stats/StatsForm';
import TestimonialsForm from '../Sections/Testimonials/TestimonialsForm';
import ChecklistForm from '../Sections/Checklist/ChecklistForm';
import GlobalSettings from './GlobalSettings';
import Icon from '../Common/Icon';

function LeftSidebar() {
  const { 
    addSection, 
    sections, 
    currentSectionIndex, 
    updateSection, 
    setCurrentSection,
    showGlobalSettings,
    setShowGlobalSettings 
  } = useEditor();
  const [showSectionList, setShowSectionList] = useState(false);

  const handleAddSection = (type) => {
    addSection(type);
    setShowSectionList(false);
  };

  // Reset to edit view when section changes
  useEffect(() => {
    if (currentSectionIndex !== null && currentSectionIndex >= 0) {
      setShowSectionList(false);
    }
  }, [currentSectionIndex]);

  const currentSection = sections[currentSectionIndex];

  // Show section list if no current section or user clicked back
  const shouldShowSectionList = !currentSection || showSectionList;

  // If showing global settings, render that instead
  if (showGlobalSettings) {
    return (
      <div className="aisb-left-sidebar">
        <GlobalSettings onClose={() => setShowGlobalSettings(false)} />
      </div>
    );
  }

  return (
    <div className="aisb-left-sidebar">
      <div className="aisb-sidebar-header">
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
              <button
                className="aisb-section-card"
                onClick={() => handleAddSection('stats')}
              >
                <div className="aisb-section-card__icon">
                  <Icon name="stats" size="large" />
                </div>
                <div className="aisb-section-card__title">Stats</div>
                <div className="aisb-section-card__desc">
                  Display impressive numbers
                </div>
              </button>
              <button
                className="aisb-section-card"
                onClick={() => handleAddSection('testimonials')}
              >
                <div className="aisb-section-card__icon">
                  <Icon name="testimonials" size="large" />
                </div>
                <div className="aisb-section-card__title">Testimonials</div>
                <div className="aisb-section-card__desc">
                  Share customer reviews
                </div>
              </button>
              <button
                className="aisb-section-card"
                onClick={() => handleAddSection('checklist')}
              >
                <div className="aisb-section-card__icon">
                  <Icon name="checklist" size="large" />
                </div>
                <div className="aisb-section-card__title">Checklist</div>
                <div className="aisb-section-card__desc">
                  List features and benefits
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
            {currentSection.type === 'stats' && (
              <StatsForm
                content={currentSection.content}
                onChange={(updates) => updateSection(currentSectionIndex, updates)}
              />
            )}
            
            {currentSection.type === 'testimonials' && (
              <TestimonialsForm
                content={currentSection.content}
                onChange={(updates) => updateSection(currentSectionIndex, updates)}
              />
            )}
            
            {currentSection.type === 'checklist' && (
              <ChecklistForm
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