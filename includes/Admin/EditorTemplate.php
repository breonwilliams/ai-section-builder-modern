<?php
namespace AISB\Modern\Admin;

/**
 * Editor Template Handler
 * Provides full-screen isolated template for the editor
 */
class EditorTemplate {
    
    /**
     * Editor data for JavaScript localization
     * @var array
     */
    private $editor_data = [];
    
    /**
     * Initialize the template handler
     */
    public function init() {
        // Hook with priority 1 to run before WordPress admin loads
        add_action('admin_init', [$this, 'maybe_render_isolated_editor'], 1);
    }
    
    /**
     * Check if we should render isolated editor
     */
    public function maybe_render_isolated_editor() {
        // Check if we're on the editor page
        if (!isset($_GET['page']) || $_GET['page'] !== 'aisb-editor') {
            return;
        }
        
        // Check if we have a post ID
        $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;
        if (!$post_id) {
            return;
        }
        
        // Verify permissions
        if (!current_user_can('edit_post', $post_id)) {
            wp_die(__('You do not have permission to edit this post.', 'ai-section-builder-modern'));
        }
        
        // Get post data
        $post = get_post($post_id);
        if (!$post) {
            wp_die(__('Post not found.', 'ai-section-builder-modern'));
        }
        
        // Remove admin bar completely
        show_admin_bar(false);
        add_filter('show_admin_bar', '__return_false', 999);
        remove_action('wp_head', '_admin_bar_bump_cb');
        
        // Set up editor data BEFORE rendering (needed for localization)
        $this->setup_editor_data($post_id, $post);
        
        // Render the isolated template
        $this->render_isolated_template($post_id, $post);
        
        // Exit to prevent WordPress from adding anything
        exit;
    }
    
    /**
     * Setup editor data for JavaScript
     * Note: This data will be localized when the script is enqueued
     */
    private function setup_editor_data($post_id, $post) {
        // Store data for later use in script localization
        $this->editor_data = [
            'apiUrl' => rest_url('ai-section-builder/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'postId' => $post_id,
            'postTitle' => $post->post_title,
            'editPostUrl' => get_edit_post_link($post_id, 'raw'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'pluginUrl' => AISB_MODERN_PLUGIN_URL,
            'isAdmin' => true,
            'isFullScreen' => true,
        ];
    }
    
    /**
     * Render the isolated full-screen template
     */
    private function render_isolated_template($post_id, $post) {
        // Signal that the editor template is being used
        do_action('aisb_editor_template_init');
        
        // Suppress PHP warnings/errors in production
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            error_reporting(0);
            @ini_set('display_errors', 0);
        }
        
        // Load WordPress functions we need
        require_once(ABSPATH . 'wp-admin/includes/admin.php');
        
        // Get sections data
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        if (!is_array($sections)) {
            // Check for legacy sections and migrate if needed
            $sections = $this->migrate_legacy_sections($sections);
        }
        
        // Set up the editor page class for body
        $body_classes = [
            'aisb-editor-active',
            'aisb-fullscreen-mode',
            'wp-admin',
            'wp-core-ui',
        ];
        
        ?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html($post->post_title); ?> - AI Section Builder</title>
    
    <?php
    // Best Practice: Use WordPress's standard enqueueing system
    // The Assets class will handle all script/style loading through proper hooks
    
    // Trigger the admin enqueue scripts action for our isolated page
    // This ensures Assets::enqueue_admin_assets() is called properly
    do_action('admin_enqueue_scripts', 'admin_page_aisb-editor');
    
    // Localize the script with our editor data
    if (isset($this->editor_data)) {
        wp_localize_script('aisb-editor', 'aisbEditor', $this->editor_data);
    }
    
    // Print styles
    wp_print_styles();
    
    // Inject global settings as CSS variables
    $this->inject_global_settings_css();
    ?>
    
    <style>
        /* Critical CSS to prevent flash of unwanted content */
        body {
            visibility: hidden;
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow: hidden;
            background: #09111A; /* Match editor background immediately */
        }
        
        /* Show only when React is ready */
        body.aisb-editor-ready {
            visibility: visible;
        }
        
        /* Hide any WordPress admin elements that might appear */
        #adminmenumain,
        #adminmenuback,
        #wpadminbar,
        #wpfooter,
        .notice,
        .update-nag,
        .error,
        .warning {
            display: none !important;
        }
        
        /* Editor takes full viewport */
        #aisb-editor-root {
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            background: #09111A;
        }
        
        /* Loading state styling */
        #aisb-editor-loading {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #09111A;
            z-index: 10000;
        }
        
