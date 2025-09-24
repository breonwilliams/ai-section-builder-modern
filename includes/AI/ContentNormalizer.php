<?php
namespace AISB\Modern\AI;

/**
 * Content Normalizer
 * 
 * Cleans and normalizes document content for processing
 */
class ContentNormalizer {
    
    /**
     * Normalize document content
     * 
     * @param string $content Raw content
     * @return string Normalized content
     */
    public function normalize($content) {
        // Remove BOM if present
        $content = $this->removeBOM($content);
        
        // Convert encoding to UTF-8
        $content = $this->ensureUTF8($content);
        
        // Remove Word/Google Docs artifacts
        $content = $this->cleanDocumentArtifacts($content);
        
        // Normalize whitespace
        $content = $this->normalizeWhitespace($content);
        
        // Standardize list markers
        $content = $this->standardizeListMarkers($content);
        
        // Fix common encoding issues
        $content = $this->fixEncodingIssues($content);
        
        // Preserve paragraph structure
        $content = $this->preserveParagraphs($content);
        
        return trim($content);
    }
    
    /**
     * Remove Byte Order Mark
     * 
     * @param string $content
     * @return string
     */
    private function removeBOM($content) {
        return preg_replace('/^\xEF\xBB\xBF/', '', $content);
    }
    
    /**
     * Ensure content is UTF-8
     * 
     * @param string $content
     * @return string
     */
    private function ensureUTF8($content) {
        if (!mb_check_encoding($content, 'UTF-8')) {
            $content = mb_convert_encoding($content, 'UTF-8', 'auto');
        }
        return $content;
    }
    
    /**
     * Clean document artifacts from Word/Google Docs
     * 
     * @param string $content
     * @return string
     */
    private function cleanDocumentArtifacts($content) {
        // Remove Word special characters
        $replacements = [
            '"' => '"',  // Smart quotes
            '"' => '"',
            ''' => "'",
            ''' => "'",
            '–' => '-',  // En dash
            '—' => '-',  // Em dash
            '…' => '...',
            '•' => '•',  // Standardize bullet
        ];
        
        $content = str_replace(array_keys($replacements), array_values($replacements), $content);
        
        // Remove non-breaking spaces
        $content = str_replace("\xC2\xA0", ' ', $content);
        $content = str_replace("&nbsp;", ' ', $content);
        
        // Remove zero-width spaces
        $content = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}]/u', '', $content);
        
        // Remove page breaks and similar
        $content = preg_replace('/\f|\r\n|\r/', "\n", $content);
        
        return $content;
    }
    
    /**
     * Normalize whitespace
     * 
     * @param string $content
     * @return string
     */
    private function normalizeWhitespace($content) {
        // Replace multiple spaces with single space
        $content = preg_replace('/[ \t]+/', ' ', $content);
        
        // Replace multiple newlines with double newline
        $content = preg_replace('/\n{3,}/', "\n\n", $content);
        
        // Trim lines
        $lines = explode("\n", $content);
        $lines = array_map('trim', $lines);
        $content = implode("\n", $lines);
        
        return $content;
    }
    
    /**
     * Standardize list markers
     * 
     * @param string $content
     * @return string
     */
    private function standardizeListMarkers($content) {
        // Standardize various bullets to single format
        $bulletVariants = ['*', '◆', '►', '▪', '▫', '○', '◯', '⬥', '◉'];
        
        foreach ($bulletVariants as $variant) {
            $content = preg_replace('/^' . preg_quote($variant, '/') . '\s+/m', '• ', $content);
        }
        
        // Standardize checkmarks
        $checkVariants = ['☑', '✅', '[x]', '[X]', '(x)', '(X)'];
        foreach ($checkVariants as $variant) {
            $content = str_replace($variant, '✓', $content);
        }
        
        return $content;
    }
    
    /**
     * Fix common encoding issues
     * 
     * @param string $content
     * @return string
     */
    private function fixEncodingIssues($content) {
        // Fix common mojibake patterns
        $fixes = [
            'â€™' => "'",
            'â€œ' => '"',
            'â€' => '"',
            'â€"' => '-',
            'â€¢' => '•',
            'Ã©' => 'é',
            'Ã¨' => 'è',
            'Ã ' => 'à',
            'Ã¢' => 'â',
        ];
        
        return str_replace(array_keys($fixes), array_values($fixes), $content);
    }
    
    /**
     * Preserve paragraph structure
     * 
     * @param string $content
     * @return string
     */
    private function preserveParagraphs($content) {
        // Add double newline after sentences ending with period
        // followed by capital letter
        $content = preg_replace('/\.\s+([A-Z])/', ".\n\n$1", $content);
        
        // Preserve existing double newlines
        $content = preg_replace('/\n\n+/', "\n\n", $content);
        
        return $content;
    }
    
    /**
     * Segment content into logical sections
     * 
     * @param string $content Normalized content
     * @return array Content segments
     */
    public function segmentContent($content) {
        $segments = [];
        
        // Common section headers
        $sectionMarkers = [
            'about us', 'about our', 'who we are',
            'services', 'our services', 'what we do', 'what we offer',
            'features', 'key features', 'why choose us',
            'how it works', 'our process', 'getting started',
            'testimonials', 'what people say', 'reviews',
            'pricing', 'plans', 'packages',
            'contact', 'get in touch', 'reach out',
            'faq', 'frequently asked', 'questions'
        ];
        
        // Split content into lines
        $lines = explode("\n", $content);
        $currentSegment = '';
        $currentHeader = '';
        
        foreach ($lines as $line) {
            $lineLower = strtolower(trim($line));
            $isHeader = false;
            
            // Check if line is a section header
            foreach ($sectionMarkers as $marker) {
                if (stripos($lineLower, $marker) !== false) {
                    // Save current segment if exists
                    if (!empty($currentSegment)) {
                        $segments[] = $currentHeader . "\n" . $currentSegment;
                    }
                    
                    // Start new segment
                    $currentHeader = $line;
                    $currentSegment = '';
                    $isHeader = true;
                    break;
                }
            }
            
            // Add line to current segment if not a header
            if (!$isHeader) {
                if (!empty($line)) {
                    $currentSegment .= $line . "\n";
                }
            }
        }
        
        // Add final segment
        if (!empty($currentSegment)) {
            $segments[] = $currentHeader . "\n" . $currentSegment;
        }
        
        // If no segments found, treat entire content as one segment
        if (empty($segments)) {
            $segments[] = $content;
        }
        
        return $segments;
    }
    
    /**
     * Extract metadata from content
     * 
     * @param string $content
     * @return array
     */
    public function extractMetadata($content) {
        $metadata = [];
        
        // Look for company name (often in first line or after copyright)
        if (preg_match('/^([A-Z][A-Za-z\s&]+(?:Inc|LLC|Corp|Company|Co\.?)?)/', $content, $matches)) {
            $metadata['company_name'] = trim($matches[1]);
        }
        
        // Look for phone numbers
        if (preg_match('/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/', $content, $matches)) {
            $metadata['phone'] = $matches[0];
        }
        
        // Look for email addresses
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $content, $matches)) {
            $metadata['email'] = $matches[0];
        }
        
        // Look for URLs
        if (preg_match('/(https?:\/\/[^\s]+)/', $content, $matches)) {
            $metadata['website'] = $matches[1];
        }
        
        return $metadata;
    }
}