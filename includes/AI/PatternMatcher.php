<?php
namespace AISB\Modern\AI;

/**
 * Pattern Matcher
 * 
 * Utility class for matching and extracting patterns from content
 */
class PatternMatcher {
    
    /**
     * Find lists in content
     * 
     * @param string $content Content to search
     * @return array List items found
     */
    public function findLists($content) {
        $lists = [];
        
        // Various list patterns
        $patterns = [
            '/^[\•\✓\✔\★\▸\→]\s+(.+)$/m',     // Bullet symbols
            '/^[-\*]\s+(.+)$/m',               // Dash/asterisk lists
            '/^\d+[\.\)]\s+(.+)$/m',           // Numbered lists
            '/^[a-z][\.\)]\s+(.+)$/mi',        // Lettered lists
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $content, $matches)) {
                $lists = array_merge($lists, $matches[1]);
            }
        }
        
        // Also check for lines that look like list items without markers
        if (empty($lists)) {
            $lines = explode("\n", $content);
            foreach ($lines as $line) {
                $line = trim($line);
                // Short lines that aren't empty and don't end with period
                if (strlen($line) > 10 && strlen($line) < 100 && !str_ends_with($line, '.')) {
                    $lists[] = $line;
                }
            }
        }
        
        return array_unique($lists);
    }
    
    /**
     * Check if a line is a list item
     * 
     * @param string $line Line to check
     * @return bool
     */
    public function isListItem($line) {
        $line = trim($line);
        
        // Check for list markers
        $patterns = [
            '/^[\•\✓\✔\★\▸\→\-\*]/u',
            '/^\d+[\.\)]\s/',
            '/^[a-z][\.\)]\s/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $line)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Extract CTAs from content
     * 
     * @param string $content Content to search
     * @param string $industry Industry type for context
     * @return array CTAs found
     */
    public function findCTAs($content, $industry = 'general') {
        $found_ctas = [];
        $content_lower = strtolower($content);
        
        // Get CTA patterns
        $heroPatterns = ContentPatterns::getPatterns('hero');
        
        // Look for primary CTAs
        foreach ($heroPatterns['cta_primary'] as $cta) {
            if (stripos($content_lower, $cta) !== false) {
                $found_ctas[] = [
                    'text' => $this->formatCTA($cta),
                    'url' => '#',
                    'style' => 'primary',
                    'target' => '_self'
                ];
                break; // Only one primary
            }
        }
        
        // Look for secondary CTAs
        foreach ($heroPatterns['cta_secondary'] as $cta) {
            if (stripos($content_lower, $cta) !== false) {
                $found_ctas[] = [
                    'text' => $this->formatCTA($cta),
                    'url' => '#',
                    'style' => 'secondary',
                    'target' => '_self'
                ];
                break; // Only one secondary
            }
        }
        
        // If no CTAs found, provide defaults based on industry
        if (empty($found_ctas)) {
            $found_ctas = $this->getDefaultCTAs($industry);
        }
        
        return $found_ctas;
    }
    
    /**
     * Format CTA text
     * 
     * @param string $cta Raw CTA text
     * @return string Formatted CTA
     */
    private function formatCTA($cta) {
        return ucwords(str_replace(['_', '-'], ' ', $cta));
    }
    
    /**
     * Get default CTAs based on industry
     * 
     * @param string $industry Industry type
     * @return array Default CTAs
     */
    private function getDefaultCTAs($industry) {
        $defaults = [
            'service_business' => [
                ['text' => 'Get Free Quote', 'url' => '#', 'style' => 'primary', 'target' => '_self'],
                ['text' => 'Learn More', 'url' => '#', 'style' => 'secondary', 'target' => '_self']
            ],
            'ecommerce' => [
                ['text' => 'Shop Now', 'url' => '#', 'style' => 'primary', 'target' => '_self'],
                ['text' => 'View Catalog', 'url' => '#', 'style' => 'secondary', 'target' => '_self']
            ],
            'saas' => [
                ['text' => 'Start Free Trial', 'url' => '#', 'style' => 'primary', 'target' => '_self'],
                ['text' => 'Watch Demo', 'url' => '#', 'style' => 'secondary', 'target' => '_self']
            ],
            'general' => [
                ['text' => 'Get Started', 'url' => '#', 'style' => 'primary', 'target' => '_self'],
                ['text' => 'Learn More', 'url' => '#', 'style' => 'secondary', 'target' => '_self']
            ]
        ];
        
        return $defaults[$industry] ?? $defaults['general'];
    }
    
    /**
     * Extract headings from content
     * 
     * @param string $content Content to search
     * @return array Headings found
     */
    public function findHeadings($content) {
        $headings = [];
        
        // Look for lines that appear to be headings
        $lines = explode("\n", $content);
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Skip empty lines
            if (empty($line)) continue;
            
            // Characteristics of headings:
            // - Shorter than 80 chars
            // - No ending punctuation (except ?, !)
            // - Often all caps or title case
            // - May end with colon
            if (strlen($line) < 80 && 
                !str_ends_with($line, '.') &&
                (preg_match('/^[A-Z\s]+$/', $line) || // All caps
                 preg_match('/^[A-Z][a-z]+(\s[A-Z][a-z]+)*/', $line) || // Title case
                 str_ends_with($line, ':'))) {
                $headings[] = rtrim($line, ':');
            }
        }
        
        return $headings;
    }
    
    /**
     * Extract questions from content (for FAQ detection)
     * 
     * @param string $content Content to search
     * @return array Questions found
     */
    public function findQuestions($content) {
        $questions = [];
        
        // Match lines ending with question mark
        if (preg_match_all('/^(.+\?)$/m', $content, $matches)) {
            $questions = $matches[1];
        }
        
        // Also match common question starters
        $questionStarters = [
            'how do', 'how can', 'what is', 'what are',
            'why do', 'why should', 'when can', 'when should',
            'where can', 'where do', 'can i', 'can we',
            'do you', 'does your', 'will you', 'is there'
        ];
        
        $lines = explode("\n", strtolower($content));
        foreach ($lines as $line) {
            $line = trim($line);
            foreach ($questionStarters as $starter) {
                if (str_starts_with($line, $starter)) {
                    $questions[] = $line;
                    break;
                }
            }
        }
        
        return array_unique($questions);
    }
}