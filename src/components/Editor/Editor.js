import React, { useEffect } from 'react';
import { useEditor } from '../Providers/EditorProvider';
import Toolbar from './Toolbar';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import RightSidebar from './RightSidebar';

function Editor() {
  const { loadSections, loadGlobalSettings, sections, sidebarsVisible } = useEditor();

  useEffect(() => {
    // Load sections and global settings when editor mounts
    const postId = window.aisbEditor?.postId;
    if (postId) {
      loadSections(postId);
    }
    // Always load global settings
    loadGlobalSettings();
  }, []);

  return (
    <div className="aisb-editor">
      <Toolbar />
      <div className={`aisb-editor-layout ${!sidebarsVisible ? 'aisb-sidebars-hidden' : ''}`}>
        {sidebarsVisible && <LeftSidebar />}
        <Canvas />
        {sidebarsVisible && <RightSidebar />}
      </div>
    </div>
  );
}

export default Editor;