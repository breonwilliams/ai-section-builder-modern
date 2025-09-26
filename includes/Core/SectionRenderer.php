<?php
namespace AISB\Modern\Core;

/**
 * Section Renderer
 * Converts section JSON data to HTML for frontend display
 */
class SectionRenderer {
    
    /**
     * Render a section based on its type
     * 
     * @param array $section Section data
     * @return string HTML output
     */
    public function render_section($section) {
        if (empty($section['type'])) {
            return '';
        }
        
        $type = $section['type'];
        $content = isset($section['content']) ? $section['content'] : [];
        
        // Route to appropriate renderer
        switch ($type) {
            case 'hero':
                return $this->render_hero($content);
            case 'features':
                return $this->render_features($content);
            case 'stats':
                return $this->render_stats($content);
            default:
                return '';
        }
    }
    
    /**
     * Render hero section
     * 
     * @param array $content Section content
     * @return string HTML
     */
    private function render_hero($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? '');
        $body = wp_kses_post($content['content'] ?? '');
        $outro = wp_kses_post($content['outro_content'] ?? '');
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        $buttons = $content['buttons'] ?? [];
        
        // Build HTML
        $classes = "aisb-section aisb-hero aisb-section--{$theme} aisb-section--{$layout}";
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-hero__container">
                <div class="aisb-hero__content">
                    <?php if ($eyebrow): ?>
                        <div class="aisb-hero__eyebrow"><?php echo $eyebrow; ?></div>
                    <?php endif; ?>
                    
                    <?php if ($heading): ?>
                        <h1 class="aisb-hero__heading"><?php echo $heading; ?></h1>
                    <?php endif; ?>
                    
                    <?php if ($body): ?>
                        <div class="aisb-hero__body"><?php echo $body; ?></div>
                    <?php endif; ?>
                    
                    <?php if (!empty($buttons)): ?>
                        <div class="aisb-hero__buttons">
                            <?php foreach ($buttons as $button): ?>
                                <a href="<?php echo esc_url($button['url'] ?? '#'); ?>" 
                                   class="aisb-btn aisb-btn-<?php echo esc_attr($button['style'] ?? 'primary'); ?>"
                                   target="<?php echo esc_attr($button['target'] ?? '_self'); ?>"
                                   <?php if (($button['target'] ?? '_self') === '_blank'): ?>rel="noopener noreferrer"<?php endif; ?>>
                                    <?php echo esc_html($button['text'] ?? 'Button'); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($outro): ?>
                        <div class="aisb-hero__outro"><?php echo $outro; ?></div>
                    <?php endif; ?>
                </div>
                
                <?php if ($media_type !== 'none'): ?>
                    <div class="aisb-hero__media">
                        <?php if ($media_type === 'image' && $image): ?>
                            <img src="<?php echo $image; ?>" alt="<?php echo esc_attr($heading); ?>" class="aisb-hero__image">
                        <?php elseif ($media_type === 'video' && $video): ?>
                            <?php echo $this->render_video_embed($video); ?>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Render features section
     * 
     * @param array $content Section content
     * @return string HTML
     */
    private function render_features($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? '');
        $body = wp_kses_post($content['content'] ?? '');
        $outro = wp_kses_post($content['outro_content'] ?? '');
        $cards = $content['cards'] ?? [];
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $grid_columns = esc_attr($content['grid_columns'] ?? '3');
        $card_alignment = esc_attr($content['card_alignment'] ?? 'left');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        $buttons = $content['buttons'] ?? [];
        
        $classes = "aisb-section aisb-features aisb-section--{$theme} aisb-section--{$layout}";
        $classes .= " aisb-features--{$grid_columns}-columns";
        if ($card_alignment && $card_alignment !== 'left') {
            $classes .= " aisb-features--cards-{$card_alignment}";
        }
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-features__container">
                <div class="aisb-features__top">
                    <div class="aisb-features__content">
                        <?php if ($eyebrow): ?>
                            <div class="aisb-features__eyebrow"><?php echo $eyebrow; ?></div>
                        <?php endif; ?>
                        
