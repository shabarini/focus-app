import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface ArchiveItem {
  month: string;
  tasks: any[];
}

interface SettingsState {
  projects: Project[];
  availableTags: string[];
  archive: ArchiveItem[];
  showSettings: boolean;
  selectedProject: string;
  newProjectName: string;
  selectedProjectColor: string;
  newTagName: string;
  isDragDropEnabled: boolean;
}

interface SettingsManagerContextType {
  state: SettingsState;
  actions: {
    setShowSettings: (show: boolean) => void;
    setSelectedProject: (project: string) => void;
    setNewProjectName: (name: string) => void;
    setSelectedProjectColor: (color: string) => void;
    setNewTagName: (name: string) => void;
    setIsDragDropEnabled: (enabled: boolean) => void;
    addProject: () => void;
    removeProject: (projectId: string) => void;
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    archiveTasks: () => void;
    clearArchive: () => void;
    exportSettings: () => string;
    importSettings: (data: string) => boolean;
    resetToDefaults: () => void;
  };
}

const SettingsManagerContext = createContext<SettingsManagerContextType | undefined>(undefined);

interface SettingsManagerProviderProps {
  children: ReactNode;
  initialProjects: Project[];
  initialTags: string[];
  initialArchive: ArchiveItem[];
  onProjectsChange: (projects: Project[]) => void;
  onTagsChange: (tags: string[]) => void;
  onArchiveChange: (archive: ArchiveItem[]) => void;
}

