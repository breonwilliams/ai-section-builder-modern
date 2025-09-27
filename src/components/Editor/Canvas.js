import React from 'react';
import { useEditor } from '../Providers/EditorProvider';
import HeroPreview from '../Sections/Hero/HeroPreview';
import FeaturesPreview from '../Sections/Features/FeaturesPreview';
import StatsPreview from '../Sections/Stats/StatsPreview';
import TestimonialsPreview from '../Sections/Testimonials/TestimonialsPreview';
import ChecklistPreview from '../Sections/Checklist/ChecklistPreview';
import FAQPreview from '../Sections/FAQ/FAQPreview';

function Canvas() {
  const { sections, currentSectionIndex, setCurrentSection } = useEditor();

  if (sections.length === 0) {
    return (
      <div className="aisb-canvas">
        <div className="aisb-canvas__empty">
          <h3>No sections added yet</h3>
          <p>Click "Add Section" in the left sidebar to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aisb-canvas">
      <div className="aisb-canvas__content">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`aisb-canvas__section ${index === currentSectionIndex ? 'is-selected' : ''}`}
            onClick={() => setCurrentSection(index)}
            title="Click to edit this section"
          >
            {section.type === 'hero' && (
              <HeroPreview content={section.content} />
            )}
            {section.type === 'features' && (
              <FeaturesPreview content={section.content} />
            )}
            {section.type === 'stats' && (
              <StatsPreview content={section.content} />
            )}
            {section.type === 'testimonials' && (
              <TestimonialsPreview content={section.content} />
            )}
            {section.type === 'checklist' && (
              <ChecklistPreview content={section.content} />
            )}
            {section.type === 'faq' && (
              <FAQPreview content={section.content} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Canvas;