# Critical Implementation Analysis Instructions for AI Section Builder Modern

## PLUGIN VISION & AI CONTEXT
This plugin is building toward an **AI-powered page builder** where users can:
1. **Generate entire pages from text prompts** - "Create a SaaS landing page for project management software"
2. **AI assembles sections intelligently** - Hero → Features → Testimonials → FAQ → CTA
3. **Each section is customized** - AI fills in relevant content, images, and styling
4. **Global settings apply automatically** - Brand colors, fonts, spacing preferences

**Why This Matters for Current Development:**
- **Sections are modular building blocks** - AI will compose them in various combinations
- **Data structure must be consistent** - AI needs predictable fields to populate
- **Frontend rendering must be robust** - Handle any section order/combination
- **Design system needs flexibility** - CSS variables allow AI to customize appearance

## IMPORTANT CONTEXT
You are working on the **modern plugin** (`ai-section-builder-modern`) which is a React-based rebuild. However, you need to understand the **reference plugin** (`ai_section_builder_v2`) to ensure:
1. Frontend rendering works correctly (currently broken)
2. Design system matches the reference implementation
3. User workflow remains consistent
4. PHP backend integration follows WordPress best practices
5. Foundation supports future AI features

## ANALYSIS REQUIREMENTS

### 1. REFERENCE PLUGIN ANALYSIS (`ai_section_builder_v2`)
**Focus Areas:**
- **Frontend Rendering System** (CRITICAL - Currently Missing in Modern)
  - `/includes/core/class-template-handler.php` - How it overrides templates
  - `/includes/section-wrappers.php` - PHP rendering functions
  - `/includes/sections/class-hero-section.php` - Server-side HTML generation
  - How sections are displayed on actual WordPress pages

- **Design System Implementation**
  - `/assets/css/sections/hero.css` - Mobile-first approach, specific font sizes (32px → 48px)
  - `/assets/css/sections/features.css` - Card patterns with borders, 16:9 aspect ratios
  - `/assets/css/core/00-tokens.css` - CSS variable system
  - How light/dark themes work with CSS custom properties

- **User Workflow**
  - Meta box integration ("Edit with AI Section Builder" button)
  - Hidden admin page for full-screen editor
  - How sections are saved to post meta
  - Template override system for full-width display

### 2. MODERN PLUGIN ASSESSMENT (`ai-section-builder-modern`)
**Evaluate Current Implementation:**
- **What's Working:**
  - React-based editor interface
  - REST API for data management
  - Meta box integration
  - Full-screen editor template

- **What's Broken/Missing:**
  - ❌ **No frontend rendering** - Sections don't display on pages
  - ❌ **No PHP template handler** - Missing content filter
  - ❌ **No section renderer** - No server-side HTML generation
  - ❌ **CSS mismatches** - Font sizes, card borders, spacing incorrect
  - ❌ **No frontend.css build** - Only editor styles are compiled

### 3. IMPLEMENTATION PRIORITIES

**CRITICAL FIXES (Must Implement):**
1. **Frontend Rendering System**
   - Create `TemplateHandler.php` using reference plugin pattern
   - Create `SectionRenderer.php` for server-side HTML
   - Hook into `the_content` filter
   - Sections MUST display on actual pages

2. **Design System Alignment**
   - Hero heading: 32px mobile → 48px desktop (not using clamp)
   - Features cards: 1px border, proper padding (24px 20px)
   - Images: 16:9 aspect ratio enforcement
   - Colors: Use CSS variables consistently

3. **Build System**
   - Create separate `frontend.css` that imports section styles
   - Ensure frontend assets load when sections exist

