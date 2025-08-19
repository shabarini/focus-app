import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Section = 'today' | 'todo' | 'done';

interface Task {
  id: number;
  text: string;
  notes?: string;
  project?: string;
  projectColor?: string;
  tags?: string[];
  files?: Array<{
    id: number;
    name: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  order: number;
}

interface TaskState {
  tasks: Record<Section, Task[]>;
  activeSection: Section;
  searchQuery: string;
  selectedProjectFilter: string;
  selectedTagFilter: string;
  expandedNotes: Record<number, boolean>;
  showSearch: boolean;
  showFilters: boolean;
  completedToday: number;
  completedThisMonth: number;
}

interface TaskStateContextType {
  state: TaskState;
  actions: {
    setActiveSection: (section: Section) => void;
    setSearchQuery: (query: string) => void;
    setSelectedProjectFilter: (project: string) => void;
    setSelectedTagFilter: (tag: string) => void;
    setExpandedNotes: (notes: Record<number, boolean>) => void;
    setShowSearch: (show: boolean) => void;
    setShowFilters: (show: boolean) => void;
    setCompletedToday: (count: number) => void;
    setCompletedThisMonth: (count: number) => void;
    toggleNotes: (taskId: number) => void;
    updateTaskNotes: (taskId: number, section: Section, notes: string) => void;
    updateTaskText: (taskId: number, section: Section, text: string) => void;
    updateTaskProject: (taskId: number, section: Section, projectName: string) => void;
    addTagToTask: (taskId: number, section: Section, tag: string) => void;
    removeTagFromTask: (taskId: number, section: Section, tag: string) => void;
    moveTaskUp: (taskId: number, section: Section) => void;
    moveTaskDown: (taskId: number, section: Section) => void;
    reorderTasks: (section: Section, newTasks: Task[]) => void;
    deleteTask: (taskId: number, section: Section) => void;
    moveTask: (taskId: number, fromSection: Section, toSection: Section) => void;
    handleFileUpload: (files: FileList | null, isNewTask: boolean, taskId: number | null, section: Section | null) => void;
    removeFile: (fileId: number, isNewTask: boolean, taskId: number | null, section: Section | null) => void;
    addTask: (task: Task, section: Section) => void;
  };
}

const TaskStateContext = createContext<TaskStateContextType | undefined>(undefined);

interface TaskStateProviderProps {
  children: ReactNode;
  initialTasks: Record<Section, Task[]>;
  onStateChange: (newTasks: Record<Section, Task[]>) => void;
  accessibilityActions: any;
}

export const TaskStateProvider: React.FC<TaskStateProviderProps> = ({
  children,
  initialTasks,
  onStateChange,
  accessibilityActions
}) => {
  const [state, setState] = useState<TaskState>({
    tasks: initialTasks,
    activeSection: 'today',
    searchQuery: '',
    selectedProjectFilter: '',
    selectedTagFilter: '',
    expandedNotes: {},
    showSearch: false,
    showFilters: false,
    completedToday: 0,
    completedThisMonth: 0
  });

  const updateTasks = useCallback((newTasks: Record<Section, Task[]>) => {
    setState(prev => ({ ...prev, tasks: newTasks }));
    onStateChange(newTasks);
  }, [onStateChange]);

  const actions = {
    setActiveSection: useCallback((section: Section) => {
      setState(prev => ({ ...prev, activeSection: section }));
    }, []),

    setSearchQuery: useCallback((query: string) => {
      setState(prev => ({ ...prev, searchQuery: query }));
    }, []),

    setSelectedProjectFilter: useCallback((project: string) => {
      setState(prev => ({ ...prev, selectedProjectFilter: project }));
    }, []),

    setSelectedTagFilter: useCallback((tag: string) => {
      setState(prev => ({ ...prev, selectedTagFilter: tag }));
    }, []),

    setExpandedNotes: useCallback((notes: Record<number, boolean>) => {
      setState(prev => ({ ...prev, expandedNotes: notes }));
    }, []),

    setShowSearch: useCallback((show: boolean) => {
      setState(prev => ({ ...prev, showSearch: show }));
    }, []),

    setShowFilters: useCallback((show: boolean) => {
      setState(prev => ({ ...prev, showFilters: show }));
    }, []),

    setCompletedToday: useCallback((count: number) => {
      setState(prev => ({ ...prev, completedToday: count }));
    }, []),

    setCompletedThisMonth: useCallback((count: number) => {
      setState(prev => ({ ...prev, completedThisMonth: count }));
    }, []),

    toggleNotes: useCallback((taskId: number) => {
      setState(prev => ({
        ...prev,
        expandedNotes: {
          ...prev.expandedNotes,
          [taskId]: !prev.expandedNotes[taskId]
        }
      }));
    }, []),

    updateTaskNotes: useCallback((taskId: number, section: Section, notes: string) => {
      const newTasks = {
        ...state.tasks,
        [section]: state.tasks[section].map(t => 
          t.id === taskId ? { ...t, notes } : t
        )
      };
      updateTasks(newTasks);
    }, [state.tasks, updateTasks]),

    updateTaskText: useCallback((taskId: number, section: Section, text: string) => {
      const newTasks = {
        ...state.tasks,
        [section]: state.tasks[section].map(t => 
          t.id === taskId ? { ...t, text } : t
        )
      };
      updateTasks(newTasks);
    }, [state.tasks, updateTasks]),

    updateTaskProject: useCallback((taskId: number, section: Section, projectName: string) => {
      const newTasks = {
        ...state.tasks,
        [section]: state.tasks[section].map(t => 
          t.id === taskId ? { ...t, project: projectName } : t
        )
      };
      updateTasks(newTasks);
    }, [state.tasks, updateTasks]),

    addTagToTask: useCallback((taskId: number, section: Section, tag: string) => {
      const clean = (tag || '').trim().toLowerCase();
      if (!clean) return;
      
      const newTasks = {
        ...state.tasks,
        [section]: state.tasks[section].map(t =>
          t.id === taskId ? { 
            ...t, 
            tags: Array.from(new Set([...(t.tags || []), clean])) 
          } : t
        )
      };
      updateTasks(newTasks);
    }, [state.tasks, updateTasks]),

    removeTagFromTask: useCallback((taskId: number, section: Section, tag: string) => {
      const newTasks = {
        ...state.tasks,
        [section]: state.tasks[section].map(t =>
          t.id === taskId ? { 
            ...t, 
            tags: (t.tags || []).filter((x: string) => x !== tag) 
          } : t
        )
      };
      updateTasks(newTasks);
    }, [state.tasks, updateTasks]),

    moveTaskUp: useCallback((taskId: number, section: Section) => {
      const sectionTasks = [...state.tasks[section]];
      const taskIndex = sectionTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex > 0) {
        const temp = sectionTasks[taskIndex];
        sectionTasks[taskIndex] = { ...sectionTasks[taskIndex - 1], order: taskIndex };
        sectionTasks[taskIndex - 1] = { ...temp, order: taskIndex - 1 };
        
        const newTasks = {
          ...state.tasks,
          [section]: sectionTasks
        };
        updateTasks(newTasks);
      }
    }, [state.tasks, updateTasks]),

    moveTaskDown: useCallback((taskId: number, section: Section) => {
      const sectionTasks = [...state.tasks[section]];
      const taskIndex = sectionTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex < sectionTasks.length - 1) {
        const temp = sectionTasks[taskIndex];
        sectionTasks[taskIndex] = { ...sectionTasks[taskIndex + 1], order: taskIndex };
        sectionTasks[taskIndex + 1] = { ...temp, order: taskIndex + 1 };
        
        const newTasks = {
          ...state.tasks,
          [section]: sectionTasks
        };
        updateTasks(newTasks);
      }
    }, [state.tasks, updateTasks]),

