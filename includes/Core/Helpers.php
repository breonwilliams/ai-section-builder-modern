<?php
namespace AISB\Modern\Core;

/**
 * Helper Functions
 * 
 * Utility functions for the AI Section Builder plugin.
 * These functions provide common functionality used throughout the plugin.
 * 
 * @package AISB\Modern
 * @since 3.0.0
 */
class Helpers {
    
    /**
     * Check if a post/page has sections
     * 
     * @param int|null $post_id Post ID (defaults to current post)
     * @return bool True if has sections, false otherwise
     */
    public static function has_sections($post_id = null) {
        if (!$post_id) {
            $post_id = get_the_ID();
        }
        
        if (!$post_id) {
            return false;
        }
        
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        
        // Check if we have valid sections data
        if (!empty($sections)) {
            // If it's a JSON string, try to decode it
            if (is_string($sections)) {
                $decoded = json_decode($sections, true);
                return !empty($decoded) && is_array($decoded);
            }
            // If it's already an array
            return is_array($sections) && !empty($sections);
        }
        
        return false;
    }
    
    /**
     * Get the display mode for a post/page
     * 
     * @param int|null $post_id Post ID (defaults to current post)
     * @return string Display mode (canvas, fullwidth, or contained)
     */
    public static function get_display_mode($post_id = null) {
        if (!$post_id) {
            $post_id = get_the_ID();
        }
        
        if (!$post_id) {
            return 'fullwidth'; // Default
        }
        
        $display_mode = get_post_meta($post_id, '_aisb_display_mode', true);
        
        // Validate and sanitize
        $valid_modes = ['canvas', 'fullwidth', 'contained'];
        if (!in_array($display_mode, $valid_modes)) {
            return 'fullwidth'; // Default
        }
        
        return $display_mode;
    }
    
    /**
     * Check if canvas mode is active
     * 
     * @param int|null $post_id Post ID (defaults to current post)
     * @return bool True if canvas mode, false otherwise
     */
    public static function is_canvas_mode($post_id = null) {
        return self::get_display_mode($post_id) === 'canvas';
    }
    
    /**
     * Check if fullwidth mode is active
     * 
     * @param int|null $post_id Post ID (defaults to current post)
     * @return bool True if fullwidth mode, false otherwise
     */
    public static function is_fullwidth_mode($post_id = null) {
        return self::get_display_mode($post_id) === 'fullwidth';
    }
    
    /**
     * Check if contained mode is active
     * 
     * @param int|null $post_id Post ID (defaults to current post)
     * @return bool True if contained mode, false otherwise
     */
    public static function is_contained_mode($post_id = null) {
        return self::get_display_mode($post_id) === 'contained';
    }
    
    /**
     * Get sections for a post/page
     * 
     * @param int|null $post_id Post ID (defaults to current post)
     * @return array Array of sections or empty array
     */
    public static function get_sections($post_id = null) {
        if (!$post_id) {
            $post_id = get_the_ID();
        }
        
        if (!$post_id) {
            return [];
        }
        
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        
        if (empty($sections)) {
            return [];
        }
        
        // Decode if JSON string
        if (is_string($sections)) {
            $sections = json_decode($sections, true);
        }
        
        // Ensure we return an array
        return is_array($sections) ? $sections : [];
    }
    
    /**
     * Get available display modes
     * 
     * @return array Array of display modes with labels
     */
    public static function get_display_modes() {
        return [
            'canvas' => __('Canvas (No Header/Footer)', 'ai-section-builder'),
            'fullwidth' => __('Full Width (With Header/Footer)', 'ai-section-builder'),
            'contained' => __('Contained (Theme Layout)', 'ai-section-builder'),
        ];
    }
    
    /**
     * Check if the plugin should be active on current page
     * 
     * @return bool True if should be active, false otherwise
     */
    public static function is_aisb_active() {
        // Check if we're on a singular page/post
        if (!is_singular(['post', 'page'])) {
            return false;
        }
        
        // Check if the current post has sections
        return self::has_sections();
    }
}