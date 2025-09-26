# Claude AI Assistant Instructions - AI Section Builder

## 🚨 MANDATORY: Read Before Any Work

**YOU MUST FOLLOW THESE RULES FOR EVERY SINGLE TASK**

## Critical Rules - NO EXCEPTIONS

### 1. NEVER USE CSS HACKS
- **FORBIDDEN**: Using `!important` to override theme styles
- **FORBIDDEN**: Forcing layouts with CSS overrides  
- **FORBIDDEN**: Hiding theme elements with `display: none !important`
- **WHY**: This breaks theme compatibility and is not professional

### 2. ALWAYS RESEARCH FIRST
Before implementing ANY feature:
1. Research how Elementor does it
2. Research how Divi does it
3. Research how Gutenberg does it
4. Understand WordPress best practices
5. Present multiple implementation options

### 3. NO QUICK FIXES
- Every solution must be sustainable and scalable
- No patches or bandaids
- Implement the proper solution, even if it takes longer
- Think about 2 years from now, not just today

### 4. COMPATIBILITY IS MANDATORY
Every implementation must:
- Work with ANY WordPress theme
- Not conflict with other plugins
- Follow WordPress coding standards
- Be future-proof for WordPress updates

## Before Starting ANY Task

Ask yourself and document:
1. What is the industry standard way to do this?
2. How do successful page builders handle this?
3. Will this work with all themes?
4. Is this a sustainable solution?
5. Have I researched alternatives?

## Template System Requirements

When working on frontend display:
- **NEVER** use CSS to force full-width layouts
- **ALWAYS** provide proper template files
- **OFFER** multiple display modes (canvas, contained, stretched)
- **ALLOW** themes to override templates
- **DETECT** theme compatibility issues properly

## Code Quality Standards

1. **No Magic**:
   - No hardcoded values
   - No unexplained numbers
   - Clear, self-documenting code

2. **WordPress Way**:
   - Use WordPress APIs
   - Follow WordPress patterns
   - Use proper hooks and filters

3. **Error Handling**:
   - Always handle edge cases
   - Provide graceful fallbacks
   - Never assume success

4. **Testing**:
   - Test with multiple themes
   - Test responsive design
   - Verify no console errors
   - Check PHP error logs

## Research Requirements

For any significant feature, you MUST:
1. Check how at least 3 major page builders implement it
2. Read WordPress developer documentation
3. Consider theme compatibility
4. Document your research in your response

## Implementation Process

1. **Research Phase**:
   - Study existing solutions
   - Understand best practices
   - Document findings

2. **Planning Phase**:
   - Present multiple approaches
   - Explain pros/cons
   - Get approval before coding

3. **Implementation Phase**:
   - Follow WordPress standards
   - Write clean, documented code
   - No shortcuts or hacks

4. **Testing Phase**:
   - Test with various themes
   - Verify responsive design
   - Check for conflicts

## Specific Forbidden Practices

### ❌ NEVER DO THIS:
```css
/* FORBIDDEN - CSS overrides */
.site-content { max-width: none !important; }
.entry-header { display: none !important; }

/* FORBIDDEN - Assuming theme structure */
.theme-specific-class { /* assuming this exists */ }

/* FORBIDDEN - Breaking theme layouts */
body { overflow-x: hidden !important; }
```

### ✅ ALWAYS DO THIS:
```php
// Proper template loading
locate_template( array( 'aisb-canvas.php' ), true, false );

// Theme compatibility detection
if ( $this->is_theme_compatible() ) {
    // Load appropriate template
}

// Provide options, don't force
$display_mode = get_option( 'aisb_display_mode', 'contained' );
```

## Questions to Ask Before Coding

1. Is this how Elementor/Divi would do it?
2. Will this break any themes?
3. Is there a WordPress API for this?
4. Am I making assumptions about theme structure?
5. Will this still work in WordPress 7.0?
6. Is this code self-explanatory?
7. Have I provided proper fallbacks?

## Your Commitment

**"I will NEVER implement quick fixes or CSS hacks. I will ALWAYS research industry standards and implement proper, sustainable solutions that work with any WordPress theme. Quality and compatibility over speed."**

## References to Check

