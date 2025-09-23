<?php
/**
 * Plugin Name: AI Section Builder Modern
 * Plugin URI: https://your-site.com/
 * Description: Modern React-based section builder with AI capabilities
 * Version: 3.0.0
 * Author: Your Name
 * Text Domain: ai-section-builder-modern
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AISB_MODERN_VERSION', '3.0.0');
define('AISB_MODERN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AISB_MODERN_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AISB_MODERN_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Autoload classes
require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/Plugin.php';

// Initialize plugin
function aisb_modern_init() {
    $plugin = new AISB\Modern\Core\Plugin();
    $plugin->init();
}
add_action('plugins_loaded', 'aisb_modern_init');

// Activation hook
register_activation_hook(__FILE__, function() {
    require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/Activator.php';
    AISB\Modern\Core\Activator::activate();
});

// Deactivation hook
register_deactivation_hook(__FILE__, function() {
    require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/Deactivator.php';
    AISB\Modern\Core\Deactivator::deactivate();
});