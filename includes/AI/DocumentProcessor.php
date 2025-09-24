<?php
namespace AISB\Modern\AI;

/**
 * Document Processor
 * 
 * Main class for processing documents and extracting sections
 * based on content patterns. Converts unstructured text into
 * structured section data.
 */
class DocumentProcessor {
    
    /**
     * @var ContentPatterns
     */
    private $patterns;
    
    /**
     * @var PatternMatcher
     */
    private $matcher;
    
    /**
     * @var ContentNormalizer
     */
    private $normalizer;
    
    /**
     * @var array Extracted sections
     */
    private $sections = [];
    
    /**
     * @var string Detected industry type
     */
    private $industry = 'general';
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->patterns = new ContentPatterns();
        $this->matcher = new PatternMatcher();
        $this->normalizer = new ContentNormalizer();
    }
    
    /**
     * Process a document and extract sections
     * 
     * @param string $content Raw document content
     * @return array Array of section data
     */
    public function processDocument($content) {
        // Reset sections
        $this->sections = [];
        
        // Normalize content
        $normalized = $this->normalizer->normalize($content);
        
        // Detect industry type
        $this->industry = ContentPatterns::detectIndustry($normalized);
        
        // Segment content into logical parts
        $segments = $this->normalizer->segmentContent($normalized);
        
        // Extract sections based on patterns
        $this->extractHero($segments);
        $this->extractFeatures($segments);
        
        // Apply visual rhythm (alternating themes)
        $this->applyVisualRhythm();
        
        return [
            'sections' => $this->sections,
            'metadata' => [
                'industry' => $this->industry,
                'section_count' => count($this->sections)
            ]
        ];
    }
    
    /**
     * Extract Hero section from content
     * 
     * @param array $segments Content segments
     */
    private function extractHero($segments) {
        $heroPatterns = ContentPatterns::getPatterns('hero');
        
        // Look for hero content in first segments
        $heroContent = '';
        $headline = '';
        $body = '';
        
        // Check first segment for headline
        if (!empty($segments[0])) {
            $lines = explode("\n", trim($segments[0]));
            
            // First substantial line is likely headline
            foreach ($lines as $line) {
                $line = trim($line);
                if (strlen($line) >= $heroPatterns['structure']['headline_length']['min'] &&
                    strlen($line) <= $heroPatterns['structure']['headline_length']['max']) {
                    $headline = $line;
                    break;
                }
            }
            
            // Rest is body content
            $bodyLines = array_slice($lines, 1);
            $body = implode("\n", $bodyLines);
            
            // Clean up body
            $body = trim($body);
            if (strlen($body) > $heroPatterns['structure']['body_length']['max']) {
                $body = substr($body, 0, $heroPatterns['structure']['body_length']['max']) . '...';
            }
        }
        
        // Extract CTAs
        $buttons = $this->matcher->findCTAs($segments[0] ?? '', $this->industry);
        
        // Build hero section
        $this->sections[] = [
            'type' => 'hero',
            'content' => [
                'eyebrow_heading' => '',
                'heading' => $headline ?: 'Welcome to Our Business',
                'content' => '<p>' . ($body ?: 'Transform your business with our innovative solutions.') . '</p>',
                'outro_content' => '',
                'media_type' => 'none',
                'featured_image' => '',
                'video_url' => '',
                'theme_variant' => 'dark', // Start with dark
                'layout_variant' => 'content-left',
                'buttons' => $buttons
            ]
        ];
    }
    
    /**
     * Extract Features section from content
     * 
     * @param array $segments Content segments
     */
    private function extractFeatures($segments) {
        $featurePatterns = ContentPatterns::getPatterns('features');
        $featureCards = [];
        $featureHeading = '';
        $featureIntro = '';
        
        // Look for features section
        foreach ($segments as $segment) {
            // Check for features triggers
            if (ContentPatterns::matchesTrigger($segment, $featurePatterns['triggers'])) {
                // Extract heading
                $lines = explode("\n", trim($segment));
                if (!empty($lines[0])) {
                    $featureHeading = trim($lines[0]);
                }
                
                // Extract intro if present
                if (isset($lines[1]) && !$this->matcher->isListItem($lines[1])) {
                    $featureIntro = trim($lines[1]);
                }
                
                // Extract list items as features
                $listItems = $this->matcher->findLists($segment);
                
                // Convert to feature cards
                foreach ($listItems as $index => $item) {
                    if ($index >= $featurePatterns['structure']['max_items']) {
                        break;
                    }
                    
                    // Parse item for title and description
                    $parts = $this->parseFeatureItem($item);
                    
                    $featureCards[] = [
                        'heading' => $parts['title'],
                        'content' => $parts['description'],
                        'image' => '',
                        'link' => '',
                        'link_text' => 'Learn More',
                        'link_target' => '_self'
                    ];
                }
                
                break; // Found features section
            }
        }
        
        // Only add features if we found some
        if (!empty($featureCards) || !empty($featureHeading)) {
            // Ensure we have at least 3 features
            while (count($featureCards) < 3) {
                $featureCards[] = [
                    'heading' => 'Feature ' . (count($featureCards) + 1),
                    'content' => 'Description of this feature and its benefits.',
                    'image' => '',
                    'link' => '',
                    'link_text' => 'Learn More',
                    'link_target' => '_self'
                ];
            }
            
            $this->sections[] = [
                'type' => 'features',
                'content' => [
                    'eyebrow_heading' => '',
                    'heading' => $featureHeading ?: 'Our Features',
                    'content' => '<p>' . ($featureIntro ?: 'Discover what makes us different') . '</p>',
                    'outro_content' => '',
                    'media_type' => 'none',
                    'featured_image' => '',
                    'video_url' => '',
                    'theme_variant' => 'light', // Alternate with hero
                    'layout_variant' => 'content-left',
                    'card_alignment' => 'left',
                    'cards' => $featureCards,
                    'buttons' => []
                ]
            ];
        }
    }
    
    /**
     * Parse a feature item into title and description
     * 
     * @param string $item Feature item text
     * @return array
     */
    private function parseFeatureItem($item) {
        // Look for colon or dash separator
        if (strpos($item, ':') !== false) {
            list($title, $description) = explode(':', $item, 2);
        } elseif (strpos($item, ' - ') !== false) {
            list($title, $description) = explode(' - ', $item, 2);
        } else {
            // Use first part as title
            $words = explode(' ', $item);
            $title = implode(' ', array_slice($words, 0, 3));
            $description = implode(' ', array_slice($words, 3));
        }
        
        return [
            'title' => trim($title),
            'description' => trim($description) ?: 'Learn more about this feature.'
        ];
    }
    
    /**
     * Apply visual rhythm to sections
     */
    private function applyVisualRhythm() {
        $themes = ['dark', 'light', 'dark', 'light'];
        
        foreach ($this->sections as $index => &$section) {
            // Alternate themes for visual rhythm
            $section['content']['theme_variant'] = $themes[$index % count($themes)];
        }
    }
}