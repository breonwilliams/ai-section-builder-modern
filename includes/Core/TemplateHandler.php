<?php
namespace AISB\Modern\Core;

/**
 * Template Handler for frontend rendering
 * 
 * Handles template overrides for pages with sections using
 * proper WordPress template hierarchy and industry best practices.
 * No CSS hacks - uses actual template files like Elementor/Divi.
 * 
 * @package AISB\Modern
 * @since 3.0.0
 */
class TemplateHandler {
    
    /**
     * Initialize hooks
     */
    public function init() {
        // Use template_include for proper template override (late priority)
        add_filter('template_include', [$this, 'template_override'], 999);
        
        // Add body classes for styling
        add_filter('body_class', [$this, 'add_body_class']);
        
        // Hide theme's page title when our templates are active
        add_action('wp_head', [$this, 'add_template_styles']);
    }
    
    /**
     * Override template for pages with AISB sections
     * 
     * @param string $template Current template path
     * @return string Modified template path
     */
    public function template_override($template) {
        // Only on singular posts/pages
        if (!is_singular(['post', 'page'])) {
            return $template;
        }
        
        // Don't override in admin
        if (is_admin()) {
            return $template;
        }
        
        $post_id = get_the_ID();
        
        // Check if this page has sections
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        if (empty($sections)) {
            return $template;
        }
        
        // Get the selected display mode (default to fullwidth)
        $display_mode = get_post_meta($post_id, '_aisb_display_mode', true);
        if (empty($display_mode)) {
            $display_mode = 'fullwidth'; // Default mode
        }
        
        // Get the appropriate template file
        $custom_template = $this->get_template_path($display_mode);
        
        if ($custom_template && file_exists($custom_template)) {
            return $custom_template;
        }
        
        // Fallback to original template if ours doesn't exist
        return $template;
    }
    
    /**
     * Get the path to our template file
     * 
     * @param string $display_mode The display mode (canvas, fullwidth, contained)
     * @return string|false Template path or false if not found
     */
    private function get_template_path($display_mode) {
        // Sanitize display mode
        $display_mode = sanitize_key($display_mode);
        
        // Valid display modes
        $valid_modes = ['canvas', 'fullwidth', 'contained'];
        if (!in_array($display_mode, $valid_modes)) {
            $display_mode = 'fullwidth';
        }
        
        // Allow themes to override our templates
        // Theme can place template in their theme folder as 'aisb-canvas.php' etc.
        $theme_template = locate_template(["aisb-{$display_mode}.php"]);
        if ($theme_template) {
            return $theme_template;
        }
        
        // Use our plugin template
        $plugin_template = AISB_MODERN_PLUGIN_DIR . "templates/{$display_mode}.php";
        if (file_exists($plugin_template)) {
            return $plugin_template;
        }
        
        return false;
    }
    
    /**
     * Add body classes for styling
     * 
     * @param array $classes Existing body classes
     * @return array Modified body classes
     */
    public function add_body_class($classes) {
        if (is_singular() && get_post_meta(get_the_ID(), '_aisb_sections', true)) {
            $classes[] = 'aisb-active';
            
            // Add display mode class
            $display_mode = get_post_meta(get_the_ID(), '_aisb_display_mode', true);
            if ($display_mode) {
                $classes[] = 'aisb-mode-' . sanitize_html_class($display_mode);
            }
        }
        return $classes;
    }
    
    /**
     * Add styles to hide theme elements when needed
     * Only for fullwidth mode - canvas mode doesn't need this
     */
    public function add_template_styles() {
        if (!is_singular()) {
            return;
        }
        
        $post_id = get_the_ID();
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        if (empty($sections)) {
            return;
        }
        
        $display_mode = get_post_meta($post_id, '_aisb_display_mode', true);
        
        // Only add styles for fullwidth mode
        if ($display_mode === 'fullwidth') {
            ?>
            <style id="aisb-template-styles">
                /* Hide theme's page title in fullwidth mode */
                .aisb-mode-fullwidth .entry-header,
                .aisb-mode-fullwidth .page-header,
                .aisb-mode-fullwidth h1.entry-title {
                    display: none;
                }
                
                /* Ensure full width wrapper takes full viewport width */
                .aisb-fullwidth-wrapper {
                    width: 100vw;
                    position: relative;
                    left: 50%;
                    right: 50%;
                    margin-left: -50vw;
                    margin-right: -50vw;
                }
                
                /* Ensure our sections display properly */
                .aisb-section {
                    width: 100%;
                    position: relative;
                }
            </style>
            <?php
        }
    }
}