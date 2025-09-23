import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';

export const useEditorStore = create(
  immer((set, get) => ({
    // State
    sections: [],
    currentSectionIndex: null,
    isDirty: false,
    isSaving: false,
    isLoading: false,
    sidebarsVisible: true,
    globalSettings: {
      primary_color: '#2563eb',
      secondary_color: '#1e40af',
      text_color: '#1f2937',
      background_color: '#ffffff',
    },

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
    default:
      return {};
  }
}