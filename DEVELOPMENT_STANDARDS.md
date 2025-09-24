# AI Section Builder - Development Standards & Best Practices

## 🚨 CRITICAL: Read This Before Any Development

This document defines mandatory standards for all development on the AI Section Builder plugin. These are not suggestions - they are requirements to ensure plugin longevity, compatibility, and maintainability.

## Core Development Principles

### 1. NO SHORTCUTS - EVER
- **Never use CSS `!important` to override theme styles** - This breaks theme compatibility
- **Never use quick patches** - Always implement the proper solution
- **Never hardcode values** - Use configuration and filters
- **Never assume theme structure** - Themes vary wildly in implementation

### 2. WordPress Coding Standards
- Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- Use WordPress APIs and hooks properly
- Implement proper sanitization and escaping
- Follow the WordPress way, not the quick way

### 3. Compatibility First
- **Must work with ANY WordPress theme** without CSS hacks
- **Must respect theme styles** while achieving our layout goals
- **Must not conflict with other plugins** (Elementor, Divi, Gutenberg, etc.)
- **Must be future-proof** for WordPress updates

## Template Override Best Practices

### ❌ WRONG APPROACH (What NOT to do):
```php
// DON'T use CSS to force layouts
.content-area { 
    max-width: none !important; /* NEVER DO THIS */
}

// DON'T assume theme structure
.entry-content { 
    display: none !important; /* BREAKS THEMES */
}
```

### ✅ CORRECT APPROACH:
```php
// 1. Provide multiple template loading methods
// 2. Use theme template hierarchy
// 3. Provide fallbacks for compatibility
// 4. Use WordPress template tags properly
// 5. Allow themes to override our templates
```

## Implementation Standards

### 1. Template System Requirements
- **Primary Method**: Use WordPress template hierarchy
- **Provide theme overrides**: Allow themes to customize our templates
- **Multiple display modes**:
  - Full Width Canvas (complete template override)
  - Contained (works within theme layout)
  - Stretched (full width within content area)
- **Compatibility modes**: Detect theme and adjust automatically

### 2. File Organization
```
/templates/              # User-overridable templates
├── canvas.php          # Full width template
├── contained.php       # Theme-contained template
└── single-section.php  # Individual section template

/includes/
├── compatibility/      # Theme-specific compatibility
│   ├── class-theme-detector.php
│   ├── themes/        # Theme-specific adjustments
│   │   ├── twentytwentyfour.php
│   │   ├── astra.php
│   │   └── generatepress.php
```

### 3. Hook Priority Standards
- Template filters: 999 (late to override themes)
- Content filters: 10 (standard priority)
- Asset enqueuing: 10 (standard priority)
- Init hooks: 0 (early initialization)

### 4. JavaScript Standards
- Use WordPress JavaScript APIs (wp.data, wp.element)
- Implement proper state management
- No inline JavaScript in PHP files
- Use wp_localize_script for PHP-to-JS data

### 5. CSS Architecture
- Use CSS custom properties for theming
- Namespace all classes with `aisb-` prefix
- Never use `!important` except for user overrides
- Provide scoped styles that don't leak

## Testing Requirements

Before ANY implementation:
1. Test with at least 5 popular themes:
   - Twenty Twenty-Four (block theme)
   - Astra
   - GeneratePress  
   - OceanWP
   - Kadence

2. Test with popular page builders installed (deactivated):
   - Elementor
   - Divi
   - Beaver Builder
   - WPBakery

3. Verify no JavaScript errors in console
4. Verify no PHP warnings or errors
5. Check responsive design on all breakpoints

## Decision Making Framework

When implementing any feature, ask:

1. **Is this the WordPress way?** 
   - Use WordPress APIs, not custom solutions
   - Follow WordPress patterns and conventions

2. **Will this work with ANY theme?**
   - No assumptions about theme structure
   - Provide fallbacks and compatibility modes

3. **Is this maintainable?**
   - Clear code with proper documentation
   - No magic numbers or unclear logic
   - Will another developer understand this?

4. **Is this future-proof?**
   - Will it work with WordPress 6.x, 7.x?
   - Does it follow deprecated patterns?
   - Is it using modern WordPress APIs?

5. **Have I researched industry standards?**
   - How does Elementor handle this?
   - How does Gutenberg handle this?
   - What's the accepted best practice?

## Required Research Before Implementation

For any significant feature:

1. **Research how established plugins do it**:
   - Elementor's implementation
   - Divi's approach
   - Gutenberg's method
   - Beaver Builder's solution

2. **Check WordPress Core discussions**:
   - WordPress.org developer resources
   - Core tickets related to the feature
   - Gutenberg GitHub issues

3. **Consider multiple approaches**:
   - Document at least 3 possible implementations
   - List pros/cons of each
   - Choose based on compatibility, not speed

## Code Review Checklist

Before committing any code:

- [ ] No CSS `!important` rules (except user overrides)
- [ ] No hardcoded values
- [ ] Proper sanitization and escaping
- [ ] WordPress coding standards followed
- [ ] Tested with 5+ themes
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Code is self-documenting
- [ ] Proper error handling
- [ ] Graceful fallbacks implemented

## Template Override Implementation Guide

### Modern Best Practice for Full-Width Sections:

1. **Offer Multiple Display Modes** (User Choice):
   ```php
   - Canvas Mode: Full template override
   - Contained Mode: Within theme content
   - Stretched Mode: Full width in content area
   ```

2. **Use Template Hierarchy Properly**:
   ```php
   // Allow themes to override
   locate_template()
   get_template_part()
   ```

3. **Provide Theme Integration**:
   ```php
   // Detect theme and load compatibility
   Theme_Compatibility::load_theme_support()
   ```

4. **Never Force Layouts with CSS**:
   ```php
   // Wrong: CSS overrides
   // Right: Proper template structure
   ```

## Version Control Standards

- Semantic versioning (MAJOR.MINOR.PATCH)
- Detailed commit messages explaining WHY, not just what
- Never commit untested code
- Document breaking changes

## Performance Standards

- Lazy load assets (only load when needed)
- Minimize database queries
- Use WordPress transients for caching
- Optimize images and assets
- Profile code for performance issues

## Security Standards

- Validate all input
- Sanitize all output
- Use nonces for all forms
- Capability checks for all actions
- Regular security audits

## Documentation Requirements

Every file must include:
- File purpose and description
- @since version tag
- @package declaration
- Clear inline comments for complex logic

## Remember: Quality Over Speed

**It's better to take longer and implement properly than to create technical debt with quick fixes.**

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: MANDATORY - All development must follow these standards