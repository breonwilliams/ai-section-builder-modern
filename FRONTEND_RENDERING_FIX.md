# CRITICAL: Frontend Rendering Implementation Guide

## 🔴 CRITICAL ISSUE: Sections Are Not Displaying on Frontend

The modern plugin is **completely missing the frontend rendering system**. Sections are saved to the database but **never displayed on the actual pages**. This document provides exact implementation instructions to fix this critical issue.

## Problem Analysis

### What's Missing:
1. **No Template Handler** - No system to override page templates or inject sections
2. **No Section Renderer** - No PHP code to convert saved JSON to HTML
3. **No Content Filter** - No WordPress hooks to display sections
4. **CSS Issues** - Design doesn't match reference implementation

### What Exists (Reference Plugin):
- `/includes/core/class-template-handler.php` - Overrides templates and renders sections
- `/includes/section-wrappers.php` - PHP functions that render each section type
- `/includes/sections/class-hero-section.php` - PHP class that generates HTML

## Required Implementation

### Step 1: Create Template Handler System

Create `/includes/Core/TemplateHandler.php`:

```php
<?php
namespace AISB\Modern\Core;

class TemplateHandler {
    public function init() {
        // Hook into WordPress content display
        add_filter('the_content', [$this, 'render_sections_content'], 10);
        add_filter('body_class', [$this, 'add_body_class']);
    }
    
    public function render_sections_content($content) {
        // Only on singular posts/pages, not in admin
        if (!is_singular(['post', 'page']) || is_admin()) {
            return $content;
        }
        
        $post_id = get_the_ID();
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        
        if (empty($sections)) {
            return $content;
        }
        
        // Render sections
        $renderer = new SectionRenderer();
        $sections_html = '';
        
        foreach ($sections as $section) {
            $sections_html .= $renderer->render_section($section);
        }
        
        // Replace content with sections (like Elementor does)
        return $sections_html;
    }
    
    public function add_body_class($classes) {
        if (is_singular() && get_post_meta(get_the_ID(), '_aisb_sections', true)) {
            $classes[] = 'aisb-active';
        }
        return $classes;
    }
}
```

### Step 2: Create Section Renderer

Create `/includes/Core/SectionRenderer.php`:

```php
<?php
namespace AISB\Modern\Core;

class SectionRenderer {
    public function render_section($section) {
        if (empty($section['type'])) {
            return '';
        }
        
        $type = $section['type'];
        $content = isset($section['content']) ? $section['content'] : [];
        
        // Route to appropriate renderer
        switch ($type) {
            case 'hero':
                return $this->render_hero($content);
            case 'features':
                return $this->render_features($content);
            default:
                return '';
        }
    }
    
    private function render_hero($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? '');
        $body = wp_kses_post($content['content'] ?? '');
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        $buttons = $content['buttons'] ?? [];
        
        // Build HTML
        $classes = "aisb-section aisb-hero aisb-section--{$theme} aisb-section--{$layout}";
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-hero__container">
                <div class="aisb-hero__content">
                    <?php if ($eyebrow): ?>
                        <div class="aisb-hero__eyebrow"><?php echo $eyebrow; ?></div>
                    <?php endif; ?>
                    
                    <?php if ($heading): ?>
                        <h1 class="aisb-hero__heading"><?php echo $heading; ?></h1>
                    <?php endif; ?>
                    
                    <?php if ($body): ?>
                        <div class="aisb-hero__body"><?php echo $body; ?></div>
                    <?php endif; ?>
                    
                    <?php if (!empty($buttons)): ?>
                        <div class="aisb-hero__buttons">
                            <?php foreach ($buttons as $button): ?>
                                <a href="<?php echo esc_url($button['url'] ?? '#'); ?>" 
                                   class="aisb-btn aisb-btn-<?php echo esc_attr($button['style'] ?? 'primary'); ?>">
                                    <?php echo esc_html($button['text'] ?? 'Button'); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <?php if ($media_type !== 'none'): ?>
                    <div class="aisb-hero__media">
                        <?php if ($media_type === 'image' && $image): ?>
                            <img src="<?php echo $image; ?>" alt="<?php echo esc_attr($heading); ?>" class="aisb-hero__image">
                        <?php elseif ($media_type === 'video' && $video): ?>
                            <?php echo $this->render_video_embed($video); ?>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    private function render_features($content) {
        // Similar structure for features section
        $heading = esc_html($content['heading'] ?? '');
        $body = wp_kses_post($content['content'] ?? '');
        $cards = $content['cards'] ?? [];
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        
        $classes = "aisb-section aisb-features aisb-section--{$theme}";
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-features__container">
                <div class="aisb-features__top">
                    <div class="aisb-features__content">
                        <?php if ($heading): ?>
                            <h2 class="aisb-features__heading"><?php echo $heading; ?></h2>
                        <?php endif; ?>
                        <?php if ($body): ?>
                            <div class="aisb-features__body"><?php echo $body; ?></div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <?php if (!empty($cards)): ?>
                    <div class="aisb-features__grid">
                        <?php foreach ($cards as $card): ?>
                            <div class="aisb-features__item">
                                <?php if (!empty($card['image'])): ?>
                                    <div class="aisb-features__item-image-wrapper">
                                        <img src="<?php echo esc_url($card['image']); ?>" 
                                             alt="<?php echo esc_attr($card['heading'] ?? ''); ?>"
                                             class="aisb-features__item-image">
                                    </div>
                                <?php endif; ?>
                                <div class="aisb-features__item-content">
                                    <?php if (!empty($card['heading'])): ?>
                                        <h3 class="aisb-features__item-title"><?php echo esc_html($card['heading']); ?></h3>
                                    <?php endif; ?>
                                    <?php if (!empty($card['content'])): ?>
                                        <p class="aisb-features__item-description"><?php echo esc_html($card['content']); ?></p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    private function render_video_embed($url) {
        // Extract YouTube ID
        if (preg_match('/youtube\.com\/watch\?v=([^&]+)/', $url, $matches) || 
            preg_match('/youtu\.be\/([^?]+)/', $url, $matches)) {
            $video_id = $matches[1];
            return '<iframe class="aisb-hero__video" src="https://www.youtube.com/embed/' . $video_id . '" frameborder="0" allowfullscreen></iframe>';
        }
        return '';
    }
}
```

