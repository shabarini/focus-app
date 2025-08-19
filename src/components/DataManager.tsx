import React, { createContext, useContext, useCallback, ReactNode, useEffect, useState } from 'react';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

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

interface Project {
  id: string;
  name: string;
  color: string;
}

interface ArchiveItem {
  month: string;
  tasks: Task[];
}

interface DataManagerContextType {
  saveToLocalStorage: (data: any, key: string) => void;
  loadFromLocalStorage: (key: string, defaultValue: any) => any;
  saveToFirebase: (data: any, key: string) => Promise<void>;
  loadFromFirebase: (key: string, defaultValue: any) => Promise<any>;
  saveTasks: (tasks: Record<Section, Task[]>) => void;
  loadTasks: () => Record<Section, Task[]>;
  saveProjects: (projects: Project[]) => void;
  loadProjects: () => Project[];
  saveTags: (tags: string[]) => void;
  loadTags: () => string[];
  saveArchive: (archive: ArchiveItem[]) => void;
  loadArchive: () => ArchiveItem[];
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  validateTask: (task: any) => boolean;
  validateProject: (project: any) => boolean;
  sanitizeData: (data: any) => any;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: Date | null;
}

const DataManagerContext = createContext<DataManagerContextType | undefined>(undefined);

interface DataManagerProviderProps {
  children: ReactNode;
  user?: any;
}