        #aisb-editor-loading-content {
            text-align: center;
            background: #141F2E;
            padding: 40px;
            border-radius: 8px;
            color: #E8EAED;
        }
    </style>
</head>
<body class="<?php echo esc_attr(implode(' ', $body_classes)); ?>">
    <!-- React app will mount here -->
    <div id="aisb-editor-root"></div>
    
    <!-- Loading indicator -->
    <div id="aisb-editor-loading">
        <div id="aisb-editor-loading-content">
            <span class="spinner is-active" style="float: none; margin: 0 auto 20px;"></span>
            <p>Loading AI Section Builder...</p>
        </div>
    </div>
    
    <?php
    // Print scripts
    wp_print_scripts();
    
    // Add validation tests in development
    if (defined('WP_DEBUG') && WP_DEBUG) {
        $this->add_validation_tests();
    }
    ?>
</body>
</html><?php
    }
    
    /**
     * Inject global settings as CSS variables
     */
    private function inject_global_settings_css() {
        $settings = get_option('aisb_global_settings', [
            'primary_color' => '#2563eb',
            'secondary_color' => '#1e40af',
            'text_color' => '#1f2937',
            'background_color' => '#ffffff',
            'muted_color' => '#64748b',
            'border_color' => '#e5e7eb',
            'success_color' => '#10b981',
            'error_color' => '#ef4444',
        ]);
        
        ?>
        <style id="aisb-global-settings">
            :root {
                /* Section rendering colors - customizable by users */
                --aisb-color-primary: <?php echo esc_attr($settings['primary_color']); ?>;
                --aisb-color-secondary: <?php echo esc_attr($settings['secondary_color']); ?>;
                --aisb-color-text: <?php echo esc_attr($settings['text_color']); ?>;
                --aisb-color-background: <?php echo esc_attr($settings['background_color']); ?>;
                --aisb-color-muted: <?php echo esc_attr($settings['muted_color'] ?? '#64748b'); ?>;
                --aisb-color-border: <?php echo esc_attr($settings['border_color'] ?? '#e5e7eb'); ?>;
                --aisb-color-success: <?php echo esc_attr($settings['success_color'] ?? '#10b981'); ?>;
                --aisb-color-error: <?php echo esc_attr($settings['error_color'] ?? '#ef4444'); ?>;
            }
        </style>
        <?php
    }
    
    /**
     * Migrate legacy sections format if needed
     */
    private function migrate_legacy_sections($sections) {
        if (!is_array($sections)) {
            return [];
        }
        
        // Check if migration is needed
        if (isset($sections[0]) && !isset($sections[0]['version'])) {
            // Add version to each section
            foreach ($sections as &$section) {
                $section['version'] = '3.0.0';
            }
        }
        
        return $sections;
    }
    
    /**
     * Add validation tests for development
     */
    private function add_validation_tests() {
        ?>
        <script>
            // Validation tests for development
            window.addEventListener('DOMContentLoaded', function() {
                // Test 1: Confirm WordPress admin is hidden
                console.assert(
                    document.querySelector('#adminmenumain') === null, 
                    'WordPress admin should be hidden'
                );
                
                // Test 2: Confirm design tokens are loaded
                const accent = getComputedStyle(document.documentElement)
                    .getPropertyValue('--aisb-editor-accent').trim();
                console.assert(
                    accent === '#667EEA' || accent === '#667eea', 
                    'Purple accent token should be loaded'
                );
                
                // Test 3: Confirm section tokens are separate
                const sectionPrimary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--aisb-color-primary').trim();
                console.assert(
                    sectionPrimary === '#2563eb', 
                    'Section tokens should be separate from editor tokens'
                );
                
                console.log('✅ Editor validation tests completed');
            });
        </script>
        <?php
    }
}