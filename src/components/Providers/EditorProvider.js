import React, { createContext, useContext } from 'react';
import { useEditorStore } from '../../stores/editorStore';

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const store = useEditorStore();

  return (
    <EditorContext.Provider value={store}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}