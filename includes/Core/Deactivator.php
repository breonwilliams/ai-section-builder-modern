<?php
namespace AISB\Modern\Core;

/**
 * Plugin deactivation handler
 */
class Deactivator {
    
    /**
     * Run on plugin deactivation
     */
    public static function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}