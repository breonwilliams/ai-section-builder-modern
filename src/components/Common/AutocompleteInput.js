import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AutocompleteInput({ 
  value, 
  onChange, 
  placeholder = 'Start typing to search pages/posts...', 
  label,
  id 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPosts = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use the WordPress REST API base URL (not our custom endpoint)
      const wpApiUrl = window.aisbEditor.apiUrl.replace('ai-section-builder/v1/', '');
      
      // Search both posts and pages
      const [postsResponse, pagesResponse] = await Promise.all([
        axios.get(`${wpApiUrl}wp/v2/posts`, {
          params: {
            search: searchTerm,
            per_page: 5,
            _fields: 'id,title,link,type'
          },
          headers: {
            'X-WP-Nonce': window.aisbEditor.nonce,
          },
        }),
        axios.get(`${wpApiUrl}wp/v2/pages`, {
          params: {
            search: searchTerm,
            per_page: 5,
            _fields: 'id,title,link,type'
          },
          headers: {
            'X-WP-Nonce': window.aisbEditor.nonce,
          },
        })
      ]);

      const posts = postsResponse.data.map(post => ({
        ...post,
        type: 'post',
        title: post.title.rendered
      }));
      
      const pages = pagesResponse.data.map(page => ({
        ...page,
        type: 'page',
        title: page.title.rendered
      }));

      setSuggestions([...pages, ...posts]);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    // Debounce the search
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchPosts(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.link);
    onChange(suggestion.link);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (inputValue.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="aisb-autocomplete" ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="aisb-form-label">
          {label}
        </label>
      )}
      <div className="aisb-autocomplete__wrapper">
        <input
          type="text"
          id={id}
          className="aisb-form-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
        />
        {isLoading && (
          <span className="aisb-autocomplete__loading">
            <span className="dashicons dashicons-update spin"></span>
          </span>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="aisb-autocomplete__suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                type="button"
                className="aisb-autocomplete__suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="aisb-autocomplete__suggestion-title">
                  {suggestion.title}
                </span>
                <span className="aisb-autocomplete__suggestion-type">
                  {suggestion.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {inputValue && !inputValue.startsWith('http') && !inputValue.startsWith('#') && (
        <small className="aisb-form-help">
          Tip: You can also enter external URLs (https://...) or anchors (#section)
        </small>
      )}
    </div>
  );
}

export default AutocompleteInput;