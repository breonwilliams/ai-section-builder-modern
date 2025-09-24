<?php
/**
 * AI Section Builder - Contained Template
 * 
 * This template works within the theme's existing layout structure.
 * Sections are rendered inside the theme's content area with
 * the theme's existing constraints and styling.
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

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <article id="post-<?php the_ID(); ?>" <?php post_class('aisb-contained'); ?>>
            <?php
            // Allow themes to add content before sections
            do_action('aisb_before_sections');
            ?>
            
            <div class="aisb-contained-wrapper">
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
                            <h2><?php esc_html_e('AI Section Builder - Contained Mode', 'ai-section-builder'); ?></h2>
                            <p><?php esc_html_e('No sections added yet. Use the editor to add sections to this page.', 'ai-section-builder'); ?></p>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>
            
            <?php
            // Allow themes to add content after sections
            do_action('aisb_after_sections');
            ?>
        </article>
    </main>
</div>

<?php
// Get theme sidebar if the theme uses one
if (function_exists('get_sidebar')) {
    get_sidebar();
}

// Get theme footer
get_footer();
?>