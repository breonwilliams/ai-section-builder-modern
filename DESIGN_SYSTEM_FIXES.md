# CRITICAL: Section Design System Correction Guide

## 🚨 URGENT: Major Design System Issues Found

Claude, your current implementation has critical design system violations that must be fixed immediately before proceeding with any other work. This document provides exact specifications for correction.

---

## 🔴 CRITICAL ISSUES TO FIX NOW

### Issue 1: Section Styles in Wrong Location
**Problem:** Lines 443-1074 in `editor.css` contain section styles  
**Impact:** Breaks separation of concerns, prevents proper loading, violates architecture  
**Fix:** Move ALL section styles to separate files immediately

### Issue 2: Hardcoded Colors Throughout
**Problem:** Using `white`, `#1f2937`, `#f3f4f6` instead of CSS variables  
**Impact:** Breaks global settings feature, prevents theme customization  
**Fix:** Replace ALL hardcoded colors with CSS variables

### Issue 3: Missing CSS Variable Usage
**Problem:** Not using the token system that was carefully set up  
**Impact:** Future global settings won't work, inconsistent design  
**Fix:** Use ONLY CSS variables for ALL properties

### Issue 4: Incorrect Class Structure
**Problem:** Inconsistent BEM naming and class hierarchy  
**Impact:** Specificity issues, maintenance problems  
**Fix:** Follow exact BEM structure from reference plugin

---

## ✅ CORRECT ARCHITECTURE

### File Structure Required:
```
src/styles/
├── tokens/
│   ├── editor-tokens.css    # Editor UI tokens (purple theme)
│   ├── section-tokens.css   # Section rendering tokens (user customizable)
│   └── index.css            # Import both
├── editor/
│   └── editor.css          # ONLY editor UI (toolbar, panels) - NO SECTION STYLES!
└── sections/               # NEW - Create this directory
    ├── hero.css           # Hero section styles ONLY
    └── features.css       # Features section styles ONLY
```

---

## 📝 EXACT IMPLEMENTATION GUIDE

### Step 1: Create `/src/styles/sections/hero.css`

