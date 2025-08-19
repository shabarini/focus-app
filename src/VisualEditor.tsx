import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, List, Heading1, Heading2, Heading3, Code, Eye, EyeOff } from 'lucide-react';

interface VisualEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ value, onChange, onBlur, placeholder }) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);

  // Debounced onChange для избежания частых обновлений
  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [onChange, value]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'task-link',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      debouncedOnChange(html);
    },
    editorProps: {
      attributes: {
        class: 'visual-editor-content',
      },
    },
  });

  // Синхронизируем контент редактора с внешним значением
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Переключаемся в визуальный режим
      if (editor) {
        editor.commands.setContent(htmlValue);
      }
      setIsHtmlMode(false);
    } else {
      // Переключаемся в HTML режим
      setHtmlValue(editor ? editor.getHTML() : value);
      setIsHtmlMode(true);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setHtmlValue(newValue);
    onChange(newValue);
  };

  const addLink = () => {
    const url = prompt('Введите URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (isHtmlMode) {
    return (
      <div style={{ border: '1px solid #F0F0F0', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Панель инструментов для HTML режима */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 10px',
          backgroundColor: '#F8F8F8',
          borderBottom: '1px solid #F0F0F0'
        }}>
          <span style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>HTML режим</span>
          <button
            type="button"
            onClick={toggleHtmlMode}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              color: '#666'
            }}
            title="Переключиться в визуальный режим"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Eye size={12} />
            Визуальный
          </button>
        </div>
        
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '10px',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            fontFamily: 'monospace',
            lineHeight: '1.4',
            resize: 'vertical'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #F0F0F0', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Панель инструментов */}
      <div style={{ 
        display: 'flex', 
        gap: '3px', 
        padding: '6px 10px',
        backgroundColor: '#F8F8F8',
        borderBottom: '1px solid #F0F0F0',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? 'active' : ''}
          style={{
            background: editor?.isActive('heading', { level: 1 }) ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Заголовок 1"
          onMouseEnter={(e) => !editor?.isActive('heading', { level: 1 }) && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('heading', { level: 1 }) && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Heading1 size={12} color="#666" />
        </button>
        
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}
          style={{
            background: editor?.isActive('heading', { level: 2 }) ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Заголовок 2"
          onMouseEnter={(e) => !editor?.isActive('heading', { level: 2 }) && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('heading', { level: 2 }) && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Heading2 size={12} color="#666" />
        </button>
        
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive('heading', { level: 3 }) ? 'active' : ''}
          style={{
            background: editor?.isActive('heading', { level: 3 }) ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Заголовок 3"
          onMouseEnter={(e) => !editor?.isActive('heading', { level: 3 }) && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('heading', { level: 3 }) && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Heading3 size={12} color="#666" />
        </button>
        
        <div style={{ width: '1px', backgroundColor: '#E0E0E0', margin: '0 3px' }} />
        
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'active' : ''}
          style={{
            background: editor?.isActive('bold') ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Жирный текст"
          onMouseEnter={(e) => !editor?.isActive('bold') && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('bold') && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bold size={12} color="#666" />
        </button>
        
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'active' : ''}
          style={{
            background: editor?.isActive('italic') ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Курсив"
          onMouseEnter={(e) => !editor?.isActive('italic') && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('italic') && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Italic size={12} color="#666" />
        </button>
        
        <div style={{ width: '1px', backgroundColor: '#E0E0E0', margin: '0 3px' }} />
        
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'active' : ''}
          style={{
            background: editor?.isActive('bulletList') ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Маркированный список"
          onMouseEnter={(e) => !editor?.isActive('bulletList') && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('bulletList') && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <List size={12} color="#666" />
        </button>
        
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'active' : ''}
          style={{
            background: editor?.isActive('orderedList') ? '#E0E0E0' : 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Нумерованный список"
          onMouseEnter={(e) => !editor?.isActive('orderedList') && (e.currentTarget.style.backgroundColor = '#E0E0E0')}
          onMouseLeave={(e) => !editor?.isActive('orderedList') && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Code size={12} color="#666" />
        </button>
        
        <div style={{ width: '1px', backgroundColor: '#E0E0E0', margin: '0 3px' }} />
        
        <button
          type="button"
          onClick={addLink}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Добавить ссылку"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LinkIcon size={12} color="#666" />
        </button>
        
        <div style={{ flex: 1 }} />
        
        <button
          type="button"
          onClick={toggleHtmlMode}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px',
            color: '#666'
          }}
          title="Переключиться в HTML режим"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <EyeOff size={12} />
          HTML
        </button>
      </div>
      
             {/* Область редактирования */}
       <div 
         style={{ 
           minHeight: '100px',
           padding: '10px',
           backgroundColor: 'white'
         }}
         onBlur={onBlur}
       >
         <EditorContent editor={editor} />
       </div>
    </div>
  );
};

export default VisualEditor;
