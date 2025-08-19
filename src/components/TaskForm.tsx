import React, { useRef } from 'react';
import { Plus, Paperclip, Upload } from 'lucide-react';
import VisualEditor from '../VisualEditor';

type Section = 'today' | 'todo' | 'done';

export interface TaskFormProps {
  newTask: string;
  newTaskNotes: string;
  newTaskTags: string[];
  newTaskFiles: any[];
  selectedProject: string;
  showNewTaskExpanded: boolean;
  projects: Array<{ id: string; name: string; color: string }>;
  availableTags: string[];
  colors: any;
  onNewTaskChange: (value: string) => void;
  onNewTaskNotesChange: (value: string) => void;
  onNewTaskTagsChange: (tags: string[]) => void;
  onNewTaskFilesChange: (files: any[]) => void;
  onSelectedProjectChange: (project: string) => void;
  onShowNewTaskExpandedChange: (expanded: boolean) => void;
  onAddTask: () => void;
  onAddTag: (tagName: string) => void;
  onRemoveNewTaskTag: (tag: string) => void;
  onHandleFileUpload: (files: FileList | null, isNewTask: boolean, taskId: number, section: Section) => void;
  onRemoveFile: (fileId: number, isNewTask: boolean, taskId: number, section: Section) => void;
  activeSection: Section;
}

const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  newTaskNotes,
  newTaskTags,
  newTaskFiles,
  selectedProject,
  showNewTaskExpanded,
  projects,
  availableTags,
  colors,
  onNewTaskChange,
  onNewTaskNotesChange,
  onNewTaskTagsChange,
  onNewTaskFilesChange,
  onSelectedProjectChange,
  onShowNewTaskExpandedChange,
  onAddTask,
  onAddTag,
  onRemoveNewTaskTag,
  onHandleFileUpload,
  onRemoveFile,
  activeSection
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAddTask();
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    onHandleFileUpload(files, true, 0, activeSection);
  };

  const handleRemoveFile = (fileId: number) => {
    onRemoveFile(fileId, true, 0, activeSection);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tagName = input.value.trim();
      if (tagName && !newTaskTags.includes(tagName.toLowerCase())) {
        onAddTag(tagName);
        input.value = '';
      }
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: `1px solid ${colors.border}`
    }}>
      {/* Основная форма */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 48px 48px',
        gap: '12px',
        alignItems: 'start'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => onNewTaskChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавить задачу..."
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.accent.primary;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
          }}
        />
        
        <button
          onClick={() => onShowNewTaskExpandedChange(!showNewTaskExpanded)}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.accent.primary + '10';
            e.currentTarget.style.borderColor = colors.accent.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = colors.border;
          }}
          title="Расширенные настройки"
        >
          <Plus size={20} color={colors.accent.primary} />
        </button>
        
        <button
          onClick={onAddTask}
          disabled={!newTask.trim()}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: newTask.trim() ? colors.accent.primary : colors.border,
            color: 'white',
            cursor: newTask.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            opacity: newTask.trim() ? 1 : 0.5
          }}
          onMouseEnter={(e) => {
            if (newTask.trim()) {
              e.currentTarget.style.backgroundColor = colors.accent.primary + 'DD';
            }
          }}
          onMouseLeave={(e) => {
            if (newTask.trim()) {
              e.currentTarget.style.backgroundColor = colors.accent.primary;
            }
          }}
          title="Добавить задачу"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Расширенная форма */}
      {showNewTaskExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
          {/* Заметки */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: colors.text.primary
            }}>
              Заметки:
            </label>
            <VisualEditor
              value={newTaskNotes}
              onChange={onNewTaskNotesChange}
              onBlur={() => {}}
            />
          </div>

          {/* Проект */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: colors.text.primary
            }}>
              Проект:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => onSelectedProjectChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">Без проекта</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Теги */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: colors.text.primary
            }}>
              Теги:
            </label>
            <input
              type="text"
              placeholder="Введите тег и нажмите Enter..."
              onKeyPress={handleTagInput}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                fontSize: '14px',
                outline: 'none'
              }}
            />
            {newTaskTags.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {newTaskTags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: colors.accent.primary + '20',
                      color: colors.accent.primary,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => onRemoveNewTaskTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.accent.primary,
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Файлы */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: colors.text.primary
            }}>
              Файлы:
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: 'white',
                color: colors.text.primary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent.primary + '10';
                e.currentTarget.style.borderColor = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <Paperclip size={16} />
              Прикрепить файлы
            </button>
            {newTaskFiles.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {newTaskFiles.map(file => (
                  <div
                    key={file.id}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: colors.background,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: colors.text.secondary }}>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.text.secondary,
                        cursor: 'pointer',
                        padding: '2px',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskForm);