export const DataManagerProvider: React.FC<DataManagerProviderProps> = ({ children, user }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Firebase функции
  const saveToFirebase = useCallback(async (data: any, key: string) => {
    if (!user) return;
    
    try {
      setSyncStatus('syncing');
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        [key]: data,
        updatedAt: new Date(),
        lastModified: new Date()
      }, { merge: true });
      
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Ошибка сохранения в Firebase:', error);
      setSyncStatus('error');
    }
  }, [user]);

  const loadFromFirebase = useCallback(async (key: string, defaultValue: any) => {
    if (!user) return defaultValue;
    
    try {
      setSyncStatus('syncing');
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        return data[key] || defaultValue;
      }
      setSyncStatus('synced');
      return defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из Firebase:', error);
      setSyncStatus('error');
      return defaultValue;
    }
  }, [user]);

  // Подписка на изменения в реальном времени
  useEffect(() => {
    if (!user) return;

    const userDoc = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Обновляем localStorage при изменениях в Firebase
        Object.keys(data).forEach(key => {
          if (key !== 'updatedAt' && key !== 'lastModified') {
            localStorage.setItem(`firebase-${key}`, JSON.stringify(data[key]));
          }
        });
        setLastSyncTime(new Date());
      }
    }, (error) => {
      console.error('Ошибка подписки на Firebase:', error);
      setSyncStatus('error');
    });

    return () => unsubscribe();
  }, [user]);

  const saveToLocalStorage = useCallback((data: any, key: string) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      // Также сохраняем в Firebase
      if (user) {
        saveToFirebase(data, key);
      }
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  }, [user, saveToFirebase]);

  const loadFromLocalStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return defaultValue;
    }
  }, []);

  const saveTasks = useCallback((tasks: Record<Section, Task[]>) => {
    saveToLocalStorage(tasks, 'focus-tasks');
  }, [saveToLocalStorage]);

  const loadTasks = useCallback((): Record<Section, Task[]> => {
    const savedTasks = loadFromLocalStorage('focus-tasks', {
      today: [],
      todo: [],
      done: []
    });
    
    // Добавляем порядок к существующим задачам
    Object.keys(savedTasks).forEach(section => {
      savedTasks[section] = savedTasks[section].map((task: Task, index: number) => ({
        ...task,
        order: task.order !== undefined ? task.order : index
      }));
    });
    
    return savedTasks;
  }, [loadFromLocalStorage]);

  const saveProjects = useCallback((projects: Project[]) => {
    saveToLocalStorage(projects, 'focus-projects');
  }, [saveToLocalStorage]);

  const loadProjects = useCallback((): Project[] => {
    return loadFromLocalStorage('focus-projects', [
      { id: '1', name: 'Личное', color: '#A8D5BA' },
      { id: '2', name: 'Работа', color: '#B8D4E8' },
      { id: '3', name: 'Домашние дела', color: '#C3E8D1' }
    ]);
  }, [loadFromLocalStorage]);

  const saveTags = useCallback((tags: string[]) => {
    saveToLocalStorage(tags, 'focus-tags');
  }, [saveToLocalStorage]);

  const loadTags = useCallback((): string[] => {
    return loadFromLocalStorage('focus-tags', [
      'важное', 'срочно', 'идея', 'встреча', 'звонок', 'покупки'
    ]);
  }, [loadFromLocalStorage]);

  const saveArchive = useCallback((archive: ArchiveItem[]) => {
    saveToLocalStorage(archive, 'focus-archive');
  }, [saveToLocalStorage]);

  const loadArchive = useCallback((): ArchiveItem[] => {
    return loadFromLocalStorage('focus-archive', []);
  }, [loadFromLocalStorage]);

  const clearAllData = useCallback(() => {
    try {
      localStorage.removeItem('focus-tasks');
      localStorage.removeItem('focus-projects');
      localStorage.removeItem('focus-tags');
      localStorage.removeItem('focus-archive');
      console.log('Все данные очищены');
    } catch (error) {
      console.error('Ошибка при очистке данных:', error);
    }
  }, []);

  const exportData = useCallback((): string => {
    try {
      const data = {
        tasks: loadTasks(),
        projects: loadProjects(),
        tags: loadTags(),
        archive: loadArchive(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Ошибка при экспорте данных:', error);
      return '';
    }
  }, [loadTasks, loadProjects, loadTags, loadArchive]);

  const importData = useCallback((data: string): boolean => {
    try {
      const parsedData = JSON.parse(data);
      
      // Валидация структуры данных
      if (!parsedData.tasks || !parsedData.projects || !parsedData.tags) {
        throw new Error('Неверная структура данных');
      }

      // Сохранение импортированных данных
      saveTasks(parsedData.tasks);
      saveProjects(parsedData.projects);
      saveTags(parsedData.tags);
      
      if (parsedData.archive) {
        saveArchive(parsedData.archive);
      }

      console.log('Данные успешно импортированы');
      return true;
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
      return false;
    }
  }, [saveTasks, saveProjects, saveTags, saveArchive]);

  const validateTask = useCallback((task: any): boolean => {
    if (!task || typeof task !== 'object') return false;
    if (!task.text || typeof task.text !== 'string') return false;
    if (task.text.trim().length === 0) return false;
    if (task.text.length > 500) return false;
    if (task.notes && typeof task.notes !== 'string') return false;
    if (task.notes && task.notes.length > 5000) return false;
    if (task.project && typeof task.project !== 'string') return false;
    if (task.project && task.project.length > 100) return false;
    if (task.tags && !Array.isArray(task.tags)) return false;
    if (task.tags && task.tags.length > 10) return false;
    if (task.tags && task.tags.some((tag: any) => typeof tag !== 'string' || tag.length > 50)) return false;
    if (task.files && !Array.isArray(task.files)) return false;
    if (task.files && task.files.length > 10) return false;
    if (task.files && task.files.some((file: any) => !file.name || typeof file.name !== 'string' || file.name.length > 255)) return false;
    
    return true;
  }, []);

  const validateProject = useCallback((project: any): boolean => {
    if (!project || typeof project !== 'object') return false;
    if (!project.name || typeof project.name !== 'string') return false;
    if (project.name.trim().length === 0) return false;
    if (project.name.length > 100) return false;
    if (!project.color || typeof project.color !== 'string') return false;
    if (!/^#[0-9A-F]{6}$/i.test(project.color)) return false;
    
    return true;
  }, []);

  const sanitizeData = useCallback((data: any): any => {
    if (typeof data === 'string') {
      return data.trim().substring(0, 5000);
    }
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item)).filter(Boolean);
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof key === 'string' && key.length <= 100) {
          sanitized[key] = sanitizeData(value);
        }
      }
      return sanitized;
    }
    return data;
  }, []);

  const contextValue: DataManagerContextType = {
    saveToLocalStorage,
    loadFromLocalStorage,
    saveToFirebase,
    loadFromFirebase,
    saveTasks,
    loadTasks,
    saveProjects,
    loadProjects,
    saveTags,
    loadTags,
    saveArchive,
    loadArchive,
    clearAllData,
    exportData,
    importData,
    validateTask,
    validateProject,
    sanitizeData,
    syncStatus,
    lastSyncTime
  };

  return (
    <DataManagerContext.Provider value={contextValue}>
      {children}
    </DataManagerContext.Provider>
  );
};

export const useDataManager = (): DataManagerContextType => {
  const context = useContext(DataManagerContext);
  if (!context) {
    throw new Error('useDataManager must be used within a DataManagerProvider');
  }
  return context;
};