```css
/**
 * Hero Section Styles
 * Uses section design tokens for user customization
 * Mobile-first approach with golden ratio spacing
 */

/* Import ONLY section tokens - NOT editor tokens */
@import '../tokens/section-tokens.css';

/* Base Hero Structure */
.aisb-hero {
  position: relative;
  padding: var(--aisb-section-space-3xl) 0;
  background: var(--section-bg, var(--aisb-color-background));
  color: var(--section-text, var(--aisb-color-text));
  transition: all var(--aisb-section-transition-base);
}

/* Container - Future customizable max-width */
.aisb-hero__container {
  max-width: var(--aisb-section-max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--aisb-section-space-lg);
  
  /* Grid layout for content + media */
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--aisb-section-space-2xl);
  align-items: center;
}

/* Responsive grid - Desktop */
@media (min-width: 768px) {
  .aisb-section--content-left .aisb-hero__container {
    grid-template-columns: 1fr 1fr;
  }
  
  .aisb-section--content-right .aisb-hero__container {
    grid-template-columns: 1fr 1fr;
    direction: rtl;
  }
  
  .aisb-section--content-right .aisb-hero__content,
  .aisb-section--content-right .aisb-hero__media {
    direction: ltr;
  }
}

/* Center layout */
.aisb-section--center .aisb-hero__container {
  grid-template-columns: 1fr;
  text-align: center;
  max-width: 800px;
}

/* Content Area */
.aisb-hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--aisb-section-space-md);
}

/* Eyebrow - Golden ratio spacing */
.aisb-hero__eyebrow {
  display: inline-block;
  font-size: var(--aisb-section-text-sm);
  font-weight: var(--aisb-section-font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--aisb-color-primary);
  margin-bottom: calc(var(--aisb-section-space-sm) * 0.618); /* Golden ratio */
}

/* Heading - Future customizable font family */
.aisb-hero__heading {
  font-family: var(--aisb-section-font-heading, var(--aisb-section-font-family));
  font-size: clamp(
    var(--aisb-section-text-3xl),
    5vw,
    var(--aisb-section-text-5xl)
  );
  font-weight: var(--aisb-section-font-bold);
  line-height: var(--aisb-section-leading-tight);
  color: var(--section-heading, var(--aisb-color-text));
  margin: 0;
}

/* Body Text */
.aisb-hero__body {
  font-family: var(--aisb-section-font-body, var(--aisb-section-font-family));
  font-size: var(--aisb-section-text-lg);
  line-height: var(--aisb-section-leading-relaxed);
  color: var(--section-body, var(--aisb-color-text-secondary));
}

.aisb-hero__body p {
  margin: 0 0 var(--aisb-section-space-md) 0;
}

.aisb-hero__body p:last-child {
  margin-bottom: 0;
}

/* Buttons - Future customizable border radius */
.aisb-hero__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--aisb-section-space-md);
  margin-top: calc(var(--aisb-section-space-lg) * 1.618); /* Golden ratio */
}

.aisb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--aisb-section-space-sm) var(--aisb-section-space-lg);
  font-size: var(--aisb-section-text-base);
  font-weight: var(--aisb-section-font-medium);
  text-decoration: none;
  border-radius: var(--aisb-section-radius-button, var(--aisb-section-radius-md));
  transition: all var(--aisb-section-transition-base);
  cursor: pointer;
  border: 2px solid transparent;
}

/* Primary Button */
.aisb-btn-primary {
  background: var(--aisb-color-primary);
  color: white;
}

.aisb-btn-primary:hover {
  background: var(--aisb-color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--aisb-section-shadow-lg);
}

/* Secondary Button */
.aisb-btn-secondary {
  background: transparent;
  color: var(--aisb-color-primary);
  border-color: var(--aisb-color-primary);
}

.aisb-btn-secondary:hover {
  background: var(--aisb-color-primary);
  color: white;
}

/* Ghost Button */
.aisb-btn-ghost {
  background: transparent;
  color: var(--section-text, var(--aisb-color-text));
  border-color: var(--aisb-color-border);
}

.aisb-btn-ghost:hover {
  border-color: var(--aisb-color-primary);
  color: var(--aisb-color-primary);
}

/* Outro Content */
.aisb-hero__outro {
  margin-top: var(--aisb-section-space-lg);
  font-size: var(--aisb-section-text-sm);
  color: var(--aisb-color-text-secondary);
  opacity: 0.9;
}

/* Media */
.aisb-hero__media {
  position: relative;
  border-radius: var(--aisb-section-radius-image, var(--aisb-section-radius-lg));
  overflow: hidden;
}

.aisb-hero__image {
  width: 100%;
  height: auto;
  display: block;
  box-shadow: var(--aisb-section-shadow-xl);
}

.aisb-hero__video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
}

/* Theme Variants using CSS custom properties */
.aisb-section--light {
  --section-bg: var(--aisb-color-background);
  --section-text: var(--aisb-color-text);
  --section-heading: var(--aisb-color-text);
  --section-body: var(--aisb-color-text-secondary);
}

.aisb-section--dark {
  --section-bg: var(--aisb-color-text);
  --section-text: var(--aisb-color-background);
  --section-heading: var(--aisb-color-background);
  --section-body: var(--aisb-color-background-alt);
}
```

### Step 2: Create `/src/styles/sections/features.css`

