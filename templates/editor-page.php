<?php
/**
 * Editor page template
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get post data from the context (set in AdminMenu.php)
$post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;
$post = $post_id ? get_post($post_id) : null;
?>
<div class="aisb-editor-wrapper" style="margin: 0; padding: 0;">
    <?php if ($post): ?>
        <!-- Post context header -->
        <div style="background: #23282d; color: white; padding: 10px 20px; margin: 0 0 0 -20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="opacity: 0.7; font-size: 12px;">
                        <?php echo esc_html__('Editing:', 'ai-section-builder-modern'); ?>
                    </span>
                    <strong style="margin-left: 10px; font-size: 16px;">
                        <?php echo esc_html($post->post_title ?: __('(no title)', 'ai-section-builder-modern')); ?>
                    </strong>
                </div>
                <a href="<?php echo esc_url(get_edit_post_link($post_id)); ?>" 
                   class="button button-secondary" 
                   style="margin-left: 20px;">
                    ← <?php echo esc_html__('Back to Post Editor', 'ai-section-builder-modern'); ?>
                </a>
            </div>
        </div>
    <?php endif; ?>
    
    <!-- React app will mount here -->
    <div id="aisb-editor-root"></div>
    
    <!-- Loading indicator -->
    <div id="aisb-editor-loading" style="padding: 40px; text-align: center;">
        <span class="spinner is-active" style="float: none; margin: 0 auto 20px;"></span>
        <p><?php echo esc_html__('Loading AI Section Builder...', 'ai-section-builder-modern'); ?></p>
    </div>
</div>