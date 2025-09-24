# AI Section Builder - Production Roadmap & Implementation Plan

## 🎯 Project Vision
AI Section Builder is a **content acceleration system** that transforms Word documents into beautiful web pages in 60 seconds using AI. It's NOT another page builder - it's a universal tool that works WITH any WordPress setup to handle bulk content transformation.

## 📊 Current State Assessment (January 2025)

### ✅ What's Working Well
1. **React-based editor** - Modern, maintainable architecture
2. **REST API integration** - Proper WordPress API usage  
3. **Zustand state management** - Clean state handling
4. **Component architecture** - Good separation of concerns
5. **Modern build system** - Webpack, proper asset compilation
6. **Design tokens system** - CSS variables for theming
7. **Template system** - Basic implementation with 3 display modes

### ❌ Critical Issues Identified

#### 1. **Section Implementation Gaps**
- Only 2 of 7 sections implemented (Hero, Features)
- These 2 sections need refinement before adding more
- Missing: FAQ, Stats, Testimonials, Checklist, Hero Form

#### 2. **Hero & Features Section Issues**
- Font sizes don't match reference (should be 32px→48px, not clamp)
- Features cards missing proper 1px borders
- Padding incorrect (should be 24px/20px)
- No visual rhythm system (light/dark/accent rotation)
- Field names inconsistent between PHP and React

#### 3. **Template System Concerns** 🔴 CRITICAL
- Still using some CSS overrides in `add_template_styles()`
- The fullwidth wrapper uses CSS hacks (negative margins)
- Should use pure template approach

**❌ NEVER DO THIS (Current Bad Practices to Remove):**
```css
/* These CSS hacks MUST be removed: */
.aisb-section { 
    width: 100vw !important;     /* WRONG - breaks layouts */
    margin-left: -50vw !important; /* WRONG - CSS hack */
    left: 50% !important;         /* WRONG - positioning hack */
}

/* Using !important to override themes: */
.entry-content { 
    max-width: none !important;   /* WRONG - fighting theme */
}
```

**✅ CORRECT APPROACH (Use Templates Only):**
```php
// Use WordPress template hierarchy properly
add_filter('template_include', [$this, 'load_canvas_template'], 999);

// Let WordPress handle the layout
// Don't fight the theme with CSS
```

#### 4. **AI Foundation Not Ready**
- No standardized data structure for sections
- Field naming inconsistent
- Missing document processor infrastructure
- No content pattern matching system

## 🚀 REVISED Implementation Plan - Incremental Approach

### Phase 1: Perfect Hero & Features Sections (Week 1)
**STOP AND TEST AFTER EACH STEP**

#### Step 1.1: Fix Design Values
- [ ] Hero heading: Change to 32px mobile, 48px desktop (no clamp)
- [ ] Features cards: Add 1px solid border
- [ ] Features padding: Set to 24px 20px
- [ ] Remove all remaining hover effects
- **TEST**: Verify on 3 themes before proceeding

#### Step 1.2: Standardize Data Structure
```javascript
// Both sections MUST follow this pattern:
{
  type: 'hero|features',
  content: {
    // Common fields ALL sections must have:
    heading: '',          // Main heading
    content: '',          // Body content (HTML)
    theme_variant: 'light|dark|accent',
    layout_variant: 'left|center|right',
    
    // Section-specific fields:
    eyebrow_heading: '',  // Hero only
    buttons: [],          // Hero only
    cards: [],           // Features only
  }
}
```
- [ ] Update React components to use exact field names
- [ ] Update PHP renderer to match
- [ ] Ensure consistency between editor and frontend
- **TEST**: Save and load data correctly

#### Step 1.3: Fix Template System 🔴 CRITICAL
- [ ] Remove ALL CSS override approaches from `add_template_styles()`
- [ ] Delete any CSS with `width: 100vw`, negative margins, or `!important`
- [ ] Implement proper WordPress template structure only
- [ ] Use `template_include` filter correctly
- [ ] Create theme compatibility detection
- [ ] Test with these 5 specific themes:
  - Twenty Twenty-Four (latest default)
  - Astra (most popular free)
  - GeneratePress (developer favorite)
  - OceanWP (highly customizable)
  - Kadence (modern architecture)
