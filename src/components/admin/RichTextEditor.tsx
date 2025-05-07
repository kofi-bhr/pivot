import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Heading2,
  Underline as UnderlineIcon,
  Minus
} from 'lucide-react';

const IndentExtension = Extension.create({
  name: 'indent',
  addKeyboardShortcuts() {
    return {
      'Tab': () => {
        this.editor.commands.insertContent('\t');
        return true;
      },
      'Shift-Tab': () => {
        const { from } = this.editor.state.selection;
        const pos = this.editor.state.doc.resolve(from);
        const line = pos.doc.textBetween(pos.start(), pos.end());
        if (line.startsWith('\t')) {
          this.editor.commands.command(({ tr }) => {
            tr.delete(pos.start(), pos.start() + 1);
            return true;
          });
        }
        return true;
      },
    };
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
    extensions: [
      StarterKit,
      Underline,
      IndentExtension,
      Placeholder.configure({
        placeholder: placeholder || 'Write your content here...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="border rounded-md overflow-hidden">
        <div className="border-b bg-gray-50 p-2 flex gap-1 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Horizontal Rule"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
