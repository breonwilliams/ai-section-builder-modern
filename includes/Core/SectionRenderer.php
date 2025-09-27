<?php
namespace AISB\Modern\Core;

/**
 * Section Renderer
 * Converts section JSON data to HTML for frontend display
 */
class SectionRenderer {
    
    /**
     * Check if HTML content is actually empty (ignoring br tags and whitespace)
     * 
     * @param string $html HTML content to check
     * @return bool True if content is empty
     */
    private function is_content_empty($html) {
        if (empty($html)) {
            return true;
        }
        // Strip br tags and whitespace
        $stripped = preg_replace('/<br\s*\/?>/i', '', $html);
        $stripped = trim(strip_tags($stripped));
        return empty($stripped);
    }
    
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
            case 'testimonials':
                return $this->render_testimonials($content);
            case 'checklist':
                return $this->render_checklist($content);
            case 'faq':
                return $this->render_faq($content);
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
                    
                    <?php if ($outro && !$this->is_content_empty($outro)): ?>
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
                
                <?php if ($outro && !$this->is_content_empty($outro)): ?>
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
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        $buttons = $content['buttons'] ?? [];
        
        $classes = "aisb-section aisb-stats aisb-section--{$theme} aisb-section--{$layout}";
        $classes .= " aisb-stats--{$grid_columns}-columns";
        
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
                
                <?php if ($outro && !$this->is_content_empty($outro)): ?>
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
     * Render testimonials section
     * 
     * @param array $content Section content
     * @return string HTML
     */
    private function render_testimonials($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? '');
        $body = wp_kses_post($content['content'] ?? '');
        $outro = wp_kses_post($content['outro_content'] ?? '');
        $testimonials = $content['testimonials'] ?? [];
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $grid_columns = esc_attr($content['grid_columns'] ?? '3');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        $buttons = $content['buttons'] ?? [];
        
        $classes = "aisb-section aisb-testimonials aisb-section--{$theme} aisb-section--{$layout}";
        $classes .= " aisb-testimonials--{$grid_columns}-columns";
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-testimonials__container">
                <div class="aisb-testimonials__top">
                    <div class="aisb-testimonials__content">
                        <?php if ($eyebrow): ?>
                            <div class="aisb-testimonials__eyebrow"><?php echo $eyebrow; ?></div>
                        <?php endif; ?>
                        
                        <?php if ($heading): ?>
                            <h2 class="aisb-testimonials__heading"><?php echo $heading; ?></h2>
                        <?php endif; ?>
                        
                        <?php if ($body): ?>
                            <div class="aisb-testimonials__body"><?php echo $body; ?></div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if ($media_type !== 'none'): ?>
                        <div class="aisb-testimonials__media">
                            <?php if ($media_type === 'image' && $image): ?>
                                <img src="<?php echo $image; ?>" alt="<?php echo esc_attr($heading); ?>" class="aisb-testimonials__image">
                            <?php elseif ($media_type === 'video' && $video): ?>
                                <?php echo $this->render_video_embed($video); ?>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <?php if (!empty($testimonials)): ?>
                    <div class="aisb-testimonials__grid">
                        <?php foreach ($testimonials as $testimonial): ?>
                            <?php 
                            // Get rating (default to 5 if not provided)
                            $rating = isset($testimonial['rating']) ? floatval($testimonial['rating']) : 5.0;
                            
                            // Check if avatar exists for conditional layout
                            $has_avatar = !empty($testimonial['avatar']);
                            $author_section_class = 'aisb-testimonials__author-section';
                            if ($has_avatar) {
                                $author_section_class .= ' aisb-testimonials__author-section--with-avatar';
                            }
                            ?>
                            <div class="aisb-testimonials__item">
                                <div class="aisb-testimonials__item-content">
                                    <!-- Star rating -->
                                    <div class="aisb-testimonials__rating">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <?php if ($i <= floor($rating)): ?>
                                                <span class="aisb-testimonials__star aisb-testimonials__star--filled">★</span>
                                            <?php elseif ($i <= ceil($rating) && fmod($rating, 1) != 0): ?>
                                                <span class="aisb-testimonials__star aisb-testimonials__star--half">★</span>
                                            <?php else: ?>
                                                <span class="aisb-testimonials__star">☆</span>
                                            <?php endif; ?>
                                        <?php endfor; ?>
                                    </div>
                                    
