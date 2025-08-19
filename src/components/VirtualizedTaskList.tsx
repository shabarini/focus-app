import React from 'react';
import TaskItem from './TaskItem';

type Section = 'today' | 'todo' | 'done';

export interface VirtualizedTaskListProps {
  tasks: any[];
  section: Section;
  colors: any;
  expandedNotes: Record<number, boolean>;
  projectNames: string[];
  onToggleNotes: (taskId: number) => void;
  onMoveUp: (taskId: number, section: Section) => void;
  onMoveDown: (taskId: number, section: Section) => void;
  onUpdateText: (taskId: number, section: Section, text: string) => void;
  onUpdateNotes: (taskId: number, section: Section, notes: string) => void;
  onUpdateProject: (taskId: number, section: Section, projectName: string) => void;
  onAddTagToTask: (taskId: number, section: Section, tag: string) => void;
  onRemoveTagFromTask: (taskId: number, section: Section, tag: string) => void;
  onHandleFileUpload: (files: FileList | null, isNewTask: boolean, taskId: number, section: Section) => void;
  onRemoveFile: (fileId: number, isNewTask: boolean, taskId: number, section: Section) => void;
  onMoveTask: (taskId: number, fromSection: Section, toSection: Section) => void;
  onDeleteTask: (taskId: number, section: Section) => void;
  getAllTags: () => string[];
  height?: number;
  itemHeight?: number;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  section,
  colors,
  expandedNotes,
  projectNames,
  onToggleNotes,
  onMoveUp,
  onMoveDown,
  onUpdateText,
  onUpdateNotes,
  onUpdateProject,
  onAddTagToTask,
  onRemoveTagFromTask,
  onHandleFileUpload,
  onRemoveFile,
  onMoveTask,
  onDeleteTask,
  getAllTags,
  height = 600,
  itemHeight = 160
}) => {
  // Используем простой рендер для всех задач без виртуализации
  return (
    <div className="task-list-container" style={{ 
      height: 'auto',
      maxHeight: height,
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          section={section}
          colors={colors}
          isExpanded={!!expandedNotes[task.id]}
          projectNames={projectNames}
          onToggleNotes={onToggleNotes}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onUpdateText={onUpdateText}
          onUpdateNotes={onUpdateNotes}
          onUpdateProject={onUpdateProject}
          onAddTagToTask={onAddTagToTask}
          onRemoveTagFromTask={onRemoveTagFromTask}
          onHandleFileUpload={onHandleFileUpload}
          onRemoveFile={onRemoveFile}
          onMoveTask={onMoveTask}
          onDeleteTask={onDeleteTask}
          getAllTags={getAllTags}
        />
      ))}
    </div>
  );
};

export default React.memo(VirtualizedTaskList);