- **TEST**: Verify NO CSS hacks needed on ANY theme
- **TEST**: Ensure sections display full-width without CSS tricks

#### Step 1.4: Visual Rhythm System
- [ ] Implement theme variant rotation (light→dark→accent)
- [ ] Add preview in editor
- [ ] Allow manual override
- **TEST**: Create page with alternating sections

### Phase 2: AI Data Structure Foundation (Week 2)
**ONLY PROCEED AFTER HERO & FEATURES ARE PERFECT**

#### Step 2.1: Create Consistent Field Mapping
- [ ] Document exact field structure for Hero
- [ ] Document exact field structure for Features  
- [ ] Create validation schema
- [ ] Add field validation in editor
- **TEST**: Validate all field saves correctly

#### Step 2.2: Implement Content Patterns
- [ ] Define Hero content patterns (headline, subheadline, CTA)
- [ ] Define Features patterns (benefit lists, feature grids)
- [ ] Create pattern matching rules
- **TEST**: Manually test pattern recognition

#### Step 2.3: Build Document Processor Skeleton
```php
class DocumentProcessor {
    public function mapToSections($text) {
        // Start with just Hero & Features
        return [
            $this->extractHero($text),
            $this->extractFeatures($text)
        ];
    }
}
```
- [ ] Create basic processor class
- [ ] Add Hero extraction
- [ ] Add Features extraction
- **TEST**: Process sample document

### Phase 3: Add Remaining Sections (Week 3-4)
**ONE SECTION AT A TIME - TEST AFTER EACH**

#### Step 3.1: FAQ Section
- [ ] Create React components
- [ ] Add PHP renderer
- [ ] Implement accordion functionality
- [ ] Add to AI processor
- **TEST FULLY** before next section

#### Step 3.2: Stats Section
- [ ] Create React components
- [ ] Add PHP renderer
- [ ] Implement counter animations
- [ ] Add to AI processor
- **TEST FULLY** before next section

#### Step 3.3: Testimonials Section
- [ ] Create React components
- [ ] Add PHP renderer
- [ ] Implement carousel if needed
- [ ] Add to AI processor
- **TEST FULLY** before next section

#### Step 3.4: Checklist Section
- [ ] Create React components
- [ ] Add PHP renderer
- [ ] Style checkmarks properly
- [ ] Add to AI processor
- **TEST FULLY** before next section

#### Step 3.5: Hero Form Section
- [ ] Create React components
- [ ] Add PHP renderer
- [ ] Implement form handling
- [ ] Add to AI processor
- **TEST FULLY** before proceeding

### Phase 4: AI Integration (Week 5)
**ONLY AFTER ALL SECTIONS WORK PERFECTLY**

#### Step 4.1: AI Settings Page
- [ ] Add API key configuration
- [ ] Model selection (GPT-3.5/GPT-4)
- [ ] Test connection button
- **TEST**: Verify API connection

#### Step 4.2: Document Upload UI
- [ ] Add upload button to editor
- [ ] File type validation (docx, pdf, txt)
- [ ] Progress indicator
- **TEST**: Upload various file types

#### Step 4.3: AI Processing
- [ ] Send document to AI with instructions
- [ ] Parse AI response
- [ ] Map to section structures
- [ ] Preview before applying
- **TEST**: Process 10 different documents

### Phase 5: Bulk Features (Week 6)
**FINAL PHASE - ONLY AFTER EVERYTHING ELSE WORKS**

#### Step 5.1: Bulk Template Application
- [ ] Multi-page selection UI
- [ ] Apply template to selected pages
- [ ] Progress tracking
- **TEST**: Apply to 50 pages

#### Step 5.2: Bulk Document Processing  
- [ ] Multiple file upload
- [ ] Queue system
- [ ] Batch processing
- **TEST**: Process 20 documents

## 🏗️ WordPress Standards Checklist

### Every Implementation MUST:
- [ ] Use proper WordPress hooks (no custom solutions)
- [ ] Escape all output (`esc_html()`, `esc_attr()`, `wp_kses_post()`)
- [ ] Verify nonces on all AJAX requests
- [ ] Check user capabilities (`current_user_can()`)
- [ ] Use WordPress APIs (`get_post_meta()`, `update_post_meta()`)
- [ ] Provide filters for extensibility
- [ ] Include proper PHPDoc comments
- [ ] Follow WordPress coding standards

