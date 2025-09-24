<?php
/**
 * AI Section Builder - Full Width Template
 * 
 * This template preserves the theme's header and footer
 * but renders sections in full viewport width.
 * The theme's page title and content area constraints are removed.
 * 
 * @package AISB\Modern
 * @since 3.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Get theme header
get_header();

// Get sections data
$post_id = get_the_ID();
$sections = get_post_meta($post_id, '_aisb_sections', true);

// Decode if JSON string
if (is_string($sections)) {
    $sections = json_decode($sections, true);
}
?>

<div id="aisb-fullwidth-wrapper" class="aisb-fullwidth-wrapper">
    <?php
    if (!empty($sections) && is_array($sections)) {
        $renderer = new \AISB\Modern\Core\SectionRenderer();
        foreach ($sections as $section) {
            echo $renderer->render_section($section);
        }
    } else {
        // Show placeholder for admins
        if (current_user_can('edit_posts')) {
            ?>
            <div style="padding: 60px 20px; text-align: center; background: #f5f5f5;">
                <h2><?php esc_html_e('AI Section Builder - Full Width Mode', 'ai-section-builder'); ?></h2>
                <p><?php esc_html_e('No sections added yet. Use the editor to add sections to this page.', 'ai-section-builder'); ?></p>
            </div>
            <?php
        }
    }
    ?>
</div>

<?php
// Get theme footer
get_footer();
?>