                        <?php if ($heading): ?>
                            <h2 class="aisb-features__heading"><?php echo $heading; ?></h2>
                        <?php endif; ?>
                        
                        <?php if ($body): ?>
                            <div class="aisb-features__body"><?php echo $body; ?></div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if ($media_type !== 'none'): ?>
                        <div class="aisb-features__media">
                            <?php if ($media_type === 'image' && $image): ?>
                                <img src="<?php echo $image; ?>" alt="<?php echo esc_attr($heading); ?>" class="aisb-features__image">
                            <?php elseif ($media_type === 'video' && $video): ?>
                                <?php echo $this->render_video_embed($video); ?>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <?php if (!empty($cards)): ?>
                    <div class="aisb-features__grid">
                        <?php foreach ($cards as $card): ?>
                            <div class="aisb-features__item">
                                <?php if (!empty($card['image'])): ?>
                                    <div class="aisb-features__item-image-wrapper">
                                        <img src="<?php echo esc_url($card['image']); ?>" 
                                             alt="<?php echo esc_attr($card['heading'] ?? ''); ?>"
                                             class="aisb-features__item-image">
                                    </div>
                                <?php endif; ?>
                                <div class="aisb-features__item-content">
                                    <?php if (!empty($card['heading'])): ?>
                                        <h3 class="aisb-features__item-title"><?php echo esc_html($card['heading']); ?></h3>
                                    <?php endif; ?>
                                    <?php if (!empty($card['content'])): ?>
                                        <div class="aisb-features__item-description"><?php echo wp_kses_post($card['content']); ?></div>
                                    <?php endif; ?>
                                    <?php if (!empty($card['link']) && !empty($card['link_text'])): ?>
                                        <a href="<?php echo esc_url($card['link']); ?>" 
                                           class="aisb-features__item-link"
                                           target="<?php echo esc_attr($card['link_target'] ?? '_self'); ?>"
                                           <?php if (($card['link_target'] ?? '_self') === '_blank'): ?>rel="noopener noreferrer"<?php endif; ?>>
                                            <?php echo esc_html($card['link_text']); ?>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($outro): ?>
                    <div class="aisb-features__outro"><?php echo $outro; ?></div>
                <?php endif; ?>
                
                <?php if (!empty($buttons)): ?>
                    <div class="aisb-features__buttons">
                        <?php foreach ($buttons as $button): ?>
                            <a href="<?php echo esc_url($button['url'] ?? '#'); ?>" 
                               class="aisb-btn aisb-btn-<?php echo esc_attr($button['style'] ?? 'primary'); ?>"
                               target="<?php echo esc_attr($button['target'] ?? '_self'); ?>"
                               <?php if (($button['target'] ?? '_self') === '_blank'): ?>rel="noopener noreferrer"<?php endif; ?>>
                                <?php echo esc_html($button['text'] ?? 'Button'); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Render stats section
     * 
     * @param array $content Section content
     * @return string HTML
     */
    private function render_stats($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? '');
        $body = wp_kses_post($content['content'] ?? '');
        $outro = wp_kses_post($content['outro_content'] ?? '');
        $stats = $content['stats'] ?? [];
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $grid_columns = esc_attr($content['grid_columns'] ?? '3');
        $stat_alignment = esc_attr($content['stat_alignment'] ?? 'center');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        $buttons = $content['buttons'] ?? [];
        
        $classes = "aisb-section aisb-stats aisb-section--{$theme} aisb-section--{$layout}";
        $classes .= " aisb-stats--{$grid_columns}-columns";
        if ($stat_alignment && $stat_alignment !== 'center') {
            $classes .= " aisb-stats--{$stat_alignment}";
        }
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-stats__container">
                <div class="aisb-stats__top">
                    <div class="aisb-stats__content">
                        <?php if ($eyebrow): ?>
                            <div class="aisb-stats__eyebrow"><?php echo $eyebrow; ?></div>
                        <?php endif; ?>
                        
