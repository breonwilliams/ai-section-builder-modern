<?php
namespace AISB\Modern\Core;

/**
 * Main plugin class
 */
class Plugin {
    
    /**
     * Initialize the plugin
     */
    public function init() {
        // Load dependencies
        $this->load_dependencies();
        
        // Initialize hooks
        $this->init_hooks();
    }
    
    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Admin/AdminMenu.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Admin/MetaBoxes.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Admin/EditorTemplate.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/API/RestAPI.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/Assets.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/Helpers.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/TemplateHandler.php';
        require_once AISB_MODERN_PLUGIN_DIR . 'includes/Core/SectionRenderer.php';
    }
    
    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Editor template isolation (must run first)
        $editor_template = new \AISB\Modern\Admin\EditorTemplate();
        $editor_template->init();
        
        // Admin menu (hidden editor page)
        $admin_menu = new \AISB\Modern\Admin\AdminMenu();
        add_action('admin_menu', [$admin_menu, 'register_menu']);
        
        // Meta boxes for posts/pages
        $meta_boxes = new \AISB\Modern\Admin\MetaBoxes();
        $meta_boxes->init();
        
        // REST API
        $rest_api = new \AISB\Modern\API\RestAPI();
        add_action('rest_api_init', [$rest_api, 'register_routes']);
        
        // Assets
        $assets = new \AISB\Modern\Core\Assets();
        add_action('admin_enqueue_scripts', [$assets, 'enqueue_admin_assets']);
        add_action('wp_enqueue_scripts', [$assets, 'enqueue_frontend_assets']);
        
        // Frontend rendering
        $template_handler = new \AISB\Modern\Core\TemplateHandler();
        $template_handler->init();
    }
}