    reorderTasks: useCallback((section: Section, newTasks: Task[]) => {
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        order: index
      }));
      
      const newTasksState = {
        ...state.tasks,
        [section]: updatedTasks
      };
      updateTasks(newTasksState);
    }, [state.tasks, updateTasks]),

    deleteTask: useCallback((taskId: number, section: Section) => {
      const task = state.tasks[section].find(t => t.id === taskId);
      const newTasks = {
        ...state.tasks,
        [section]: state.tasks[section].filter(t => t.id !== taskId)
      };
      updateTasks(newTasks);
      
      if (task) {
        accessibilityActions.announce(`Задача "${task.text}" удалена`);
      }
    }, [state.tasks, updateTasks, accessibilityActions]),

    moveTask: useCallback((
      taskId: number,
      fromSection: Section,
      toSection: Section
    ) => {
      const task = state.tasks[fromSection].find(t => t.id === taskId);
      if (!task) return;

      if (toSection === 'done') {
        setState(prev => ({
          ...prev,
          completedToday: prev.completedToday + 1,
          completedThisMonth: prev.completedThisMonth + 1
        }));
      }

      const newTasks = {
        ...state.tasks,
        [fromSection]: state.tasks[fromSection].filter(t => t.id !== taskId),
        [toSection]: [...state.tasks[toSection], { ...task, order: state.tasks[toSection].length }]
      };
      updateTasks(newTasks);
      
      const sectionNames = {
        today: 'Сегодня',
        todo: 'В планах',
        done: 'Сделано'
      };
      accessibilityActions.announce(`Задача "${task.text}" перемещена из "${sectionNames[fromSection]}" в "${sectionNames[toSection]}"`);
    }, [state.tasks, updateTasks, accessibilityActions]),

    handleFileUpload: useCallback((
      files: FileList | null,
      isNewTask: boolean = true,
      taskId: number | null = null,
      section: Section | null = null
    ) => {
      if (!files || files.length === 0) return;
      
      const fileArray = Array.from(files).map((file: File) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size
      }));

      if (isNewTask) {
        // Логика для новых задач будет в TaskManager
        return;
      } else if (taskId && section) {
        const newTasks = {
          ...state.tasks,
          [section]: state.tasks[section].map(t => 
            t.id === taskId ? { 
              ...t, 
              files: [...(t.files || []), ...fileArray] 
            } : t
          )
        };
        updateTasks(newTasks);
      }
    }, [state.tasks, updateTasks]),

              removeFile: useCallback((
            fileId: number,
            isNewTask: boolean = true,
            taskId: number | null = null,
            section: Section | null = null
          ) => {
            if (isNewTask) {
              // Логика для новых задач будет в TaskManager
              return;
            } else if (taskId && section) {
              const newTasks = {
                ...state.tasks,
                [section]: state.tasks[section].map(t => 
                  t.id === taskId ? { 
                    ...t, 
                    files: (t.files || []).filter(f => f.id !== fileId) 
                  } : t
                )
              };
              updateTasks(newTasks);
            }
          }, [state.tasks, updateTasks]),

          addTask: useCallback((task: Task, section: Section) => {
            const newTasks = {
              ...state.tasks,
              [section]: [...state.tasks[section], task]
            };
            updateTasks(newTasks);
          }, [state.tasks, updateTasks])
  };

  return (
    <TaskStateContext.Provider value={{ state, actions }}>
      {children}
    </TaskStateContext.Provider>
  );
};

export const useTaskState = (): TaskStateContextType => {
  const context = useContext(TaskStateContext);
  if (context === undefined) {
    throw new Error('useTaskState must be used within a TaskStateProvider');
  }
  return context;
};