- [WordPress Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Plugin Best Practices](https://developer.wordpress.org/plugins/plugin-basics/best-practices/)
- Study Elementor's GitHub for implementation patterns
- Study Gutenberg's GitHub for modern WordPress patterns

---

**Remember**: This plugin must be professional-grade. No shortcuts. No hacks. Only proper implementations that will work reliably for years to come.

---

# Section Development Standards & Checklist

## Standardized Section Structure for AI Consistency

Every section MUST follow this exact structure to enable AI pattern recognition:

```
┌─────────────────────────────────────┐
│         HEADER BLOCK                │
├─────────────────────────────────────┤
│         ITEMS BLOCK                 │  ← Only this varies between sections
├─────────────────────────────────────┤
│         FOOTER BLOCK                │
├─────────────────────────────────────┤
│         SETTINGS                    │
└─────────────────────────────────────┘
```

### Standard Field Structure (ALL Sections)

#### HEADER BLOCK (Always identical)
```javascript
{
  eyebrow_heading: '',        // Small text above main heading
  heading: '',                // Main section title
  content: '',                // Rich text content/description
  media_type: 'none',         // 'none' | 'image' | 'video'
  featured_image: '',         // Image URL when media_type is 'image'
  video_url: ''              // Video URL when media_type is 'video'
}
```

#### ITEMS BLOCK (Section-specific)
- Features: `cards` array with heading, content, image, link
- Stats: `stats` array with value, label, description
- FAQ: `questions` array with question, answer
- Testimonials: `testimonials` array with content, author, role

#### FOOTER BLOCK (Always identical)
```javascript
{
  outro_content: '',          // Rich text content after items
  buttons: [                  // Repeatable CTA buttons
    {
      text: '',
      url: '',
      style: 'primary',       // 'primary' | 'secondary' | 'ghost'
      target: '_self'         // '_self' | '_blank'
    }
  ]
}
```

#### SETTINGS (Always identical)
```javascript
{
  theme_variant: 'light',     // 'light' | 'dark'
  layout_variant: 'content-left'  // 'content-left' | 'content-right' | 'center'
}
```

## New Section Implementation Checklist

### 1. Frontend Components

#### Create Form Component
- [ ] File: `src/components/Sections/[Name]/[Name]Form.js`
- [ ] Include ALL header fields (copy from Features)
- [ ] Include section-specific items repeater
- [ ] Include ALL footer fields (copy from Features)
- [ ] Include ALL settings fields
- [ ] Use exact field names - NO variations

#### Create Preview Component
- [ ] File: `src/components/Sections/[Name]/[Name]Preview.js`
- [ ] Copy Features HTML structure exactly
- [ ] Only modify items rendering section
- [ ] Keep header/footer HTML identical

### 2. Store Integration

#### Update editorStore.js
- [ ] Add case in `getDefaultContent()`
- [ ] Include ALL standard fields
- [ ] Follow exact naming convention

### 3. Editor Integration

#### Update LeftSidebar.js
- [ ] Import form component
- [ ] Add type check and render

#### Update Canvas.js
- [ ] Import preview component
- [ ] Add type check and render

#### Update ContentImporter.js
- [ ] Add section display logic

### 4. Backend Rendering

#### Update SectionRenderer.php
- [ ] Add `render_[name]()` method
- [ ] Extract ALL standard fields
- [ ] Use consistent HTML structure
- [ ] Apply proper sanitization

### 5. Styles

#### Create section CSS
- [ ] File: `src/styles/sections/[name].css`
- [ ] Copy Features CSS as base
- [ ] Only modify items styles
- [ ] Use CSS variables for colors

#### Import CSS
- [ ] Update `src/styles/frontend.css`

### 6. Testing

- [ ] Build succeeds without errors
- [ ] Section appears in add menu
- [ ] All fields save correctly
- [ ] Preview updates in real-time
- [ ] Frontend renders properly
- [ ] Theme variants work
- [ ] Layout variants work
- [ ] Responsive design works
- [ ] Items add/remove/reorder works

## Why This Structure Matters for AI

1. **Consistent Patterns**: AI learns one structure, not many
2. **Predictable Mapping**: Document content maps to same fields
3. **Section Selection**: AI chooses correct section based on content type
4. **Reliable Output**: Same structure = predictable rendering

## Common Implementation Errors to Avoid

1. **Field Naming**: Don't rename standard fields
2. **Missing Fields**: Include ALL fields even if unused
3. **HTML Structure**: Keep identical except items block
4. **Color Hardcoding**: Always use CSS variables
5. **Sanitization**: Always sanitize in PHP
6. **Responsive**: Test all screen sizes