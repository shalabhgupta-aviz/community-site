'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from 'primereact/editor';

export default function SimpleRichTextEditor({ initialHtml = '', onChange }) {
  const [text, setText] = useState(initialHtml);

  useEffect(() => {
    setText(initialHtml);
  }, [initialHtml]);

  const handleTextChange = (e) => {
    const newText = e.htmlValue;
    setText(newText);
    onChange(newText);
  };

  return (
    <div className="card rounded-[10px] min-h-[150px] focus:outline-none">
      <Editor
        style={{ height: '150px' }}
        value={text}
        onTextChange={handleTextChange}
        headerTemplate={
          <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
            <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
            <button className="ql-link" aria-label="Insert Link"></button>
          </span>
        }
      />
    </div>
  );
}