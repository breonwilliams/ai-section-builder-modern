import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';

// Default global settings
export const DEFAULT_GLOBAL_SETTINGS = {
  // Main Brand Colors
  primary_color: '#3B82F6',      // Blue
  secondary_color: '#8B5CF6',    // Purple
  
  // Light Mode Colors
  text_color: '#1f2937',         // Dark gray text
  muted_text_color: '#6b7280',   // Muted text for eyebrows, captions
  background_color: '#ffffff',   // White background
  surface_color: '#f9fafb',      // Slightly gray surface for cards
  border_color: '#e5e7eb',       // Border color for cards
  
  // Dark Mode Colors
  dark_background: '#1a1a1a',    // Dark background
  dark_surface: '#2a2a2a',       // Slightly lighter surface for cards
  dark_text: '#fafafa',          // Light text for dark mode
  dark_muted_text: '#9ca3af',    // Muted text for dark mode
  dark_border: '#4b5563',        // Border color for dark mode
};

export const useEditorStore = create(
  immer((set, get) => ({
    // State
    sections: [],
    currentSectionIndex: null,
    isDirty: false,
    isSaving: false,
    isLoading: false,
    sidebarsVisible: true,
    showGlobalSettings: false,
    globalSettings: { ...DEFAULT_GLOBAL_SETTINGS },

    // Actions
    loadSections: async (postId) => {
      if (!postId) {
        console.log('No post ID, starting with empty sections');
        return;
      }

      set((state) => {
        state.isLoading = true;
      });

      try {
        const response = await axios.get(
          `${window.aisbEditor.apiUrl}sections/${postId}`,
          {
            headers: {
              'X-WP-Nonce': window.aisbEditor.nonce,
            },
          }
        );

        if (response.data.success) {
          set((state) => {
            state.sections = response.data.sections || [];
            state.isDirty = false;
          });
        }
      } catch (error) {
        console.error('Failed to load sections:', error);
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    saveSections: async () => {
      const postId = window.aisbEditor.postId;
      if (!postId) {
        console.error('No post ID for saving');
        return false;
      }

      set((state) => {
        state.isSaving = true;
      });

      try {
        const response = await axios.post(
          `${window.aisbEditor.apiUrl}sections`,
          {
            post_id: postId,
            sections: get().sections,
          },
          {
            headers: {
              'X-WP-Nonce': window.aisbEditor.nonce,
            },
          }
        );

        if (response.data.success) {
          set((state) => {
            state.isDirty = false;
          });
          return true;
        }
      } catch (error) {
        console.error('Failed to save sections:', error);
        return false;
      } finally {
        set((state) => {
          state.isSaving = false;
        });
      }
    },

    addSection: (type) => {
      const newSection = {
        id: `section_${Date.now()}`,
        type: type,
        content: getDefaultContent(type),
      };

      set((state) => {
        state.sections.push(newSection);
        state.currentSectionIndex = state.sections.length - 1;
        state.isDirty = true;
      });
    },

    updateSection: (index, updates) => {
      set((state) => {
        if (state.sections[index]) {
          state.sections[index].content = {
            ...state.sections[index].content,
            ...updates,
          };
          state.isDirty = true;
        }
      });
    },

    deleteSection: (index) => {
      set((state) => {
        state.sections.splice(index, 1);
        if (state.currentSectionIndex >= state.sections.length) {
          state.currentSectionIndex = state.sections.length - 1;
        }
        state.isDirty = true;
      });
    },

    setCurrentSection: (index) => {
      set((state) => {
        state.currentSectionIndex = index;
      });
    },

    reorderSections: (fromIndex, toIndex) => {
      set((state) => {
        const section = state.sections[fromIndex];
        state.sections.splice(fromIndex, 1);
        state.sections.splice(toIndex, 0, section);
        state.isDirty = true;
      });
    },

    toggleSidebars: () => {
      set((state) => {
        state.sidebarsVisible = !state.sidebarsVisible;
      });
    },

    setSidebarsVisible: (visible) => {
      set((state) => {
        state.sidebarsVisible = visible;
      });
    },

    setShowGlobalSettings: (show) => {
      set((state) => {
        state.showGlobalSettings = show;
        // Clear current section when showing global settings
        if (show) {
          state.currentSectionIndex = null;
        }
      });
    },
    
    setSections: (sections) => {
      set((state) => {
        state.sections = sections;
        state.isDirty = true;
        // Reset current section if it's out of bounds
        if (state.currentSectionIndex >= sections.length) {
          state.currentSectionIndex = sections.length > 0 ? sections.length - 1 : null;
        }
      });
    },

    // Global Settings Actions
    updateGlobalSettings: (settings) => {
      set((state) => {
        state.globalSettings = { ...state.globalSettings, ...settings };
      });
      
      // Update CSS variables immediately for live preview
      const root = document.documentElement;
      Object.entries(settings).forEach(([key, value]) => {
        // Map the settings keys to the correct CSS variable names
        const varMap = {
          'primary_color': '--aisb-color-primary',
          'secondary_color': '--aisb-color-secondary',
          'text_color': '--aisb-color-text',
          'muted_text_color': '--aisb-color-text-muted',
          'background_color': '--aisb-color-background',
          'surface_color': '--aisb-color-surface',
          'border_color': '--aisb-color-border',
          'dark_background': '--aisb-color-dark-background',
          'dark_surface': '--aisb-color-dark-surface',
          'dark_text': '--aisb-color-dark-text',
          'dark_muted_text': '--aisb-color-dark-text-muted',
          'dark_border': '--aisb-color-dark-border'
        };
        
        const cssVarName = varMap[key];
        if (cssVarName) {
          root.style.setProperty(cssVarName, value);
        }
      });
    },

    saveGlobalSettings: async (settings) => {
      try {
        const response = await axios.post(
          `${window.aisbEditor.apiUrl}settings`,
          { settings },
          {
            headers: {
              'X-WP-Nonce': window.aisbEditor.nonce,
            },
          }
        );

        if (response.data.success) {
          set((state) => {
            state.globalSettings = settings;
          });
          return true;
        }
      } catch (error) {
        console.error('Failed to save global settings:', error);
        throw error;
      }
    },

    loadGlobalSettings: async () => {
      try {
        const response = await axios.get(
          `${window.aisbEditor.apiUrl}settings`,
          {
            headers: {
              'X-WP-Nonce': window.aisbEditor.nonce,
            },
          }
        );

        if (response.data.success && response.data.settings) {
          // Merge with defaults to ensure all fields are present
          const mergedSettings = {
            ...DEFAULT_GLOBAL_SETTINGS,
            ...response.data.settings
          };
          
          set((state) => {
            state.globalSettings = mergedSettings;
          });

          // Apply settings to CSS variables
          get().updateGlobalSettings(mergedSettings);
        }
      } catch (error) {
        console.error('Failed to load global settings:', error);
      }
    },

    resetGlobalSettings: () => {
      set((state) => {
        state.globalSettings = { ...DEFAULT_GLOBAL_SETTINGS };
      });
      
      // Apply default settings to CSS variables
      get().updateGlobalSettings(DEFAULT_GLOBAL_SETTINGS);
    },
  }))
);

// Helper function to get default content for a section type
function getDefaultContent(type) {
  switch (type) {
    case 'hero':
      return {
        eyebrow_heading: '',
        heading: 'Your Headline Here',
        content: '<p>Add your content here...</p>',
        outro_content: '',
        media_type: 'none',
        featured_image: '',
        video_url: '',
        theme_variant: 'light',
        layout_variant: 'content-left',
        buttons: [
          {
            text: 'Get Started',
            url: '#',
            style: 'primary',
            target: '_self',
          },
        ],
      };
    case 'features':
      return {
        eyebrow_heading: '',
        heading: 'Our Features',
        content: '<p>Discover what makes us different</p>',
        outro_content: '',
        media_type: 'none',
        featured_image: '',
        video_url: '',
        theme_variant: 'light',
        layout_variant: 'content-left',
        grid_columns: '3',
        card_alignment: 'left',
        cards: [
          {
            heading: 'Feature One',
            content: 'Brief description of this amazing feature',
            image: '',
            link: '',
            link_text: 'Learn More',
            link_target: '_self',
          },
          {
            heading: 'Feature Two',
            content: 'Another great feature that sets us apart',
            image: '',
            link: '',
            link_text: 'Learn More',
            link_target: '_self',
          },
          {
            heading: 'Feature Three',
            content: 'Yet another benefit for our customers',
            image: '',
            link: '',
            link_text: 'Learn More',
            link_target: '_self',
          },
        ],
        buttons: [],
      };
    case 'stats':
      return {
        // HEADER BLOCK - Standard fields
        eyebrow_heading: '',
        heading: 'By the Numbers',
        content: '<p>Our impact speaks for itself</p>',
        media_type: 'none',
        featured_image: '',
        video_url: '',
        
        // ITEMS BLOCK - Stats specific
        grid_columns: '3',
        stat_alignment: 'center',
        stats: [
          {
            value: '99%',
            label: 'Customer Satisfaction',
            description: '',
          },
          {
            value: '500+',
            label: 'Projects Completed',
            description: '',
          },
          {
            value: '24/7',
            label: 'Support Available',
            description: '',
          },
        ],
        
        // FOOTER BLOCK - Standard fields
        outro_content: '',
        buttons: [],
        
        // SETTINGS - Standard fields
        theme_variant: 'light',
        layout_variant: 'content-left',
      };
    default:
      return {};
  }
}