                        <?php if ($heading): ?>
                            <h2 class="aisb-stats__heading"><?php echo $heading; ?></h2>
                        <?php endif; ?>
                        
                        <?php if ($body): ?>
                            <div class="aisb-stats__body"><?php echo $body; ?></div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if ($media_type !== 'none'): ?>
                        <div class="aisb-stats__media">
                            <?php if ($media_type === 'image' && $image): ?>
                                <img src="<?php echo $image; ?>" alt="<?php echo esc_attr($heading); ?>" class="aisb-stats__image">
                            <?php elseif ($media_type === 'video' && $video): ?>
                                <?php echo $this->render_video_embed($video); ?>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <?php if (!empty($stats)): ?>
                    <div class="aisb-stats__grid">
                        <?php foreach ($stats as $stat): ?>
                            <div class="aisb-stats__item">
                                <?php if (!empty($stat['value'])): ?>
                                    <div class="aisb-stats__value"><?php echo esc_html($stat['value']); ?></div>
                                <?php endif; ?>
                                <?php if (!empty($stat['label'])): ?>
                                    <h3 class="aisb-stats__label"><?php echo esc_html($stat['label']); ?></h3>
                                <?php endif; ?>
                                <?php if (!empty($stat['description'])): ?>
                                    <div class="aisb-stats__description"><?php echo wp_kses_post($stat['description']); ?></div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($outro): ?>
                    <div class="aisb-stats__outro"><?php echo $outro; ?></div>
                <?php endif; ?>
                
                <?php if (!empty($buttons)): ?>
                    <div class="aisb-stats__buttons">
                        <?php foreach ($buttons as $button): ?>
                            <a href="<?php echo esc_url($button['url'] ?? '#'); ?>" 
                               class="aisb-btn aisb-btn-<?php echo esc_attr($button['style'] ?? 'primary'); ?>"
                               target="<?php echo esc_attr($button['target'] ?? '_self'); ?>"
                               <?php if (($button['target'] ?? '_self') === '_blank'): ?>rel="noopener noreferrer"<?php endif; ?>>
                                <?php echo esc_html($button['text'] ?? 'Button'); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Render video embed
     * 
     * @param string $url Video URL
     * @return string HTML iframe or empty string
     */
    private function render_video_embed($url) {
        // Extract YouTube ID
        if (preg_match('/youtube\.com\/watch\?v=([^&]+)/', $url, $matches) || 
            preg_match('/youtu\.be\/([^?]+)/', $url, $matches)) {
            $video_id = $matches[1];
            return '<iframe class="aisb-hero__video" src="https://www.youtube.com/embed/' . esc_attr($video_id) . '" frameborder="0" allowfullscreen></iframe>';
        }
        
        // Extract Vimeo ID  
        if (preg_match('/vimeo\.com\/(\d+)/', $url, $matches)) {
            $video_id = $matches[1];
            return '<iframe class="aisb-hero__video" src="https://player.vimeo.com/video/' . esc_attr($video_id) . '" frameborder="0" allowfullscreen></iframe>';
        }
        
        // Direct video file (MP4, WebM, OGG, or WordPress Media Library)
        if (preg_match('/\.(mp4|webm|ogg)$/i', $url) || strpos($url, '/wp-content/') !== false) {
            return '<video class="aisb-hero__video" controls preload="metadata">' .
                   '<source src="' . esc_url($url) . '" type="video/mp4">' .
                   '<source src="' . esc_url($url) . '" type="video/webm">' .
                   '<source src="' . esc_url($url) . '" type="video/ogg">' .
                   'Your browser does not support the video tag.' .
                   '</video>';
        }
        
        return '';
    }
}