### Step 3: Update Plugin.php to Initialize Template Handler

Modify `/includes/Core/Plugin.php` - Add these lines in the `init_hooks()` method:

```php
// Add after line 28 (after loading dependencies)
require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/TemplateHandler.php';
require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/SectionRenderer.php';

// Add after line 37 (after editor template init)
// Frontend rendering
$template_handler = new \AISB\Modern\Core\TemplateHandler();
$template_handler->init();
```

### Step 4: Fix Frontend Asset Loading

The current `Assets.php` checks for sections but they're saved as JSON. Update the `should_load_frontend_assets()` method:

```php
private function should_load_frontend_assets() {
    if (is_singular()) {
        global $post;
        if ($post) {
            $sections = get_post_meta($post->ID, '_aisb_sections', true);
            // Check if we have valid sections data
            return !empty($sections) && (is_array($sections) || is_string($sections));
        }
    }
    return false;
}
```

### Step 5: Create Frontend CSS Build

The frontend needs its own CSS file. Create `/src/styles/frontend.css`:

```css
/* Frontend styles - imports only what's needed for rendering */
@import './tokens/section-tokens.css';
@import './sections/hero.css';
@import './sections/features.css';
```

Update webpack config to build frontend.css separately.

## CSS Fixes Required

### Hero Section (`/src/styles/sections/hero.css`)

Current issues:
- Font sizes too small (using clamp with text-3xl to text-5xl)
- Should be: Mobile 32px → Desktop 48px (matching reference)

Fix:
```css
.aisb-hero__heading {
    font-size: 32px; /* Mobile first */
}

@media (min-width: 768px) {
    .aisb-hero__heading {
        font-size: 48px; /* Desktop */
    }
}
```

### Features Section (`/src/styles/sections/features.css`)

Current issues:
- Missing proper card borders
- Wrong card background
- No 16:9 aspect ratio for images
- Wrong padding

Fix:
```css
.aisb-features__item {
    border: 1px solid var(--aisb-color-border);
    background: var(--aisb-color-surface);
    border-radius: 8px;
    overflow: hidden;
}

.aisb-features__item-image-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aisb-features__item-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.aisb-features__item-content {
    padding: 24px 20px;
}
```

## Testing Checklist

After implementing:

1. **Create a test page** with sections in the editor
2. **View the page on frontend** - Sections should display
3. **Check responsive design** - Mobile and desktop should look correct
4. **Test light/dark themes** - Both variants should work
5. **Check media display** - Images and videos should render
6. **Verify card layout** - Features cards should have borders and proper spacing

## Critical Notes

1. **Server-side rendering is required** - The frontend cannot use React components
2. **Must escape all output** - Use `esc_html()`, `esc_attr()`, `wp_kses_post()`
3. **CSS must be loaded on frontend** - Currently only editor.css is built
4. **Match reference plugin patterns** - Follow the working implementation

## File Structure After Implementation

```
/includes/Core/
├── Plugin.php (updated)
├── Assets.php (updated)
├── TemplateHandler.php (NEW)
└── SectionRenderer.php (NEW)

/src/styles/
├── frontend.css (NEW)
├── sections/
│   ├── hero.css (updated)
│   └── features.css (updated)
```

## Immediate Action Required

**This is preventing the plugin from functioning at all on the frontend.** Without these changes, users can create sections but they will never see them on their website. This should be the #1 priority.

---

Last Updated: January 2025
Status: CRITICAL - Plugin non-functional without these changes