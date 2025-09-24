import React, { useRef, useEffect } from 'react';

function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...', 
  label,
  id,
  help,
  rows = 6 
}) {
  const editorRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize a simple contenteditable div for rich text
    const editor = editorRef.current;
    
    // Set initial content
    if (value && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }

    // Handle input changes
    const handleInput = () => {
      const content = editor.innerHTML;
      onChange(content);
    };

    // Handle paste to clean up content
    const handlePaste = (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/html') ||
                   (e.clipboardData || window.clipboardData).getData('text');
      
      // Simple cleanup - you can expand this
      const cleaned = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      document.execCommand('insertHTML', false, cleaned);
      handleInput();
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('paste', handlePaste);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('paste', handlePaste);
    };
  }, [value, onChange]);

  // Format commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  return (
    <div className="aisb-rich-text-editor">
      {label && (
        <label htmlFor={id} className="aisb-form-label">
          {label}
        </label>
      )}
      <div className="aisb-rich-text-editor__container">
        <div className="aisb-rich-text-editor__toolbar">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="aisb-rich-text-editor__tool"
            title="Bold"
          >
            <span className="dashicons dashicons-editor-bold"></span>
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="aisb-rich-text-editor__tool"
            title="Italic"
          >
            <span className="dashicons dashicons-editor-italic"></span>
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="aisb-rich-text-editor__tool"
            title="Underline"
          >
            <span className="dashicons dashicons-editor-underline"></span>
          </button>
          <span className="aisb-rich-text-editor__separator"></span>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'H2')}
            className="aisb-rich-text-editor__tool"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'H3')}
            className="aisb-rich-text-editor__tool"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'P')}
            className="aisb-rich-text-editor__tool"
            title="Paragraph"
          >
            <span className="dashicons dashicons-editor-paragraph"></span>
          </button>
          <span className="aisb-rich-text-editor__separator"></span>
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="aisb-rich-text-editor__tool"
            title="Bullet List"
          >
            <span className="dashicons dashicons-editor-ul"></span>
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="aisb-rich-text-editor__tool"
            title="Numbered List"
          >
            <span className="dashicons dashicons-editor-ol"></span>
          </button>
          <span className="aisb-rich-text-editor__separator"></span>
          <button
            type="button"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            className="aisb-rich-text-editor__tool"
            title="Insert Link"
          >
            <span className="dashicons dashicons-admin-links"></span>
          </button>
          <button
            type="button"
            onClick={() => execCommand('unlink')}
            className="aisb-rich-text-editor__tool"
            title="Remove Link"
          >
            <span className="dashicons dashicons-editor-unlink"></span>
          </button>
          <span className="aisb-rich-text-editor__separator"></span>
          <button
            type="button"
            onClick={() => execCommand('removeFormat')}
            className="aisb-rich-text-editor__tool"
            title="Clear Formatting"
          >
            <span className="dashicons dashicons-editor-removeformatting"></span>
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="aisb-rich-text-editor__content"
          style={{ minHeight: `${rows * 24}px` }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </div>
      {help && (
        <small className="aisb-form-help">{help}</small>
      )}
    </div>
  );
}

export default RichTextEditor;