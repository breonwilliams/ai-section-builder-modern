<?php
namespace AISB\Modern\Core;

/**
 * Assets handler
 */
class Assets {
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our editor page (now a hidden submenu page)
        if ($hook !== 'admin_page_aisb-editor') {
            return;
        }
        
        // Get asset files from build directory
        $asset_file = AISB_MODERN_PLUGIN_DIR . 'build/editor.asset.php';
        
        if (file_exists($asset_file)) {
            $asset = require $asset_file;
        } else {
            // Default values if build hasn't run yet
            $asset = [
                'dependencies' => ['wp-element'],
                'version' => AISB_MODERN_VERSION,
            ];
        }
        
        // Enqueue editor script
        wp_enqueue_script(
            'aisb-editor',
            AISB_MODERN_PLUGIN_URL . 'build/editor.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );
        
        // Enqueue editor styles with proper token loading order
        // Note: Design tokens are imported within editor.css for proper cascade
        // This ensures tokens load before component styles
        wp_enqueue_style(
            'aisb-editor',
            AISB_MODERN_PLUGIN_URL . 'build/editor.css',
            [], // Remove wp-components dependency to avoid style conflicts
            $asset['version']
        );
        
        // Add inline styles for critical CSS variable fallbacks
        $inline_css = '
            /* Critical fallback values to ensure editor always renders */
            .aisb-editor {
                --aisb-editor-accent: #667EEA;
                --aisb-editor-bg-base: #09111A;
                --aisb-editor-bg-surface: #0F1823;
                --aisb-editor-text-primary: #E8EAED;
            }
        ';
        wp_add_inline_style('aisb-editor', $inline_css);
        
        // Enqueue WordPress media library
        wp_enqueue_media();
        
        // Note: Script localization is handled by EditorTemplate for isolated editor
        // This fallback is only used if the editor is accessed in non-isolated mode
        if (!did_action('aisb_editor_template_init')) {
            wp_localize_script('aisb-editor', 'aisbEditor', [
                'apiUrl' => rest_url('ai-section-builder/v1/'),
                'nonce' => wp_create_nonce('wp_rest'),
                'postId' => isset($_GET['post_id']) ? intval($_GET['post_id']) : 0,
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'pluginUrl' => AISB_MODERN_PLUGIN_URL,
                'isAdmin' => true,
            ]);
        }
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        // Check if we need to load frontend assets
        if (!$this->should_load_frontend_assets()) {
            return;
        }
        
        // Get asset files from build directory
        $asset_file = AISB_MODERN_PLUGIN_DIR . 'build/frontend.asset.php';
        
        if (file_exists($asset_file)) {
            $asset = require $asset_file;
        } else {
            $asset = [
                'dependencies' => [],
                'version' => AISB_MODERN_VERSION,
            ];
        }
        
        // Enqueue frontend styles
        wp_enqueue_style(
            'aisb-frontend',
            AISB_MODERN_PLUGIN_URL . 'build/frontend.css',
            [],
            $asset['version']
        );
        
        // Add global settings as CSS variables
        $global_settings = get_option('aisb_global_settings', [
            'primary_color' => '#3B82F6',
            'secondary_color' => '#8B5CF6',
            'text_color' => '#1f2937',
            'background_color' => '#ffffff',
            'surface_color' => '#f9fafb',
            'dark_background' => '#1a1a1a',
            'dark_surface' => '#2a2a2a',
            'dark_text' => '#fafafa',
        ]);
        
        // Generate CSS with custom properties
        $custom_css = ':root {';
        if (!empty($global_settings['primary_color'])) {
            $custom_css .= '--aisb-color-primary: ' . esc_attr($global_settings['primary_color']) . ';';
        }
        if (!empty($global_settings['secondary_color'])) {
            $custom_css .= '--aisb-color-secondary: ' . esc_attr($global_settings['secondary_color']) . ';';
        }
        if (!empty($global_settings['text_color'])) {
            $custom_css .= '--aisb-color-text: ' . esc_attr($global_settings['text_color']) . ';';
            // Generate derived colors from text color
            $rgb = $this->hex_to_rgb($global_settings['text_color']);
            if ($rgb) {
                $custom_css .= '--aisb-color-text-muted: rgba(' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', 0.7);';
                $custom_css .= '--aisb-color-border: rgba(' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', 0.15);';
                $custom_css .= '--aisb-color-divider: rgba(' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', 0.1);';
            }
        }
        if (!empty($global_settings['background_color'])) {
            $custom_css .= '--aisb-color-background: ' . esc_attr($global_settings['background_color']) . ';';
        }
        if (!empty($global_settings['surface_color'])) {
            $custom_css .= '--aisb-color-surface: ' . esc_attr($global_settings['surface_color']) . ';';
        }
        if (!empty($global_settings['dark_background'])) {
            $custom_css .= '--aisb-color-dark-background: ' . esc_attr($global_settings['dark_background']) . ';';
        }
        if (!empty($global_settings['dark_surface'])) {
            $custom_css .= '--aisb-color-dark-surface: ' . esc_attr($global_settings['dark_surface']) . ';';
        }
        if (!empty($global_settings['dark_text'])) {
            $custom_css .= '--aisb-color-dark-text: ' . esc_attr($global_settings['dark_text']) . ';';
            // Generate derived colors from dark text color
            $rgb = $this->hex_to_rgb($global_settings['dark_text']);
            if ($rgb) {
                $custom_css .= '--aisb-color-dark-text-muted: rgba(' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', 0.7);';
                $custom_css .= '--aisb-color-dark-border: rgba(' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', 0.15);';
                $custom_css .= '--aisb-color-dark-divider: rgba(' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', 0.1);';
            }
        }
        $custom_css .= '}';
        
        // Add the custom CSS inline
        wp_add_inline_style('aisb-frontend', $custom_css);
        
        // Enqueue frontend script (for interactions like FAQ accordion)
        wp_enqueue_script(
            'aisb-frontend',
            AISB_MODERN_PLUGIN_URL . 'build/frontend.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );
    }
    
    /**
     * Convert hex color to RGB
     */
    private function hex_to_rgb($hex) {
        $hex = ltrim($hex, '#');
        
        if (strlen($hex) == 3) {
            $r = hexdec(substr($hex, 0, 1).substr($hex, 0, 1));
            $g = hexdec(substr($hex, 1, 1).substr($hex, 1, 1));
            $b = hexdec(substr($hex, 2, 1).substr($hex, 2, 1));
        } else if (strlen($hex) == 6) {
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
        } else {
            return false;
        }
        
        return array('r' => $r, 'g' => $g, 'b' => $b);
    }
    
    /**
     * Check if frontend assets should be loaded
     */
    private function should_load_frontend_assets() {
        // Check if current post/page has sections
        if (is_singular()) {
            global $post;
            if ($post) {
                $sections = get_post_meta($post->ID, '_aisb_sections', true);
                // Check if we have valid sections data (array or JSON string)
                return !empty($sections) && (is_array($sections) || is_string($sections));
            }
        }
        
        return false;
    }
}