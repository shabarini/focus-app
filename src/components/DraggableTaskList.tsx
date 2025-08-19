import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  text: string;
  notes?: string;
  project?: string;
  tags?: string[];
  files?: Array<{
    id: number;
    name: string;
    type: string;
    size: number;
  }>;
  order: number;
}

interface DraggableTaskListProps {
  tasks: Task[];
  section: 'today' | 'todo' | 'done';
  onTasksReorder: (section: 'today' | 'todo' | 'done', tasks: Task[]) => void;
  onTaskMove: (taskId: number, fromSection: 'today' | 'todo' | 'done', toSection: 'today' | 'todo' | 'done') => void;
  onToggleNotes: (taskId: number) => void;
  onMoveUp: (taskId: number, section: 'today' | 'todo' | 'done') => void;
  onMoveDown: (taskId: number, section: 'today' | 'todo' | 'done') => void;
  onUpdateText: (taskId: number, section: 'today' | 'todo' | 'done', text: string) => void;
  onUpdateNotes: (taskId: number, section: 'today' | 'todo' | 'done', notes: string) => void;
  onUpdateProject: (taskId: number, section: 'today' | 'todo' | 'done', project: string) => void;
  onAddTagToTask: (taskId: number, section: 'today' | 'todo' | 'done', tag: string) => void;
  onRemoveTagFromTask: (taskId: number, section: 'today' | 'todo' | 'done', tag: string) => void;
  onHandleFileUpload: (files: FileList | null, isNewTask: boolean, taskId: number | null, section: 'today' | 'todo' | 'done' | null) => void;
  onRemoveFile: (fileId: number, isNewTask: boolean, taskId: number | null, section: 'today' | 'todo' | 'done' | null) => void;
  onMoveTask: (taskId: number, fromSection: 'today' | 'todo' | 'done', toSection: 'today' | 'todo' | 'done') => void;
  onDeleteTask: (taskId: number, section: 'today' | 'todo' | 'done') => void;
  getAllTags: () => string[];
  projectNames: string[];
  colors: any;
  expandedNotes: Record<number, boolean>;
}

interface SortableTaskItemProps {
  task: Task;
  section: 'today' | 'todo' | 'done';
  onToggleNotes: (taskId: number) => void;
  onMoveUp: (taskId: number, section: 'today' | 'todo' | 'done') => void;
  onMoveDown: (taskId: number, section: 'today' | 'todo' | 'done') => void;
  onUpdateText: (taskId: number, section: 'today' | 'todo' | 'done', text: string) => void;
  onUpdateNotes: (taskId: number, section: 'today' | 'todo' | 'done', notes: string) => void;
  onUpdateProject: (taskId: number, section: 'today' | 'todo' | 'done', project: string) => void;
  onAddTagToTask: (taskId: number, section: 'today' | 'todo' | 'done', tag: string) => void;
  onRemoveTagFromTask: (taskId: number, section: 'today' | 'todo' | 'done', tag: string) => void;
  onHandleFileUpload: (files: FileList | null, isNewTask: boolean, taskId: number | null, section: 'today' | 'todo' | 'done' | null) => void;
  onRemoveFile: (fileId: number, isNewTask: boolean, taskId: number | null, section: 'today' | 'todo' | 'done' | null) => void;
  onMoveTask: (taskId: number, fromSection: 'today' | 'todo' | 'done', toSection: 'today' | 'todo' | 'done') => void;
  onDeleteTask: (taskId: number, section: 'today' | 'todo' | 'done') => void;
  getAllTags: () => string[];
  projectNames: string[];
  colors: any;
  expandedNotes: Record<number, boolean>;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({ task, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem
        task={task}
        section={props.section}
        colors={props.colors}
        isExpanded={props.expandedNotes[task.id] || false}
        projectNames={props.projectNames}
        onToggleNotes={props.onToggleNotes}
        onMoveUp={props.onMoveUp}
        onMoveDown={props.onMoveDown}
        onUpdateText={props.onUpdateText}
        onUpdateNotes={props.onUpdateNotes}
        onUpdateProject={props.onUpdateProject}
        onAddTagToTask={props.onAddTagToTask}
        onRemoveTagFromTask={props.onRemoveTagFromTask}
        onHandleFileUpload={props.onHandleFileUpload}
        onRemoveFile={props.onRemoveFile}
        onMoveTask={props.onMoveTask}
        onDeleteTask={props.onDeleteTask}
        getAllTags={props.getAllTags}
      />
    </div>
  );
};

const DraggableTaskList: React.FC<DraggableTaskListProps> = ({
  tasks,
  section,
  onTasksReorder,
  onTaskMove,
  ...taskItemProps
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId !== overId) {
      // Здесь можно добавить логику для визуальной обратной связи
      console.log('Drag over:', activeId, '->', overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId !== overId) {
      const oldIndex = tasks.findIndex(task => task.id === activeId);
      const newIndex = tasks.findIndex(task => task.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        onTasksReorder(section, newTasks);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              section={section}
              {...taskItemProps}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableTaskList;
