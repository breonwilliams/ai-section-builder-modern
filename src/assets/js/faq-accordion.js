/**
 * AI Section Builder - FAQ Accordion
 * Simple vanilla JavaScript accordion functionality
 * 
 * @package AISB
 * @version 2.0.0
 */

(function() {
    'use strict';

    let initialized = false;

    /**
     * Initialize FAQ accordions
     */
    function initFAQAccordions() {
        // Prevent multiple initializations
        if (initialized) return;
        
        // Get all FAQ items
        const items = document.querySelectorAll('.aisb-faq__item');
        
        if (items.length === 0) {
            return;
        }
        
        // Initialize each FAQ item
        items.forEach(function(item, index) {
            const question = item.querySelector('.aisb-faq__item-question');
            
            if (!question) return;
            
            // Add click handler
            question.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle expanded state
                item.classList.toggle('aisb-faq__item--expanded');
            });
            
            // Add keyboard support (Enter and Space keys)
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    item.classList.toggle('aisb-faq__item--expanded');
                }
            });
            
            // Add keyboard accessibility attributes
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');
            question.setAttribute('aria-expanded', 'false');
        });
        
        // Update aria-expanded on clicks
        items.forEach(function(item) {
            const question = item.querySelector('.aisb-faq__item-question');
            if (!question) return;
            
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        const isExpanded = item.classList.contains('aisb-faq__item--expanded');
                        question.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                    }
                });
            });
            
            observer.observe(item, { attributes: true });
        });
        
        initialized = true;
    }
    
    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFAQAccordions);
    } else {
        // DOM is already loaded - initialize with small delay
        setTimeout(initFAQAccordions, 100);
    }
    
    // Also initialize on window load as backup
    window.addEventListener('load', initFAQAccordions);

})();