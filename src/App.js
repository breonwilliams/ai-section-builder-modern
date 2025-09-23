import React, { useEffect, useState } from 'react';
import Editor from './components/Editor/Editor';
import { EditorProvider } from './components/Providers/EditorProvider';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if WordPress data is available
    if (window.aisbEditor) {
      setIsReady(true);
    } else {
      console.error('AISB Editor: WordPress data not available');
    }
  }, []);

  if (!isReady) {
    return (
      <div className="aisb-loading">
        <p>Initializing editor...</p>
      </div>
    );
  }

  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
}

export default App;