### Template System Requirements:
```php
// CORRECT APPROACH - No CSS hacks
class TemplateLoader {
    public function load_template($template) {
        // Try theme override first
        $override = locate_template(['aisb-template.php']);
        if ($override) return $override;
        
        // Use plugin template
        return AISB_PLUGIN_DIR . 'templates/template.php';
    }
}

// WRONG APPROACH - CSS overrides
<style>
.content { width: 100vw !important; } /* NEVER DO THIS */
</style>
```

## 📋 Testing Protocol

### After EVERY Change:
1. **No Errors Check**:
   - [ ] Check PHP error log
   - [ ] Check browser console
   - [ ] Check WordPress debug.log

2. **Functionality Test**:
   - [ ] Create new section
   - [ ] Edit existing section
   - [ ] Save and reload
   - [ ] View on frontend

3. **Theme Compatibility** (Test with these 5):
   - [ ] Twenty Twenty-Four (latest default)
   - [ ] Astra (most popular free)
   - [ ] GeneratePress (developer favorite)
   - [ ] OceanWP (highly customizable)
   - [ ] Kadence (modern architecture)

4. **Responsive Check**:
   - [ ] Mobile (375px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1440px)

## 🎯 Success Metrics

### For Each Section:
- Renders correctly on all 5 test themes
- No CSS hacks or !important rules
- Proper data structure for AI
- Responsive without breakage
- Loads in under 500ms

### For Complete Plugin:
- Upload Word doc → Beautiful page in 60 seconds
- Works with ANY WordPress theme
- Handles 500+ pages without issues
- AI maps content correctly 80%+ of time
- Zero theme conflict support tickets

## 🚨 Critical Rules

### NEVER:
- Use CSS !important to force layouts
- Assume theme structure
- Skip testing after changes
- Add features before current ones work
- Use jQuery when React component exists
- Hardcode values that should be variables

### ALWAYS:
- Test incrementally
- Follow WordPress standards
- Maintain backwards compatibility
- Document complex logic
- Provide UI feedback for all actions
- Handle errors gracefully

## 📅 Realistic Timeline

### Week 1: Foundation
- Perfect Hero section
- Perfect Features section
- Fix template system

### Week 2: AI Prep
- Standardize data structures
- Create content patterns
- Build processor skeleton

### Weeks 3-4: Sections
- Add remaining 5 sections
- One at a time with full testing

### Week 5: AI Integration
- Connect to OpenAI
- Document processing
- Content mapping

### Week 6: Bulk Features
- Multi-page management
- Batch processing
- Performance optimization

### Week 7: Polish & Launch Prep
- Documentation
- Video tutorials
- Final testing
- Bug fixes

## 🔄 Version Control Strategy

### Branch Structure:
```
main
├── develop
│   ├── feature/perfect-hero-section
│   ├── feature/perfect-features-section
│   ├── feature/fix-template-system
│   ├── feature/add-faq-section
│   └── feature/ai-integration
```

### Commit Standards:
- Test before every commit
- Descriptive commit messages
- Reference issue numbers
- No commits with known bugs

## 📚 Documentation Requirements

### For Each Section:
1. Field structure documentation
2. CSS class reference
3. PHP rendering logic
4. React component props
5. AI mapping patterns

### For Plugin:
1. Installation guide
2. Quick start tutorial
3. Theme compatibility list
4. Troubleshooting guide
5. Developer documentation

## 🎯 Next Immediate Actions

1. **TODAY**: Fix Hero heading sizes (32px/48px)
2. **TODAY**: Fix Features card borders (1px solid)
3. **TEST**: Verify changes on 3 themes
4. **TOMORROW**: Standardize Hero data structure
5. **TOMORROW**: Update PHP renderer to match
6. **TEST**: Full save/load cycle

---

**Remember**: This is a production plugin that will be used on real websites. Every decision must prioritize:
1. **Reliability** - It must work every time
2. **Compatibility** - It must work everywhere  
3. **Performance** - It must work fast
4. **Maintainability** - Other developers must understand it

**Last Updated**: January 2025  
**Status**: In Development - Phase 1.1
**Next Review**: After Hero & Features sections are perfect