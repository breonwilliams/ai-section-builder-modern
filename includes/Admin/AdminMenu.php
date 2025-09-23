<?php
namespace AISB\Modern\Admin;

/**
 * Admin menu handler
 */
class AdminMenu {
    
    /**
     * Register admin menu
     */
    public function register_menu() {
        // Hidden editor page - no parent menu (null)
        // This page is accessed via meta box button on posts/pages
        add_submenu_page(
            null, // No parent menu - hidden page
            __('AI Section Builder Editor', 'ai-section-builder-modern'),
            __('Editor', 'ai-section-builder-modern'),
            'edit_pages',
            'aisb-editor',
            [$this, 'render_editor_page']
        );
    }
    
    /**
     * Render the editor page
     */
    public function render_editor_page() {
        // Get current post ID - REQUIRED for editor
        $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;
        
        // If no post ID, show error
        if (!$post_id) {
            $this->render_no_post_selected();
            return;
        }
        
        // Verify post exists and user can edit it
        $post = get_post($post_id);
        if (!$post) {
            wp_die(__('Post not found.', 'ai-section-builder-modern'));
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            wp_die(__('You do not have permission to edit this post.', 'ai-section-builder-modern'));
        }
        
        // Pass data to JavaScript
        wp_localize_script('aisb-editor', 'aisbEditor', [
            'apiUrl' => rest_url('ai-section-builder/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'postId' => $post_id,
            'postTitle' => $post->post_title,
            'editPostUrl' => get_edit_post_link($post_id, 'raw'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'pluginUrl' => AISB_MODERN_PLUGIN_URL,
            'isAdmin' => true,
        ]);
        
        // Include the template
        include AISB_MODERN_PLUGIN_DIR . 'templates/editor-page.php';
    }
    
    /**
     * Render no post selected message
     */
    private function render_no_post_selected() {
        ?>
        <div class="wrap">
            <h1><?php _e('AI Section Builder Editor', 'ai-section-builder-modern'); ?></h1>
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 5px; margin-top: 20px;">
                <h2><?php _e('No Post Selected', 'ai-section-builder-modern'); ?></h2>
                <p><?php _e('The AI Section Builder editor requires a specific page or post to edit.', 'ai-section-builder-modern'); ?></p>
                <p><?php _e('To use the editor:', 'ai-section-builder-modern'); ?></p>
                <ol>
                    <li><?php _e('Go to Pages or Posts in your WordPress admin', 'ai-section-builder-modern'); ?></li>
                    <li><?php _e('Edit the page or post you want to build', 'ai-section-builder-modern'); ?></li>
                    <li><?php _e('Click "Edit with AI Section Builder" in the meta box', 'ai-section-builder-modern'); ?></li>
                </ol>
                <p>
                    <a href="<?php echo admin_url('edit.php?post_type=page'); ?>" class="button button-primary">
                        <?php _e('Go to Pages', 'ai-section-builder-modern'); ?>
                    </a>
                    <a href="<?php echo admin_url('edit.php'); ?>" class="button">
                        <?php _e('Go to Posts', 'ai-section-builder-modern'); ?>
                    </a>
                </p>
            </div>
        </div>
        <?php
    }
}