                                    <?php if (!empty($testimonial['content'])): ?>
                                        <div class="aisb-testimonials__quote"><?php echo wp_kses_post($testimonial['content']); ?></div>
                                    <?php endif; ?>
                                    
                                    <div class="<?php echo esc_attr($author_section_class); ?>">
                                        <?php if ($has_avatar): ?>
                                            <img src="<?php echo esc_url($testimonial['avatar']); ?>" 
                                                 alt="<?php echo esc_attr($testimonial['author'] ?? ''); ?>" 
                                                 class="aisb-testimonials__avatar">
                                        <?php endif; ?>
                                        
                                        <div class="aisb-testimonials__author-info">
                                            <?php if (!empty($testimonial['author'])): ?>
                                                <div class="aisb-testimonials__author"><?php echo esc_html($testimonial['author']); ?></div>
                                            <?php endif; ?>
                                            
                                            <?php if (!empty($testimonial['role'])): ?>
                                                <div class="aisb-testimonials__role"><?php echo esc_html($testimonial['role']); ?></div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($outro && !$this->is_content_empty($outro)): ?>
                    <div class="aisb-testimonials__outro"><?php echo $outro; ?></div>
                <?php endif; ?>
                
                <?php if (!empty($buttons)): ?>
                    <div class="aisb-testimonials__buttons">
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
     * Render checklist section
     * 
     * @param array $content Section content
     * @return string HTML
     */
    private function render_checklist($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? 'Everything You Need');
        $body = wp_kses_post($content['content'] ?? '');
        $items = $content['items'] ?? [];
        $buttons = $content['buttons'] ?? [];
        $outro = wp_kses_post($content['outro_content'] ?? '');
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        
        $classes = "aisb-section aisb-checklist aisb-section--{$theme} aisb-section--{$layout}";
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-checklist__container">
                <?php if ($layout !== 'center'): ?>
                    <!-- Two-column layout -->
                    <div class="aisb-checklist__columns">
                        <!-- Content Column -->
                        <div class="aisb-checklist__content-column">
                            <?php if ($eyebrow): ?>
                                <div class="aisb-checklist__eyebrow"><?php echo $eyebrow; ?></div>
                            <?php endif; ?>
                            
                            <?php if ($heading): ?>
                                <h2 class="aisb-checklist__heading"><?php echo $heading; ?></h2>
                            <?php endif; ?>
                            
                            <?php if ($body): ?>
                                <div class="aisb-checklist__content"><?php echo $body; ?></div>
                            <?php endif; ?>
                            
                            <!-- Checklist Items -->
                            <?php if (!empty($items)): ?>
                                <div class="aisb-checklist__items">
                                    <?php foreach ($items as $item): ?>
                                        <div class="aisb-checklist__item">
                                            <div class="aisb-checklist__item-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                                    <path d="M7 12L10 15L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                            <div class="aisb-checklist__item-content">
                                                <h4 class="aisb-checklist__item-heading"><?php echo esc_html($item['heading'] ?? 'Checklist Item'); ?></h4>
                                                <?php if (!empty($item['content'])): ?>
                                                    <p class="aisb-checklist__item-text"><?php echo esc_html($item['content']); ?></p>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                            
                            <?php if (!empty($buttons)): ?>
                                <div class="aisb-checklist__buttons">
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
                            
