<?php
namespace AISB\Modern\API;

/**
 * REST API handler
 */
class RestAPI {
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Save sections endpoint
        register_rest_route('ai-section-builder/v1', '/sections', [
            'methods' => 'POST',
            'callback' => [$this, 'save_sections'],
            'permission_callback' => [$this, 'check_permission'],
            'args' => [
                'post_id' => [
                    'required' => true,
                    'type' => 'integer',
                    'sanitize_callback' => 'absint',
                ],
                'sections' => [
                    'required' => true,
                    'type' => 'array',
                ],
            ],
        ]);
        
        // Load sections endpoint
        register_rest_route('ai-section-builder/v1', '/sections/(?P<post_id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'load_sections'],
            'permission_callback' => [$this, 'check_permission'],
            'args' => [
                'post_id' => [
                    'required' => true,
                    'type' => 'integer',
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);
        
        // Global settings endpoints
        register_rest_route('ai-section-builder/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
        
        register_rest_route('ai-section-builder/v1', '/settings', [
            'methods' => 'POST',
            'callback' => [$this, 'save_settings'],
            'permission_callback' => [$this, 'check_permission'],
            'args' => [
                'settings' => [
                    'required' => true,
                    'type' => 'object',
                ],
            ],
        ]);
    }
    
    /**
     * Check user permissions
     */
    public function check_permission() {
        return current_user_can('edit_pages');
    }
    
    /**
     * Save sections
     */
    public function save_sections($request) {
        $post_id = $request->get_param('post_id');
        $sections = $request->get_param('sections');
        
        // Sanitize sections data
        $sections = $this->sanitize_sections($sections);
        
        // Save to post meta
        $result = update_post_meta($post_id, '_aisb_sections', $sections);
        
        return rest_ensure_response([
            'success' => $result !== false,
            'message' => $result !== false ? 'Sections saved successfully' : 'Failed to save sections',
        ]);
    }
    
    /**
     * Load sections
     */
    public function load_sections($request) {
        $post_id = $request->get_param('post_id');
        
        // Get sections from post meta
        $sections = get_post_meta($post_id, '_aisb_sections', true);
        
        if (empty($sections)) {
            $sections = [];
        }
        
        return rest_ensure_response([
            'success' => true,
            'sections' => $sections,
        ]);
    }
    
    /**
     * Get global settings
     */
    public function get_settings() {
        $settings = get_option('aisb_global_settings', [
            'primary_color' => '#2563eb',
            'secondary_color' => '#1e40af',
            'text_color' => '#1f2937',
            'background_color' => '#ffffff',
        ]);
        
        return rest_ensure_response([
            'success' => true,
            'settings' => $settings,
        ]);
    }
    
    /**
     * Save global settings
     */
    public function save_settings($request) {
        $settings = $request->get_param('settings');
        
        // Sanitize settings
        $sanitized_settings = [
            'primary_color' => sanitize_hex_color($settings['primary_color'] ?? '#2563eb'),
            'secondary_color' => sanitize_hex_color($settings['secondary_color'] ?? '#1e40af'),
            'text_color' => sanitize_hex_color($settings['text_color'] ?? '#1f2937'),
            'background_color' => sanitize_hex_color($settings['background_color'] ?? '#ffffff'),
        ];
        
        $result = update_option('aisb_global_settings', $sanitized_settings);
        
        return rest_ensure_response([
            'success' => true,
            'message' => 'Settings saved successfully',
            'settings' => $sanitized_settings,
        ]);
    }
    
    /**
     * Sanitize sections data
     */
    private function sanitize_sections($sections) {
        if (!is_array($sections)) {
            return [];
        }
        
        $sanitized = [];
        
        foreach ($sections as $section) {
            // Basic sanitization - expand this based on section types
            $sanitized_section = [
                'type' => sanitize_text_field($section['type'] ?? ''),
                'id' => sanitize_text_field($section['id'] ?? uniqid('section_')),
                'content' => $this->sanitize_section_content($section['content'] ?? []),
            ];
            
            $sanitized[] = $sanitized_section;
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize section content based on field types
     */
    private function sanitize_section_content($content) {
        $sanitized = [];
        
        foreach ($content as $key => $value) {
            if (is_string($value)) {
                // For HTML content fields, allow safe HTML
                if (in_array($key, ['content', 'outro_content', 'answer'])) {
                    $sanitized[$key] = wp_kses_post($value);
                } else {
                    $sanitized[$key] = sanitize_text_field($value);
                }
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitize_section_content($value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }
}