import React, { useEffect } from 'react';
import { useEditor } from '../Providers/EditorProvider';
import Toolbar from './Toolbar';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import RightSidebar from './RightSidebar';

function Editor() {
  const { loadSections, sections, sidebarsVisible } = useEditor();

  useEffect(() => {
    // Load sections when editor mounts
    const postId = window.aisbEditor?.postId;
    if (postId) {
      loadSections(postId);
    }
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