                            <?php if ($outro && !$this->is_content_empty($outro)): ?>
                                <div class="aisb-checklist__outro"><?php echo $outro; ?></div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Media Column -->
                        <?php if ($media_type !== 'none'): ?>
                            <div class="aisb-checklist__media-column">
                                <?php if ($media_type === 'image' && $image): ?>
                                    <div class="aisb-checklist__media">
                                        <img src="<?php echo $image; ?>" 
                                             alt="<?php echo esc_attr($heading); ?>" 
                                             class="aisb-checklist__image">
                                    </div>
                                <?php elseif ($media_type === 'video' && $video): ?>
                                    <div class="aisb-checklist__media">
                                        <?php echo $this->render_video_embed($video); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <!-- Center layout -->
                    <div class="aisb-checklist__center">
                        <?php if ($eyebrow): ?>
                            <div class="aisb-checklist__eyebrow"><?php echo $eyebrow; ?></div>
                        <?php endif; ?>
                        
                        <?php if ($heading): ?>
                            <h2 class="aisb-checklist__heading"><?php echo $heading; ?></h2>
                        <?php endif; ?>
                        
                        <?php if ($body): ?>
                            <div class="aisb-checklist__content"><?php echo $body; ?></div>
                        <?php endif; ?>
                        
                        <!-- Checklist Items -->
                        <?php if (!empty($items)): ?>
                            <div class="aisb-checklist__items">
                                <?php foreach ($items as $item): ?>
                                    <div class="aisb-checklist__item">
                                        <div class="aisb-checklist__item-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                                <path d="M7 12L10 15L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div class="aisb-checklist__item-content">
                                            <h4 class="aisb-checklist__item-heading"><?php echo esc_html($item['heading'] ?? 'Checklist Item'); ?></h4>
                                            <?php if (!empty($item['content'])): ?>
                                                <p class="aisb-checklist__item-text"><?php echo esc_html($item['content']); ?></p>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (!empty($buttons)): ?>
                            <div class="aisb-checklist__buttons">
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
                        
                        <?php if ($outro && !$this->is_content_empty($outro)): ?>
                            <div class="aisb-checklist__outro"><?php echo $outro; ?></div>
                        <?php endif; ?>
                        
