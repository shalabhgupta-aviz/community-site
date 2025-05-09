import './richTextEditor.css';

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const buttonClass = (isActive) =>
    `px-3 py-1 rounded text-sm font-medium border border-gray-300 hover:bg-gray-100 ${
      isActive ? 'bg-gray-300' : 'bg-white'
    }`;

  return (
    <div className="flex flex-wrap gap-2 bg-gray-100 p-4 rounded-lg border mb-4">
      {[
        ['Bold', 'bold'],
        ['Italic', 'italic'],
        ['Strike', 'strike'],
        ['Code', 'code'],
        ['Paragraph', 'paragraph'],
        ['H1', { type: 'heading', level: 1 }],
        ['H2', { type: 'heading', level: 2 }],
        ['H3', { type: 'heading', level: 3 }],
        ['Bullet list', 'bulletList'],
        ['Ordered list', 'orderedList'],
        ['Code block', 'codeBlock'],
        ['Blockquote', 'blockquote']
      ].map(([label, type]) => (
        <button
          key={label}
          onClick={() =>
            typeof type === 'string'
              ? editor.chain().focus()[`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`]().run()
              : editor.chain().focus().toggleHeading({ level: type.level }).run()
          }
          className={
            typeof type === 'string'
              ? buttonClass(editor.isActive(type))
              : buttonClass(editor.isActive(type.type, { level: type.level }))
          }
        >
          {label}
        </button>
      ))}

      <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className={buttonClass(false)}>
        Clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()} className={buttonClass(false)}>
        Clear nodes
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClass(false)}>
        Horizontal Rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()} className={buttonClass(false)}>
        Hard Break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass(false)}
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass(false)}
      >
        Redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={buttonClass(editor.isActive('textStyle', { color: '#958DF1' }))}
      >
        Purple
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  })
];

const content = `<h1 class='text-xl font-bold'>Hello World</h1>`;

export default function RichTextEditorTailwind() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border shadow">
      <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content} />
    </div>
  );
}