<?php
namespace AISB\Modern\AI;

/**
 * Content Pattern Definitions
 * 
 * Defines patterns for identifying and extracting content sections
 * from documents. Based on research of real-world content structures.
 */
class ContentPatterns {
    
    /**
     * Hero Section Patterns
     */
    const HERO_PATTERNS = [
        // Opening triggers that indicate hero content
        'triggers' => [
            'welcome to',
            'introducing',
            'the future of',
            'your trusted',
            'leading provider',
            'we are',
            'transforming',
            'revolutionizing',
            'discover how',
            'the ultimate'
        ],
        
        // CTA patterns
        'cta_primary' => [
            'get started',
            'start now',
            'try free',
            'sign up',
            'book now',
            'schedule',
            'get quote',
            'contact us',
            'request demo'
        ],
        
        'cta_secondary' => [
            'learn more',
            'discover',
            'explore',
            'read more',
            'view details',
            'see how',
            'watch video',
            'download'
        ],
        
        // Structure patterns
        'structure' => [
            'headline_length' => ['min' => 10, 'max' => 60],
            'tagline_length' => ['min' => 15, 'max' => 100],
            'body_length' => ['min' => 50, 'max' => 200]
        ]
    ];
    
    /**
     * Features Section Patterns  
     */
    const FEATURES_PATTERNS = [
        // Section triggers
        'triggers' => [
            'features',
            'what we offer',
            'services',
            'what\'s included',
            'we provide',
            'our services',
            'capabilities',
            'benefits',
            'solutions',
            'what you get'
        ],
        
        // List markers
        'list_markers' => [
            '•',
            '✓',
            '✔',
            '★',
            '-',
            '*',
            '→',
            '▸'
        ],
        
        // Structure
        'structure' => [
            'min_items' => 3,
            'max_items' => 6,
            'item_length' => ['min' => 20, 'max' => 150]
        ]
    ];
    
    /**
     * Industry-specific patterns
     */
    const INDUSTRY_PATTERNS = [
        'service_business' => [
            'keywords' => [
                'consultation', 'appointment', 'licensed',
                'certified', 'insured', 'experienced',
                'professional', 'trusted', 'local'
            ],
            'cta_style' => 'professional'
        ],
        
        'ecommerce' => [
            'keywords' => [
                'shop', 'buy', 'cart', 'products',
                'shipping', 'returns', 'warranty',
                'price', 'sale', 'discount'
            ],
            'cta_style' => 'commerce'
        ],
        
        'saas' => [
            'keywords' => [
                'platform', 'solution', 'software',
                'integration', 'api', 'dashboard',
                'analytics', 'automation', 'workflow'
            ],
            'cta_style' => 'trial'
        ]
    ];
    
    /**
     * Get patterns for a specific section type
     */
    public static function getPatterns($sectionType) {
        $type = strtoupper($sectionType);
        $constant = "self::{$type}_PATTERNS";
        
        if (defined($constant)) {
            return constant($constant);
        }
        
        return [];
    }
    
    /**
     * Check if text matches any trigger patterns
     */
    public static function matchesTrigger($text, $triggers) {
        $text = strtolower($text);
        
        foreach ($triggers as $trigger) {
            if (stripos($text, $trigger) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Detect industry type from content
     */
    public static function detectIndustry($content) {
        $content = strtolower($content);
        $scores = [];
        
        foreach (self::INDUSTRY_PATTERNS as $industry => $patterns) {
            $score = 0;
            foreach ($patterns['keywords'] as $keyword) {
                if (stripos($content, $keyword) !== false) {
                    $score++;
                }
            }
            $scores[$industry] = $score;
        }
        
        // Return industry with highest score
        arsort($scores);
        $topIndustry = key($scores);
        
        return $scores[$topIndustry] > 2 ? $topIndustry : 'general';
    }
    
    /**
     * Get appropriate CTA style for industry
     */
    public static function getCTAStyle($industry) {
        if (isset(self::INDUSTRY_PATTERNS[$industry])) {
            return self::INDUSTRY_PATTERNS[$industry]['cta_style'];
        }
        
        return 'general';
    }
}