                        <!-- Media below content for center layout -->
                        <?php if ($media_type !== 'none'): ?>
                            <?php if ($media_type === 'image' && $image): ?>
                                <div class="aisb-checklist__media">
                                    <img src="<?php echo $image; ?>" 
                                         alt="<?php echo esc_attr($heading); ?>" 
                                         class="aisb-checklist__image">
                                </div>
                            <?php elseif ($media_type === 'video' && $video): ?>
                                <div class="aisb-checklist__media">
                                    <?php echo $this->render_video_embed($video); ?>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Render FAQ section
     * 
     * @param array $content Section content
     * @return string HTML
     */
    private function render_faq($content) {
        // Extract data with defaults
        $eyebrow = esc_html($content['eyebrow_heading'] ?? '');
        $heading = esc_html($content['heading'] ?? 'Frequently Asked Questions');
        $body = wp_kses_post($content['content'] ?? '');
        $questions = $content['questions'] ?? [];
        $buttons = $content['buttons'] ?? [];
        $outro = wp_kses_post($content['outro_content'] ?? '');
        $theme = esc_attr($content['theme_variant'] ?? 'light');
        $layout = esc_attr($content['layout_variant'] ?? 'content-left');
        $media_type = $content['media_type'] ?? 'none';
        $image = esc_url($content['featured_image'] ?? '');
        $video = esc_url($content['video_url'] ?? '');
        
        $classes = "aisb-section aisb-faq aisb-section--{$theme} aisb-section--{$layout}";
        
        ob_start();
        ?>
        <section class="<?php echo $classes; ?>">
            <div class="aisb-faq__container">
                <?php if ($layout !== 'center'): ?>
                    <!-- Two-column layout -->
                    <div class="aisb-faq__columns">
                        <!-- Content Column -->
                        <div class="aisb-faq__content-column">
                            <?php if ($eyebrow): ?>
                                <div class="aisb-faq__eyebrow"><?php echo $eyebrow; ?></div>
                            <?php endif; ?>
                            
                            <?php if ($heading): ?>
                                <h2 class="aisb-faq__heading"><?php echo $heading; ?></h2>
                            <?php endif; ?>
                            
                            <?php if ($body): ?>
                                <div class="aisb-faq__content"><?php echo $body; ?></div>
                            <?php endif; ?>
                            
                            <!-- FAQ Items -->
                            <?php if (!empty($questions)): ?>
                                <div class="aisb-faq__items">
                                    <?php foreach ($questions as $item): ?>
                                        <div class="aisb-faq__item">
                                            <div class="aisb-faq__item-question">
                                                <?php echo esc_html($item['question'] ?? 'Question'); ?>
                                            </div>
                                            <div class="aisb-faq__item-answer">
                                                <div class="aisb-faq__item-answer-inner">
                                                    <div class="aisb-faq__item-answer-content">
                                                        <?php echo wp_kses_post($item['answer'] ?? ''); ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                            
                            <?php if (!empty($buttons)): ?>
                                <div class="aisb-faq__buttons">
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
                            
                            <?php if ($outro && !$this->is_content_empty($outro)): ?>
                                <div class="aisb-faq__outro"><?php echo $outro; ?></div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Media Column -->
                        <?php if ($media_type !== 'none'): ?>
                            <div class="aisb-faq__media-column">
                                <?php if ($media_type === 'image' && $image): ?>
                                    <div class="aisb-faq__media">
                                        <img src="<?php echo $image; ?>" 
                                             alt="<?php echo esc_attr($heading); ?>" 
                                             class="aisb-faq__image">
                                    </div>
                                <?php elseif ($media_type === 'video' && $video): ?>
                                    <div class="aisb-faq__media">
                                        <?php echo $this->render_video_embed($video); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <!-- Center layout -->
                    <div class="aisb-faq__center">
                        <?php if ($eyebrow): ?>
                            <div class="aisb-faq__eyebrow"><?php echo $eyebrow; ?></div>
                        <?php endif; ?>
                        
                        <?php if ($heading): ?>
                            <h2 class="aisb-faq__heading"><?php echo $heading; ?></h2>
                        <?php endif; ?>
                        
                        <?php if ($body): ?>
                            <div class="aisb-faq__content"><?php echo $body; ?></div>
                        <?php endif; ?>
                        
                        <!-- FAQ Items -->
                        <?php if (!empty($questions)): ?>
                            <div class="aisb-faq__items">
                                <?php foreach ($questions as $item): ?>
                                    <div class="aisb-faq__item">
                                        <div class="aisb-faq__item-question">
                                            <?php echo esc_html($item['question'] ?? 'Question'); ?>
                                        </div>
                                        <div class="aisb-faq__item-answer">
                                            <div class="aisb-faq__item-answer-inner">
                                                <div class="aisb-faq__item-answer-content">
                                                    <?php echo wp_kses_post($item['answer'] ?? ''); ?>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (!empty($buttons)): ?>
                            <div class="aisb-faq__buttons">
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
                        
                        <?php if ($outro && !$this->is_content_empty($outro)): ?>
                            <div class="aisb-faq__outro"><?php echo $outro; ?></div>
                        <?php endif; ?>
                        
                        <!-- Media below content for center layout -->
                        <?php if ($media_type !== 'none'): ?>
                            <?php if ($media_type === 'image' && $image): ?>
                                <div class="aisb-faq__media">
                                    <img src="<?php echo $image; ?>" 
                                         alt="<?php echo esc_attr($heading); ?>" 
                                         class="aisb-faq__image">
                                </div>
                            <?php elseif ($media_type === 'video' && $video): ?>
                                <div class="aisb-faq__media">
                                    <?php echo $this->render_video_embed($video); ?>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
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