**MAINTAIN MODERN APPROACH:**
- Keep React for editor (don't revert to jQuery)
- Use REST API (not AJAX)
- Maintain ES6+ JavaScript
- Keep component-based architecture
- Use modern build tools (webpack)

### 4. KEY PATTERNS TO PRESERVE

**From Reference Plugin (Must Keep):**
```php
// Template override pattern
add_filter('the_content', [$this, 'render_sections_content'], 10);

// Section rendering pattern
$sections = get_post_meta($post_id, '_aisb_sections', true);
foreach ($sections as $section) {
    echo $renderer->render_section($section);
}

// CSS mobile-first pattern
.aisb-hero__heading {
    font-size: 32px; /* Mobile first */
}
@media (min-width: 768px) {
    .aisb-hero__heading {
        font-size: 48px; /* Desktop */
    }
}
```

**Modern Plugin Standards (Must Keep):**
```javascript
// React components for editor
import { useState, useEffect } from 'react';
import { useStore } from '../store';

// REST API calls
await fetch(`${aisbEditor.apiUrl}sections`, {
    headers: { 'X-WP-Nonce': aisbEditor.nonce }
});
```

### 5. ANALYSIS OUTPUT REQUIRED

After analyzing both codebases, provide:

1. **Gap Analysis:**
   - List all missing functionality in modern plugin
   - Identify design mismatches with specific values
   - Note any broken user workflows

2. **Implementation Plan:**
   - Step-by-step fixes for frontend rendering
   - CSS corrections with exact values
   - File creation/modification list

3. **Testing Checklist:**
   - How to verify frontend rendering works
   - Design validation points
   - User workflow testing steps

## CRITICAL REMINDERS

- **Frontend rendering is completely broken** - This is the #1 priority
- **Server-side PHP rendering is required** - React components won't work on frontend
- **Design must match reference** - Users expect consistency
- **Don't break what's working** - Keep React editor, REST API, modern JavaScript
- **Test on actual WordPress pages** - Not just in the editor

## FILES TO EXAMINE CAREFULLY

**Reference Plugin (Learn From):**
- `/includes/core/class-template-handler.php`
- `/includes/section-wrappers.php`
- `/includes/sections/class-hero-section.php`
- `/includes/sections/class-features-section.php`
- `/assets/css/sections/hero.css`
- `/assets/css/sections/features.css`

**Modern Plugin (Fix/Update):**
- `/includes/Core/Plugin.php` - Add template handler init
- `/includes/Core/Assets.php` - Fix frontend loading
- `/src/styles/sections/hero.css` - Match reference sizes
- `/src/styles/sections/features.css` - Fix card styles
- **CREATE:** `/includes/Core/TemplateHandler.php`
- **CREATE:** `/includes/Core/SectionRenderer.php`

## FOUNDATION FOR AI FEATURES (Future Development)

While fixing the current critical issues, keep in mind these architectural requirements for AI integration:

### Data Structure Consistency
- Each section type must have standardized fields (heading, content, buttons, etc.)
- Section data should be JSON-serializable for AI generation
- Maintain clear field naming conventions across all section types

### Rendering Flexibility
- Frontend renderer must handle sections in any order
- Support for dynamic section counts (AI might generate 3 or 10 sections)
- Gracefully handle missing/optional fields

### Design System Scalability
- CSS variables enable AI to apply user's brand colors
- Typography system allows AI to maintain consistency
- Spacing/sizing tokens create harmonious layouts

### Example AI Workflow (Future):
```javascript
// User prompt: "Create a landing page for my fitness app"
const aiGeneratedPage = {
  sections: [
    {
      type: 'hero',
      content: {
        heading: 'Get Fit with AI-Powered Workouts',
        content: 'Personalized training plans that adapt to your progress.',
        theme_variant: 'dark',
        buttons: [
          { text: 'Start Free Trial', style: 'primary' },
          { text: 'View Demo', style: 'secondary' }
        ]
      }
    },
    {
      type: 'features',
      content: {
        heading: 'Everything You Need to Succeed',
        cards: [
          { heading: 'Smart Workouts', content: 'AI adapts difficulty...' },
          { heading: 'Progress Tracking', content: 'Visual analytics...' },
          { heading: 'Nutrition Guide', content: 'Meal plans that work...' }
        ]
      }
    }
    // ... more sections
  ]
};
```

### Current Implementation Impact:
1. **Section Renderer** must be data-driven, not hardcoded
2. **CSS must use variables** for all colors, sizes, spacing
3. **Field names must be consistent** across PHP and React
4. **Global settings structure** should anticipate customization needs

Take your time to understand both codebases thoroughly. The modern plugin has good React architecture but is missing critical WordPress integration for frontend display. Your goal is to bridge this gap while maintaining the modern approach AND building a foundation that can support AI-powered page generation in the future.