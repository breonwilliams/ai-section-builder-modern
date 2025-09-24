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