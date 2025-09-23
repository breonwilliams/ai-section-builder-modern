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
        // Set default options
        if (!get_option('aisb_global_settings')) {
            add_option('aisb_global_settings', [
                'primary_color' => '#2563eb',
                'secondary_color' => '#1e40af',
                'text_color' => '#1f2937',
                'background_color' => '#ffffff',
            ]);
        }
        
        // Flush rewrite rules for REST API
        flush_rewrite_rules();
    }
}