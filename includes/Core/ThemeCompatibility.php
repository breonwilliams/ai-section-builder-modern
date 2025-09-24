<?php
namespace AISB\Modern\Core;

/**
 * Theme Compatibility Handler
 * 
 * Removes theme-specific constraints like page titles and containers
 * for pages using AISB templates. Uses WordPress hooks and filters
 * following industry best practices.
 * 
 * @package AISB\Modern
 * @since 3.0.0
 */
class ThemeCompatibility {
    
    /**
     * Initialize theme compatibility hooks
     */
    public function init() {
        // Apply theme fixes only when our templates are active
        add_action('template_redirect', [$this, 'remove_theme_constraints']);
    }
    
    /**
     * Remove theme-specific constraints for AISB pages
     * 
     * Only applies fixes when:
     * 1. Page has AISB sections
     * 2. Using our fullwidth or canvas template
     * 3. Not in admin area
     */
    public function remove_theme_constraints() {
        // Only apply on pages with AISB sections
        if (!$this->is_aisb_page()) {
            return;
        }
        
        // Don't apply in admin
        if (is_admin()) {
            return;
        }
        
        $theme_slug = get_template();
        
        // Apply theme-specific fixes
        switch ($theme_slug) {
            case 'oceanwp':
                $this->fix_oceanwp();
                break;
                
            case 'generatepress':
                $this->fix_generatepress();
                break;
                
            case 'astra':
                $this->fix_astra();
                break;
                
            // Add more themes as needed
            default:
                // For unknown themes, apply generic fixes
                $this->apply_generic_fixes();
                break;
        }
    }
    
    /**
     * Fix OceanWP theme issues
     * - Remove page header/title completely
     */
    private function fix_oceanwp() {
        // Remove page header entirely (includes title and breadcrumbs)
        add_filter('ocean_display_page_header', '__return_false');
        
        // Also ensure no page title in content area
        add_filter('ocean_display_page_header_heading', '__return_false');
    }
    
    /**
     * Fix GeneratePress theme issues  
     * - Remove page title
     * - Remove container constraints
     */
    private function fix_generatepress() {
        // Remove page title completely
        add_filter('generate_show_title', '__return_false');
        
        // Try to set full width content container
        add_filter('generate_sidebar_layout', [$this, 'set_full_width_layout']);
    }
    
    /**
     * Fix Astra theme issues
     * - Remove page title
     */
    private function fix_astra() {
        // Remove page title for Astra
        add_filter('astra_page_layout', [$this, 'set_astra_full_width']);
        add_filter('astra_the_title_enabled', '__return_false');
    }
    
    /**
     * Apply generic fixes for unknown themes
     */
    private function apply_generic_fixes() {
        // Generic WordPress title removal
        add_filter('the_title', [$this, 'remove_page_title_conditionally'], 10, 2);
    }
    
    /**
     * Set GeneratePress to full width layout
     * 
     * @param string $layout Current layout
     * @return string Modified layout
     */
    public function set_full_width_layout($layout) {
        // Only apply on singular pages with AISB sections
        if (is_singular() && $this->is_aisb_page()) {
            return 'no-sidebar';
        }
        return $layout;
    }
    
    /**
     * Set Astra to full width layout
     * 
     * @param string $layout Current layout  
     * @return string Modified layout
     */
    public function set_astra_full_width($layout) {
        if (is_singular() && $this->is_aisb_page()) {
            return 'page-builder';
        }
        return $layout;
    }
    
    /**
     * Remove page title conditionally for generic themes
     * 
     * @param string $title The page title
     * @param int $id The post ID
     * @return string Modified title
     */
    public function remove_page_title_conditionally($title, $id) {
        // Only remove title in main query on singular pages with AISB sections
        if (is_main_query() && is_singular() && $id === get_queried_object_id()) {
            if ($this->is_aisb_page()) {
                return '';
            }
        }
        return $title;
    }
    
    /**
     * Check if current page is using AISB
     * 
     * @return bool True if page has AISB sections
     */
    private function is_aisb_page() {
        if (!is_singular()) {
            return false;
        }
        
        $post_id = get_the_ID();
        if (!$post_id) {
            return false;
        }
        
        // Check if page has AISB sections
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        if (empty($sections)) {
            return false;
        }
        
        // Check if using our template (not canvas - canvas already works)
        $display_mode = get_post_meta($post_id, '_aisb_display_mode', true);
        return in_array($display_mode, ['fullwidth', 'contained']);
    }
    
    /**
     * Get current theme information for debugging
     * 
     * @return array Theme info
     */
    public function get_theme_info() {
        $theme = wp_get_theme();
        return [
            'name' => $theme->get('Name'),
            'slug' => get_template(),
            'version' => $theme->get('Version'),
            'parent' => is_child_theme() ? get_template() : null,
        ];
    }
    
    /**
     * Check if theme is supported
     * 
     * @param string $theme_slug Theme template slug
     * @return bool True if theme has specific compatibility
     */
    public function is_theme_supported($theme_slug = null) {
        if (!$theme_slug) {
            $theme_slug = get_template();
        }
        
        $supported_themes = [
            'oceanwp',
            'generatepress', 
            'astra',
            'twentytwentyfour',
            'kadence',
        ];
        
        return in_array($theme_slug, $supported_themes);
    }
}