export const SettingsManagerProvider: React.FC<SettingsManagerProviderProps> = ({
  children,
  initialProjects,
  initialTags,
  initialArchive,
  onProjectsChange,
  onTagsChange,
  onArchiveChange
}) => {
  const [state, setState] = useState<SettingsState>({
    projects: initialProjects,
    availableTags: initialTags,
    archive: initialArchive,
    showSettings: false,
    selectedProject: '',
    newProjectName: '',
    selectedProjectColor: '#A8D5BA',
    newTagName: '',
    isDragDropEnabled: false
  });

  const actions = {
    setShowSettings: useCallback((show: boolean) => {
      setState(prev => ({ ...prev, showSettings: show }));
    }, []),

    setSelectedProject: useCallback((project: string) => {
      setState(prev => ({ ...prev, selectedProject: project }));
    }, []),

    setNewProjectName: useCallback((name: string) => {
      setState(prev => ({ ...prev, newProjectName: name }));
    }, []),

    setSelectedProjectColor: useCallback((color: string) => {
      setState(prev => ({ ...prev, selectedProjectColor: color }));
    }, []),

    setNewTagName: useCallback((name: string) => {
      setState(prev => ({ ...prev, newTagName: name }));
    }, []),

    setIsDragDropEnabled: useCallback((enabled: boolean) => {
      setState(prev => ({ ...prev, isDragDropEnabled: enabled }));
    }, []),

    addProject: useCallback(() => {
      const clean = state.newProjectName.trim();
      if (!clean) return;
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: clean,
        color: state.selectedProjectColor
      };
      
      const updatedProjects = [...state.projects, newProject];
      setState(prev => ({ 
        ...prev, 
        projects: updatedProjects,
        newProjectName: '',
        selectedProjectColor: '#A8D5BA'
      }));
      
      onProjectsChange(updatedProjects);
    }, [state.newProjectName, state.selectedProjectColor, state.projects, onProjectsChange]),

    removeProject: useCallback((projectId: string) => {
      const updatedProjects = state.projects.filter(p => p.id !== projectId);
      setState(prev => ({ ...prev, projects: updatedProjects }));
      onProjectsChange(updatedProjects);
    }, [state.projects, onProjectsChange]),

    addTag: useCallback((tag: string) => {
      const clean = tag.trim().toLowerCase();
      if (!clean || state.availableTags.includes(clean)) return;
      
      const updatedTags = [...state.availableTags, clean];
      setState(prev => ({ ...prev, availableTags: updatedTags }));
      onTagsChange(updatedTags);
    }, [state.availableTags, onTagsChange]),

    removeTag: useCallback((tag: string) => {
      const updatedTags = state.availableTags.filter(t => t !== tag);
      setState(prev => ({ ...prev, availableTags: updatedTags }));
      onTagsChange(updatedTags);
    }, [state.availableTags, onTagsChange]),

    archiveTasks: useCallback(() => {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const existingArchive = state.archive.find(item => item.month === currentMonth);
      
      if (existingArchive) {
        // Если архив за текущий месяц уже существует, обновляем его
        const updatedArchive = state.archive.map(item =>
          item.month === currentMonth
            ? { ...item, tasks: [...item.tasks] } // Обновляем задачи
            : item
        );
        setState(prev => ({ ...prev, archive: updatedArchive }));
        onArchiveChange(updatedArchive);
      } else {
        // Создаем новый архив за текущий месяц
        const newArchiveItem: ArchiveItem = {
          month: currentMonth,
          tasks: [] // Здесь будут задачи из done секции
        };
        const updatedArchive = [...state.archive, newArchiveItem];
        setState(prev => ({ ...prev, archive: updatedArchive }));
        onArchiveChange(updatedArchive);
      }
    }, [state.archive, onArchiveChange]),

    clearArchive: useCallback(() => {
      setState(prev => ({ ...prev, archive: [] }));
      onArchiveChange([]);
    }, [onArchiveChange]),

    exportSettings: useCallback((): string => {
      try {
        const settingsData = {
          projects: state.projects,
          availableTags: state.availableTags,
          archive: state.archive,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        return JSON.stringify(settingsData, null, 2);
      } catch (error) {
        console.error('Ошибка при экспорте настроек:', error);
        return '';
      }
    }, [state.projects, state.availableTags, state.archive]),

    importSettings: useCallback((data: string): boolean => {
      try {
        const parsedData = JSON.parse(data);
        
        // Валидация структуры данных
        if (!parsedData.projects || !parsedData.availableTags) {
          throw new Error('Неверная структура настроек');
        }

        // Обновляем состояние
        setState(prev => ({
          ...prev,
          projects: parsedData.projects,
          availableTags: parsedData.availableTags,
          archive: parsedData.archive || []
        }));

        // Уведомляем родительские компоненты
        onProjectsChange(parsedData.projects);
        onTagsChange(parsedData.availableTags);
        if (parsedData.archive) {
          onArchiveChange(parsedData.archive);
        }

        console.log('Настройки успешно импортированы');
        return true;
      } catch (error) {
        console.error('Ошибка при импорте настроек:', error);
        return false;
      }
    }, [onProjectsChange, onTagsChange, onArchiveChange]),

    resetToDefaults: useCallback(() => {
      const defaultProjects = [
        { id: '1', name: 'Личное', color: '#A8D5BA' },
        { id: '2', name: 'Работа', color: '#B8D4E8' },
        { id: '3', name: 'Домашние дела', color: '#C3E8D1' }
      ];
      
      const defaultTags = ['важное', 'срочно', 'идея', 'встреча', 'звонок', 'покупки'];
      
      setState(prev => ({
        ...prev,
        projects: defaultProjects,
        availableTags: defaultTags,
        archive: [],
        selectedProject: '',
        newProjectName: '',
        selectedProjectColor: '#A8D5BA',
        newTagName: '',
        isDragDropEnabled: false
      }));

      onProjectsChange(defaultProjects);
      onTagsChange(defaultTags);
      onArchiveChange([]);
    }, [onProjectsChange, onTagsChange, onArchiveChange])
  };

  return (
    <SettingsManagerContext.Provider value={{ state, actions }}>
      {children}
    </SettingsManagerContext.Provider>
  );
};

export const useSettingsManager = (): SettingsManagerContextType => {
  const context = useContext(SettingsManagerContext);
  if (context === undefined) {
    throw new Error('useSettingsManager must be used within a SettingsManagerProvider');
  }
  return context;
};