```css
/**
 * Features Section Styles
 * Reusable card pattern for FAQ, Testimonials, etc.
 * Uses golden ratio for visual harmony
 */

/* Import ONLY section tokens */
@import '../tokens/section-tokens.css';

/* Base Features Structure */
.aisb-features {
  position: relative;
  padding: var(--aisb-section-space-3xl) 0;
  background: var(--section-bg, var(--aisb-color-background));
  color: var(--section-text, var(--aisb-color-text));
}

/* Container */
.aisb-features__container {
  max-width: var(--aisb-section-max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--aisb-section-space-lg);
}

/* Top Section (Header + Optional Media) */
.aisb-features__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--aisb-section-space-2xl);
  margin-bottom: calc(var(--aisb-section-space-2xl) * 1.618); /* Golden ratio */
  align-items: center;
}

@media (min-width: 768px) {
  .aisb-section--content-left .aisb-features__top {
    grid-template-columns: 1fr 1fr;
  }
  
  .aisb-section--content-right .aisb-features__top {
    grid-template-columns: 1fr 1fr;
    direction: rtl;
  }
  
  .aisb-section--content-right .aisb-features__content,
  .aisb-section--content-right .aisb-features__media {
    direction: ltr;
  }
}

/* Content Area */
.aisb-features__content {
  display: flex;
  flex-direction: column;
  gap: var(--aisb-section-space-md);
}

/* Typography - Matching Hero */
.aisb-features__eyebrow {
  display: inline-block;
  font-size: var(--aisb-section-text-sm);
  font-weight: var(--aisb-section-font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--aisb-color-primary);
  margin-bottom: calc(var(--aisb-section-space-sm) * 0.618);
}

.aisb-features__heading {
  font-family: var(--aisb-section-font-heading, var(--aisb-section-font-family));
  font-size: clamp(
    var(--aisb-section-text-2xl),
    4vw,
    var(--aisb-section-text-4xl)
  );
  font-weight: var(--aisb-section-font-bold);
  line-height: var(--aisb-section-leading-tight);
  color: var(--section-heading, var(--aisb-color-text));
  margin: 0;
}

.aisb-features__body {
  font-size: var(--aisb-section-text-lg);
  line-height: var(--aisb-section-leading-relaxed);
  color: var(--section-body, var(--aisb-color-text-secondary));
}

/* Feature Cards Grid */
.aisb-features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--aisb-section-space-lg);
}

/* Individual Card - Reusable pattern */
.aisb-features__item {
  background: var(--section-surface, var(--aisb-color-surface));
  border: 1px solid var(--aisb-color-border);
  border-radius: var(--aisb-section-radius-card, var(--aisb-section-radius-lg));
  overflow: hidden;
  transition: all var(--aisb-section-transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.aisb-features__item:hover {
  transform: translateY(-4px);
  box-shadow: var(--aisb-section-shadow-lg);
}

/* Card Image */
.aisb-features__item-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: var(--aisb-color-background-alt);
}

.aisb-features__item-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Card Content */
.aisb-features__item-content {
  padding: var(--aisb-section-space-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--aisb-section-space-sm);
}

.aisb-features--cards-center .aisb-features__item-content {
  text-align: center;
}

.aisb-features__item-title {
  font-size: var(--aisb-section-text-xl);
  font-weight: var(--aisb-section-font-semibold);
  color: var(--section-heading, var(--aisb-color-text));
  margin: 0;
}

.aisb-features__item-description {
  font-size: var(--aisb-section-text-base);
  line-height: var(--aisb-section-leading-normal);
  color: var(--section-body, var(--aisb-color-text-secondary));
  margin: 0;
  flex: 1;
}

.aisb-features__item-link {
  display: inline-flex;
  align-items: center;
  color: var(--aisb-color-primary);
  text-decoration: none;
  font-weight: var(--aisb-section-font-medium);
  transition: all var(--aisb-section-transition-fast);
  margin-top: auto;
}

.aisb-features__item-link:hover {
  color: var(--aisb-color-primary-hover);
  transform: translateX(4px);
}

/* Buttons */
.aisb-features__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--aisb-section-space-md);
  margin-top: var(--aisb-section-space-lg);
}

/* Outro */
.aisb-features__outro {
  margin-top: calc(var(--aisb-section-space-2xl) * 1.618);
  text-align: center;
  font-size: var(--aisb-section-text-sm);
  color: var(--aisb-color-text-secondary);
}

/* Theme Variants */
.aisb-section--light {
  --section-bg: var(--aisb-color-background);
  --section-surface: var(--aisb-color-surface);
  --section-text: var(--aisb-color-text);
  --section-heading: var(--aisb-color-text);
  --section-body: var(--aisb-color-text-secondary);
}

.aisb-section--dark {
  --section-bg: #0f172a; /* Dark background */
  --section-surface: #1e293b; /* Dark surface */
  --section-text: #f1f5f9; /* Light text */
  --section-heading: #ffffff; /* White headings */
  --section-body: #cbd5e1; /* Muted light text */
}
```

### Step 3: Update `section-tokens.css` with Foundation Variables

Add these to the existing `section-tokens.css`:

```css
/* Foundation for Future Global Settings */
:root {
  /* Container Width - User customizable in future */
  --aisb-section-max-width: 1200px;
  
  /* Typography Settings - Future font picker */
  --aisb-section-font-heading: var(--aisb-section-font-family);
  --aisb-section-font-body: var(--aisb-section-font-family);
  
  /* Spacing Scale - User can adjust density */
  --aisb-section-spacing-scale: 1;
  
  /* Border Radius Presets - User customizable */
  --aisb-section-radius-button: var(--aisb-section-radius-md);
  --aisb-section-radius-card: var(--aisb-section-radius-lg);
  --aisb-section-radius-image: var(--aisb-section-radius-lg);
  
  /* Golden Ratio for Visual Harmony */
  --aisb-golden-ratio: 1.618;
  
  /* Heading Sizes with Golden Ratio */
  --aisb-section-heading-scale: 1.618;
  --aisb-section-heading-xl: calc(var(--aisb-section-text-3xl) * var(--aisb-section-heading-scale));
  --aisb-section-heading-lg: var(--aisb-section-text-3xl);
  --aisb-section-heading-md: var(--aisb-section-text-2xl);
  --aisb-section-heading-sm: var(--aisb-section-text-xl);
}
```

### Step 4: Remove Section Styles from `editor.css`

DELETE lines 443-1074 from `editor.css`. These should NOT be there.

### Step 5: Update React Components

**In `HeroPreview.js`:**
```javascript
import React from 'react';
import DOMPurify from 'dompurify';
import '../../../styles/sections/hero.css'; // Add this import

function HeroPreview({ content }) {
  // ... existing code ...
  
  // Fix class names - Hero doesn't need generic 'aisb-section'
  const sectionClasses = [
    'aisb-hero',
    'aisb-section', // Add this for base styles
    `aisb-section--${theme_variant}`,
    `aisb-section--${layout_variant}`,
  ].join(' ');
```

**In `FeaturesPreview.js`:**
```javascript
import React from 'react';
import DOMPurify from 'dompurify';
import '../../../styles/sections/features.css'; // Add this import

function FeaturesPreview({ content }) {
  // ... existing code ...
  
  // Class structure is correct - keep as is
}
```

---

## 🎨 Design Philosophy to Follow

### Minimalism First
- Clean, spacious layouts
- Ample whitespace using golden ratio
- No unnecessary decorations
- Focus on content, not chrome

### Color Restraint
- Maximum 8 colors in the system
- Mostly grayscale with primary accent
- Let user's content be the color
- Subtle, not loud

### Typography Hierarchy
- Clear size progression
- Consistent spacing
- Good readability
- Mobile-first sizing with clamp()

### Modern Patterns
- Cards with subtle shadows
- Smooth transitions
- Hover states that feel responsive
- Accessible focus states

---

## ✅ Testing Checklist

After making these changes, verify:

1. **File Structure**
   - [ ] `/src/styles/sections/hero.css` exists
   - [ ] `/src/styles/sections/features.css` exists
   - [ ] Section styles removed from `editor.css`

2. **CSS Variables**
   - [ ] No hardcoded colors anywhere
   - [ ] All spacing uses variables
   - [ ] Border radius uses variables
   - [ ] Typography uses variables

3. **Visual Test**
   - [ ] Light theme: Clean white background
   - [ ] Dark theme: Proper dark colors (not purple)
   - [ ] Hover states work
   - [ ] Golden ratio spacing visible

4. **Global Settings Ready**
   - [ ] Changing `--aisb-color-primary` affects buttons/links
   - [ ] Changing `--aisb-section-max-width` affects container
   - [ ] All customizable properties use variables

---

## 🚀 Next Steps After Fixes

Once these corrections are complete:

1. Test both sections thoroughly
2. Ensure preview matches expected design
3. Verify theme variants work
4. Confirm all variables are working
5. Then proceed with implementing remaining functionality

**DO NOT** proceed with other features until this design system is properly implemented. The foundation must be correct before building on top of it.

---

## 📚 Reference

Study these files from the reference plugin:
- `/ai_section_builder_v2/assets/css/sections/hero.css`
- `/ai_section_builder_v2/assets/css/sections/features.css`
- `/ai_section_builder_v2/assets/css/core/00-tokens.css`

Follow their patterns exactly for consistency and quality.

---

This is CRITICAL for the plugin's success. The design system is the foundation for everything else.