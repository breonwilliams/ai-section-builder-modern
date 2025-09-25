<?php
namespace AISB\Modern\Core;

/**
 * Plugin activation handler
 */
class Activator {
    
    /**
     * Run on plugin activation
     */
    public static function activate() {
        // Set default options - matching JavaScript defaults
        if (!get_option('aisb_global_settings')) {
            add_option('aisb_global_settings', [
                'primary_color' => '#3B82F6',      // Blue
                'secondary_color' => '#8B5CF6',    // Purple
                'text_color' => '#1f2937',         // Dark gray text
                'muted_text_color' => '#6b7280',   // Muted text
                'background_color' => '#ffffff',   // White background
                'surface_color' => '#f9fafb',      // Light gray surface
                'dark_background' => '#1a1a1a',    // Dark background
                'dark_surface' => '#2a2a2a',       // Dark surface
                'dark_text' => '#fafafa',          // Light text for dark mode
                'dark_muted_text' => '#9ca3af',    // Dark muted text
            ]);
        }
        
        // Flush rewrite rules for REST API
        flush_rewrite_rules();
    }
}