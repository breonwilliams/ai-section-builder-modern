# Global Settings Implementation Plan

## Overview
This document outlines the phased implementation of Global Settings for the AI Section Builder plugin, with a focus on color customization and future extensibility.

## Architecture
- **Frontend**: React components with Zustand state management
- **Backend**: WordPress REST API with options storage
- **Styling**: CSS custom properties (variables) for live preview

## Implementation Status

### ✅ Phase 1: Core Infrastructure (COMPLETE)
- Global Settings UI component
- State management in editorStore
- REST API endpoints for save/load
- CSS variable injection system
- Reset to defaults functionality

### ✅ Phase 2: Basic Colors (COMPLETE)
**Initially Implemented:**
- Primary Color (#3B82F6)
- Secondary Color (#8B5CF6)  
- Text Color (#1f2937)
- Background Color (#ffffff)

### ✅ Phase 3: Extended Color System (COMPLETE)
**Currently Implemented - 8 User-Controllable Colors:**

**Brand Colors:**
1. **Primary Color** (#3B82F6 - Blue)
   - Used for: Primary buttons, links, key CTAs
   - CSS Variable: `--aisb-color-primary`
   
2. **Secondary Color** (#8B5CF6 - Purple)
   - Used for: Secondary buttons, accent elements
   - CSS Variable: `--aisb-color-secondary`

**Light Mode Colors:**   
3. **Text Color** (#1f2937 - Dark Gray)
   - Used for: All text content in light mode
   - CSS Variable: `--aisb-color-text`
   - Derived: Text muted (70% opacity), borders (15% opacity)
   
4. **Background Color** (#ffffff - White)
   - Used for: Section backgrounds in light mode
   - CSS Variable: `--aisb-color-background`
   
5. **Surface Color** (#f9fafb - Light Gray)
   - Used for: Card backgrounds, panels in light mode
   - CSS Variable: `--aisb-color-surface`

**Dark Mode Colors:**
6. **Dark Background** (#1a1a1a - Very Dark)
   - Used for: Section backgrounds in dark mode
   - CSS Variable: `--aisb-color-dark-background`
   
7. **Dark Surface** (#2a2a2a - Dark Gray)
   - Used for: Card backgrounds in dark mode
   - CSS Variable: `--aisb-color-dark-surface`
   
8. **Dark Text** (#fafafa - Near White)
   - Used for: All text content in dark mode
   - CSS Variable: `--aisb-color-dark-text`
   - Derived: Dark text muted (70% opacity), dark borders (15% opacity)

## Future Implementation Phases

### ✅ Derived Colors (Auto-Generated)
**These are automatically calculated from user colors:**
- **Text Muted**: 70% opacity of Text Color
- **Border**: 15% opacity of Text Color
- **Divider**: 10% opacity of Text Color
- **Dark Text Muted**: 70% opacity of Dark Text Color
- **Dark Border**: 15% opacity of Dark Text Color
- **Dark Divider**: 10% opacity of Dark Text Color

### 📋 Phase 4: Typography Settings (Future)
**Font Customization:**
- Font Family (Heading)
- Font Family (Body)
- Base Font Size
- Line Height Scale

### 📋 Phase 5: Spacing System (Future)
**Layout Control:**
- Section Padding Scale
- Container Max Width
- Content Spacing Multiplier
- Mobile Responsive Adjustments

### 📋 Phase 6: Advanced Theming (Future)
**Theme Presets:**
- Pre-built color schemes
- Dark mode overrides
- Import/Export settings
- Per-page overrides

## Technical Implementation Details

### Files Structure
```
src/
├── components/
│   ├── Editor/
│   │   └── GlobalSettings.js    # Main settings UI
│   └── UI/
│       └── ColorPicker.js       # Reusable color picker
├── stores/
│   └── editorStore.js          # State management
└── styles/
    ├── components/
    │   └── global-settings.css  # Settings UI styles
    └── tokens/
        └── section-tokens.css   # CSS variables

includes/
├── API/
│   └── RestAPI.php             # REST endpoints
├── Core/
│   ├── Assets.php              # Frontend CSS injection
│   └── Activator.php           # Default values
```

### Data Flow
1. User changes color in GlobalSettings component
2. Update sent to editorStore
3. CSS variables updated immediately (live preview)
4. Save button triggers REST API call
5. Settings saved to WordPress options table
6. Frontend loads settings and applies CSS variables

### CSS Variable System
All colors are applied using CSS custom properties:
```css
:root {
  --aisb-color-primary: #3B82F6;
  --aisb-color-secondary: #8B5CF6;
  --aisb-color-text: #1f2937;
  --aisb-color-background: #ffffff;
}
```

### Database Storage
Settings stored in WordPress options table:
- Option name: `aisb_global_settings`
- Format: Serialized array
- Sanitization: `sanitize_hex_color()` for all color values

## Key Design Decisions

### 1. No Color Variants
- Removed brightness adjustments for simplicity
- Same colors used in light and dark modes
- Hover effects use CSS filters instead of color math

### 2. Incremental Rollout
- Start with essential colors only
- Add features based on user needs
- Maintain backward compatibility

### 3. Live Preview
- Changes apply immediately in editor
- No page refresh required
- Save commits to database

### 4. Reset Functionality
- One-click reset to defaults
- Helps users recover from mistakes
- Defaults are documented constants

## Default Color Palette

| Setting | Default Value | Usage |
|---------|--------------|-------|
| Primary | #3B82F6 | Buttons, links, CTAs |
| Secondary | #8B5CF6 | Secondary actions, accents |
| Text | #1f2937 | Main content text |
| Background | #ffffff | Section backgrounds |
| Text Secondary | #4b5563 | Subtitles, descriptions |
| Text Muted | #6b7280 | Helper text, captions |
| Border | #e5e7eb | Element borders |
| Surface | #ffffff | Cards, panels |

## Testing Checklist

### Color Changes
- [ ] Colors update in live preview
- [ ] Colors persist after save
- [ ] Colors apply to frontend
- [ ] Reset restores defaults
- [ ] Invalid colors are rejected

### Cross-browser
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

### Responsive
- [ ] Mobile view maintains colors
- [ ] Tablet view maintains colors
- [ ] Desktop view maintains colors

## Known Limitations
1. No per-page overrides (global only)
2. No color picker presets
3. No import/export functionality
4. No undo/redo for changes

## Future Enhancements
1. **Color Presets**: Professional, Vibrant, Minimal themes
2. **Advanced Picker**: Palette suggestions, contrast checker
3. **Export/Import**: Share settings between sites
4. **History**: Undo/redo color changes
5. **A11y**: Contrast ratio warnings
6. **Gradients**: Support for gradient backgrounds

## Support & Maintenance
- Settings auto-migrate on plugin updates
- Backward compatible with older sections
- Defaults always available as fallback
- CSS variables provide single source of truth

---

*Last Updated: Current Session*
*Version: 1.0*