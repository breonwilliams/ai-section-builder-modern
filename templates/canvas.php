<?php
/**
 * AI Section Builder - Canvas Template
 * 
 * This template provides a completely blank canvas for sections.
 * No theme header, footer, or any theme markup - just the sections.
 * Perfect for landing pages, coming soon pages, etc.
 * 
 * @package AISB\Modern
 * @since 3.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Get sections data
$post_id = get_the_ID();
$sections = get_post_meta($post_id, '_aisb_sections', true);

// Decode if JSON string
if (is_string($sections)) {
    $sections = json_decode($sections, true);
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('aisb-canvas aisb-template-canvas'); ?>>
    <?php wp_body_open(); ?>
    
    <div id="aisb-canvas-wrapper" class="aisb-canvas-wrapper">
        <?php
        if (!empty($sections) && is_array($sections)) {
            $renderer = new \AISB\Modern\Core\SectionRenderer();
            foreach ($sections as $section) {
                echo $renderer->render_section($section);
            }
        } else {
            // Show placeholder in admin preview
            if (current_user_can('edit_posts')) {
                ?>
                <div style="padding: 60px 20px; text-align: center; background: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                    <div>
                        <h2><?php esc_html_e('AI Section Builder - Canvas Mode', 'ai-section-builder'); ?></h2>
                        <p><?php esc_html_e('No sections added yet. Use the editor to add sections to this page.', 'ai-section-builder'); ?></p>
                    </div>
                </div>
                <?php
            }
        }
        ?>
    </div>
    
    <?php wp_footer(); ?>
</body>
</html>