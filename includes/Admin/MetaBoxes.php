<?php
namespace AISB\Modern\Admin;

/**
 * Meta boxes handler
 */
class MetaBoxes {
    
    /**
     * Initialize meta boxes
     */
    public function init() {
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('wp_ajax_aisb_activate_builder', [$this, 'ajax_activate_builder']);
        add_action('wp_ajax_aisb_deactivate_builder', [$this, 'ajax_deactivate_builder']);
    }
    
    /**
     * Add meta boxes to posts and pages
     */
    public function add_meta_boxes() {
        $post_types = ['post', 'page'];
        
        foreach ($post_types as $post_type) {
            add_meta_box(
                'aisb_sections',
                __('AI Section Builder', 'ai-section-builder-modern'),
                [$this, 'render_meta_box'],
                $post_type,
                'normal',
                'high'
            );
        }
    }
    
    /**
     * Render the meta box content
     */
    public function render_meta_box($post) {
        // Check if builder is enabled for this post
        $is_enabled = get_post_meta($post->ID, '_aisb_enabled', true);
        $sections = get_post_meta($post->ID, '_aisb_sections', true);
        $has_sections = !empty($sections) && is_array($sections) && count($sections) > 0;
        
        // Add nonce for security
        wp_nonce_field('aisb_meta_box_action', 'aisb_nonce');
        ?>
        <div class="aisb-meta-box">
            <style>
                .aisb-meta-box {
                    padding: 15px;
                }
                .aisb-meta-box__content {
                    margin-bottom: 15px;
                }
                .aisb-meta-box__status {
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }
                .aisb-meta-box__status--active {
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                }
                .aisb-meta-box__status--inactive {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    color: #495057;
                }
                .aisb-btn {
                    display: inline-block;
                    padding: 8px 16px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    margin-right: 10px;
                }
                .aisb-btn:hover {
                    background: #5a67d8;
                    color: white;
                }
                .aisb-btn--secondary {
                    background: #6c757d;
                }
                .aisb-btn--secondary:hover {
                    background: #5a6268;
                }
                .aisb-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            </style>
            
            <?php if ($is_enabled): ?>
                <div class="aisb-meta-box__status aisb-meta-box__status--active">
                    <strong>✓ AI Section Builder Active</strong>
                    <?php if ($has_sections): ?>
                        <br><small><?php echo sprintf(__('%d sections configured', 'ai-section-builder-modern'), count($sections)); ?></small>
                    <?php else: ?>
                        <br><small><?php _e('No sections added yet', 'ai-section-builder-modern'); ?></small>
                    <?php endif; ?>
                </div>
                
                <div class="aisb-meta-box__actions">
                    <button type="button" class="aisb-btn aisb-edit-builder" data-post-id="<?php echo $post->ID; ?>">
                        <?php _e('Edit with AI Section Builder', 'ai-section-builder-modern'); ?>
                    </button>
                    
                    <button type="button" class="aisb-btn aisb-btn--secondary aisb-deactivate-builder" data-post-id="<?php echo $post->ID; ?>">
                        <?php _e('Deactivate Builder', 'ai-section-builder-modern'); ?>
                    </button>
                </div>
                
            <?php else: ?>
                <div class="aisb-meta-box__status aisb-meta-box__status--inactive">
                    <?php _e('AI Section Builder is not active for this page', 'ai-section-builder-modern'); ?>
                </div>
                
                <div class="aisb-meta-box__content">
                    <p><?php _e('Create beautiful page layouts with AI-powered sections.', 'ai-section-builder-modern'); ?></p>
                </div>
                
                <div class="aisb-meta-box__actions">
                    <button type="button" class="aisb-btn aisb-activate-builder" data-post-id="<?php echo $post->ID; ?>">
                        <?php _e('Activate AI Section Builder', 'ai-section-builder-modern'); ?>
                    </button>
                </div>
            <?php endif; ?>
            
            <script>
            jQuery(document).ready(function($) {
                // Edit with builder
                $('.aisb-edit-builder').on('click', function(e) {
                    e.preventDefault();
                    var postId = $(this).data('post-id');
                    var editorUrl = '<?php echo admin_url('admin.php'); ?>?page=aisb-editor&post_id=' + postId;
                    window.location.href = editorUrl;
                });
                
                // Activate builder
                $('.aisb-activate-builder').on('click', function(e) {
                    e.preventDefault();
                    var $button = $(this);
                    var postId = $button.data('post-id');
                    
                    $button.prop('disabled', true).text('Activating...');
                    
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'aisb_activate_builder',
                            post_id: postId,
                            nonce: $('#aisb_nonce').val()
                        },
                        success: function(response) {
                            if (response.success) {
                                // Redirect to editor
                                var editorUrl = '<?php echo admin_url('admin.php'); ?>?page=aisb-editor&post_id=' + postId;
                                window.location.href = editorUrl;
                            } else {
                                alert('Error: ' + response.data);
                                $button.prop('disabled', false).text('Activate AI Section Builder');
                            }
                        },
                        error: function() {
                            alert('An error occurred. Please try again.');
                            $button.prop('disabled', false).text('Activate AI Section Builder');
                        }
                    });
                });
                
                // Deactivate builder
                $('.aisb-deactivate-builder').on('click', function(e) {
                    e.preventDefault();
                    
                    if (!confirm('Are you sure you want to deactivate AI Section Builder? Your sections will be preserved.')) {
                        return;
                    }
                    
                    var $button = $(this);
                    var postId = $button.data('post-id');
                    
                    $button.prop('disabled', true).text('Deactivating...');
                    
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'aisb_deactivate_builder',
                            post_id: postId,
                            nonce: $('#aisb_nonce').val()
                        },
                        success: function(response) {
                            if (response.success) {
                                location.reload();
                            } else {
                                alert('Error: ' + response.data);
                                $button.prop('disabled', false).text('Deactivate Builder');
                            }
                        },
                        error: function() {
                            alert('An error occurred. Please try again.');
                            $button.prop('disabled', false).text('Deactivate Builder');
                        }
                    });
                });
            });
            </script>
        </div>
        <?php
    }
    
    /**
     * AJAX handler for activating the builder
     */
    public function ajax_activate_builder() {
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'aisb_meta_box_action')) {
            wp_die('Security check failed');
        }
        
        $post_id = intval($_POST['post_id']);
        
        // Verify user can edit this post
        if (!current_user_can('edit_post', $post_id)) {
            wp_send_json_error('Permission denied');
        }
        
        // Activate the builder for this post
        update_post_meta($post_id, '_aisb_enabled', 1);
        
        // Initialize empty sections if none exist
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        if (!is_array($sections)) {
            update_post_meta($post_id, '_aisb_sections', []);
        }
        
        wp_send_json_success();
    }
    
    /**
     * AJAX handler for deactivating the builder
     */
    public function ajax_deactivate_builder() {
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'aisb_meta_box_action')) {
            wp_die('Security check failed');
        }
        
        $post_id = intval($_POST['post_id']);
        
        // Verify user can edit this post
        if (!current_user_can('edit_post', $post_id)) {
            wp_send_json_error('Permission denied');
        }
        
        // Deactivate the builder (but preserve sections)
        update_post_meta($post_id, '_aisb_enabled', 0);
        
        wp_send_json_success();
    }
}