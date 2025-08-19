import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { Plus, Check, X, Settings, Search, Filter, Trash2, Award, ArrowLeft, Paperclip, Upload, Clock, CheckCircle2, Menu } from 'lucide-react';
import VisualEditor from './VisualEditor';
import Logo from './Logo';
import QuoteCarousel from './QuoteCarousel';
import TaskItem from './components/TaskItem';
import VirtualizedTaskList from './components/VirtualizedTaskList';
import PerformanceMonitor from './components/PerformanceMonitor';
import { addTestData, clearTestData } from './utils/testDataGenerator';
import { LoadingSpinner, EmptyState, ErrorState, AnimatedContainer, SkipLink, FocusTrap, LiveRegion, MobileNavigation, TouchButton, ResponsiveContainer } from './components/ui';
import PWAStatus from './components/PWAStatus';
import { useAccessibility } from './hooks/useAccessibility';
import { useResponsive } from './hooks/useResponsive';
import { usePWA } from './hooks/usePWA';

type Section = 'today' | 'todo' | 'done';

const FocusMinimal = ({ user }: { user: any }) => {
  // Функции для работы с Firebase
  const saveToFirebase = async (data: any, key: string) => {
    if (!user) return;
    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { [key]: data }, { merge: true });
    } catch (error) {
      console.error('Ошибка сохранения в Firebase:', error);
    }
  };

  const loadFromFirebase = async (key: string, defaultValue: any) => {
    if (!user) return defaultValue;
    try {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return docSnap.data()[key] || defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из Firebase:', error);
      return defaultValue;
    }
  };

  // Функции для работы с localStorage (fallback)
  const saveToLocalStorage = (data: any, key: string) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  };

  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return defaultValue;
    }
  };

  // Состояния
  const [tasks, setTasks] = useState<Record<Section, any[]>>(() => {
    const savedTasks = loadFromLocalStorage('focus-tasks', {
      today: [],
      todo: [],
      done: []
    });
    
    // Добавляем порядок к существующим задачам
    Object.keys(savedTasks).forEach(section => {
      savedTasks[section] = savedTasks[section].map((task, index) => ({
        ...task,
        order: task.order !== undefined ? task.order : index
      }));
    });
    
    return savedTasks;
  });
  
  const [archive, setArchive] = useState<Array<{
    month: string;
    tasks: any[];
  }>>(() => loadFromLocalStorage('focus-archive', []));
  
  const [newTask, setNewTask] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskTags, setNewTaskTags] = useState([]);
  const [newTaskFiles, setNewTaskFiles] = useState([]);
  const [showNewTaskExpanded, setShowNewTaskExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');
  
  const [projects, setProjects] = useState<Array<{ id: string; name: string; color: string }>>(() => 
    loadFromLocalStorage('focus-projects', [
      { id: '1', name: 'Личное', color: '#A8D5BA' },
      { id: '2', name: 'Работа', color: '#B8D4E8' },
      { id: '3', name: 'Домашние дела', color: '#C3E8D1' }
    ])
  );
  
  const [availableTags, setAvailableTags] = useState<string[]>(() => 
    loadFromLocalStorage('focus-tags', ['важное', 'срочно', 'идея', 'встреча', 'звонок', 'покупки'])
  );
  const [selectedProject, setSelectedProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectColor, setSelectedProjectColor] = useState('#A8D5BA');
  const [newTagName, setNewTagName] = useState('');
  const [completedToday, setCompletedToday] = useState(0);
  const [completedThisMonth, setCompletedThisMonth] = useState(0);
  
  // Состояния для анимаций и системных состояний
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Состояния для синхронизации
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Состояния для мобильной навигации
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Хук для доступности
  const [accessibilityState, accessibilityActions] = useAccessibility();
  
  // Хук для адаптивности
  const responsiveState = useResponsive();
  
  // Хук для PWA
  const [pwaState, pwaActions] = usePWA();
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Цвета
  const colors = {
    background: '#FDFBF7',
    text: {
      primary: '#2E2E2E',
      secondary: '#8E8E93',
      placeholder: '#C7C7CC'
    },
    accent: {
      today: '#A8D5BA',
      todo: '#B8D4E8',
      done: '#C3E8D1',
      primary: '#7FB69E'
    },
    border: '#F0F0F0'
  };

  // Инициализация и обработка ошибок
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Симуляция загрузки данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Проверка доступности localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          setIsInitialized(true);
        } else {
          throw new Error('localStorage недоступен');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Инициализация с Firebase синхронизацией
  useEffect(() => {
    const initializeData = async () => {
      if (!user) return;
      
      setSyncStatus('syncing');
      try {
        // Загружаем данные из Firebase
        const firebaseTasks = await loadFromFirebase('tasks', tasks);
        const firebaseProjects = await loadFromFirebase('projects', projects);
        const firebaseTags = await loadFromFirebase('tags', availableTags);
        const firebaseArchive = await loadFromFirebase('archive', archive);
        
        // Обновляем состояние
        setTasks(firebaseTasks);
        setProjects(firebaseProjects);
        setAvailableTags(firebaseTags);
        setArchive(firebaseArchive);
        
        // Сохраняем в localStorage как fallback
        saveToLocalStorage(firebaseTasks, 'focus-tasks');
        saveToLocalStorage(firebaseProjects, 'focus-projects');
        saveToLocalStorage(firebaseTags, 'focus-tags');
        saveToLocalStorage(firebaseArchive, 'focus-archive');
        
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      } catch (error) {
        console.error('Ошибка инициализации Firebase:', error);
        setSyncStatus('error');
      }
    };

    initializeData();
  }, [user]);

  // Подписка на изменения в Firebase
  useEffect(() => {
    if (!user) return;

    const userDoc = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.tasks) setTasks(data.tasks);
        if (data.projects) setProjects(data.projects);
        if (data.tags) setAvailableTags(data.tags);
        if (data.archive) setArchive(data.archive);
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      }
    }, (error) => {
      console.error('Ошибка подписки на Firebase:', error);
      setSyncStatus('error');
    });

    return () => unsubscribe();
  }, [user]);

  // Обработка ошибок
  const handleRetry = useCallback(() => {
    setError(null);
    setIsInitialized(false);
    window.location.reload();
  }, []);

  // Функции для файлов
  const handleFileUpload = useCallback((
    files: FileList | null,
    isNewTask: boolean = true,
    taskId: number | null = null,
    section: 'today' | 'todo' | 'done' | null = null
  ) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files as FileList).map((file: File) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size
    }));
    
    if (isNewTask) {
      setNewTaskFiles(prev => [...prev, ...fileArray]);
    } else if (taskId && section) {
      setTasks(prev => ({
        ...prev,
        [section]: prev[section].map(t => 
          t.id === taskId ? { ...t, files: [...(t.files || []), ...fileArray] } : t
        )
      }));
    }
  }, []);

  const removeFile = useCallback((
    fileId: number,
    isNewTask: boolean = true,
    taskId: number | null = null,
    section: 'today' | 'todo' | 'done' | null = null
  ) => {
    if (isNewTask) {
      setNewTaskFiles(prev => prev.filter(f => f.id !== fileId));
    } else if (taskId && section) {
      setTasks(prev => ({
        ...prev,
        [section]: prev[section].map(t => 
          t.id === taskId ? { ...t, files: (t.files || []).filter(f => f.id !== fileId) } : t
        )
      }));
    }
  }, []);

  // Функции для задач
  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    
    const selectedProjectObj = projects.find(p => p.name === selectedProject);
    
    const task = {
      id: Date.now(),
      text: newTask,
      notes: newTaskNotes,
      project: selectedProjectObj ? selectedProjectObj.name : '',
      projectColor: selectedProjectObj ? selectedProjectObj.color : '',
      tags: [...newTaskTags],
      files: [...newTaskFiles],
      createdAt: new Date().toISOString(),
      order: tasks[activeSection].length // Добавляем порядок
    };

    setTasks(prev => {
      const newTasks = {
        ...prev,
        [activeSection]: [...prev[activeSection], task]
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      // Сохраняем в Firebase
      saveToFirebase(newTasks, 'tasks');
      return newTasks;
    });
    
    setNewTask('');
    setNewTaskNotes('');
    setNewTaskTags([]);
    setNewTaskFiles([]);
    setSelectedProject('');
    setShowNewTaskExpanded(false);
    inputRef.current?.focus();
    
    // Объявление для скрин-ридеров
    accessibilityActions.announce(`Задача "${newTask}" добавлена в раздел ${activeSection === 'today' ? 'Сегодня' : activeSection === 'todo' ? 'В планах' : 'Сделано'}`);
  }, [newTask, newTaskNotes, newTaskTags, newTaskFiles, selectedProject, projects, activeSection, tasks]);

  const moveTask = useCallback((
    taskId: number,
    fromSection: 'today' | 'todo' | 'done',
    toSection: 'today' | 'todo' | 'done'
  ) => {
    const task = tasks[fromSection].find(t => t.id === taskId);
    if (!task) return;

    if (toSection === 'done') {
      setCompletedToday(prev => prev + 1);
      setCompletedThisMonth(prev => prev + 1);
      
      // Отправляем уведомление при выполнении задачи
      if (Notification.permission === 'granted') {
        pwaActions.sendNotification('Задача выполнена! 🎉', {
          body: `"${task.text}" - отличная работа!`,
          tag: 'task-completed',
          requireInteraction: false,
        });
      }
    }

    setTasks(prev => {
      const newTasks = {
        ...prev,
        [fromSection]: prev[fromSection].filter(t => t.id !== taskId),
        [toSection]: [...prev[toSection], { ...task, order: prev[toSection].length }]
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      // Сохраняем в Firebase
      saveToFirebase(newTasks, 'tasks');
      return newTasks;
    });
    
    // Объявление для скрин-ридеров
    const sectionNames = {
      today: 'Сегодня',
      todo: 'В планах',
      done: 'Сделано'
    };
    accessibilityActions.announce(`Задача "${task.text}" перемещена из "${sectionNames[fromSection]}" в "${sectionNames[toSection]}"`);
  }, [tasks, pwaActions]);

  const deleteTask = useCallback((taskId: number, section: 'today' | 'todo' | 'done') => {
    const task = tasks[section].find(t => t.id === taskId);
    setTasks(prev => {
      const newTasks = {
        ...prev,
        [section]: prev[section].filter(t => t.id !== taskId)
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      // Сохраняем в Firebase
      saveToFirebase(newTasks, 'tasks');
      return newTasks;
    });
    
    // Объявление для скрин-ридеров
    if (task) {
      accessibilityActions.announce(`Задача "${task.text}" удалена`);
    }
  }, [tasks]);

  const toggleNotes = useCallback((taskId: number) => {
    setExpandedNotes(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  }, []);

  const updateTaskNotes = useCallback((taskId: number, section: 'today' | 'todo' | 'done', notes: string) => {
    setTasks(prev => {
      const newTasks = {
        ...prev,
        [section]: prev[section].map(t => 
          t.id === taskId ? { ...t, notes } : t
        )
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      return newTasks;
    });
  }, []);

  // Функции для изменения порядка задач
  const moveTaskUp = useCallback((taskId: number, section: 'today' | 'todo' | 'done') => {
    setTasks(prev => {
      const sectionTasks = [...prev[section]];
      const taskIndex = sectionTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex > 0) {
        // Меняем местами с предыдущей задачей
        const temp = sectionTasks[taskIndex];
        sectionTasks[taskIndex] = { ...sectionTasks[taskIndex - 1], order: taskIndex };
        sectionTasks[taskIndex - 1] = { ...temp, order: taskIndex - 1 };
        
        const newTasks = {
          ...prev,
          [section]: sectionTasks
        };
        saveToLocalStorage(newTasks, 'focus-tasks');
        return newTasks;
      }
      return prev;
    });
  }, []);

  const moveTaskDown = useCallback((taskId: number, section: 'today' | 'todo' | 'done') => {
    setTasks(prev => {
      const sectionTasks = [...prev[section]];
      const taskIndex = sectionTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex < sectionTasks.length - 1) {
        // Меняем местами со следующей задачей
        const temp = sectionTasks[taskIndex];
        sectionTasks[taskIndex] = { ...sectionTasks[taskIndex + 1], order: taskIndex };
        sectionTasks[taskIndex + 1] = { ...temp, order: taskIndex + 1 };
        
        const newTasks = {
          ...prev,
          [section]: sectionTasks
        };
        saveToLocalStorage(newTasks, 'focus-tasks');
        return newTasks;
      }
      return prev;
    });
  }, []);

  const updateTaskProject = useCallback((
    taskId: number,
    section: 'today' | 'todo' | 'done',
    projectName: string
  ) => {
    const projectObj = projects.find(p => p.name === projectName);
    setTasks(prev => {
      const newTasks = {
        ...prev,
        [section]: prev[section].map(t => 
          t.id === taskId ? { 
            ...t, 
            project: projectName,
            projectColor: projectObj ? projectObj.color : ''
          } : t
        )
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      return newTasks;
    });
  }, [projects]);

  // Редактирование полей задачи
  const updateTaskText = useCallback((taskId: number, section: Section, text: string) => {
    setTasks(prev => {
      const newTasks = {
        ...prev,
        [section]: prev[section].map(t => (t.id === taskId ? { ...t, text } : t))
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      return newTasks;
    });
  }, []);

  const addTagToTask = useCallback((taskId: number, section: Section, tag: string) => {
    const clean = (tag || '').trim().toLowerCase();
    if (!clean) return;
    setTasks(prev => ({
      ...prev,
      [section]: prev[section].map(t =>
        t.id === taskId ? { ...t, tags: Array.from(new Set([...(t.tags || []), clean])) } : t
      )
    }));
  }, []);

  const removeTagFromTask = useCallback((taskId: number, section: Section, tag: string) => {
    setTasks(prev => ({
      ...prev,
      [section]: prev[section].map(t =>
        t.id === taskId ? { ...t, tags: (t.tags || []).filter((x: string) => x !== tag) } : t
      )
    }));
  }, []);

  // Функции для тегов
  const addTag = useCallback((tagName: string) => {
    if (!tagName.trim()) return;
    const cleanTag = tagName.trim().toLowerCase();
    if (!newTaskTags.includes(cleanTag)) {
      setNewTaskTags(prev => [...prev, cleanTag]);
    }
  }, [newTaskTags]);

  const removeNewTaskTag = useCallback((tag: string) => {
    setNewTaskTags(prev => prev.filter(t => t !== tag));
  }, []);

  const addNewTag = useCallback(() => {
    if (!newTagName.trim()) return;
    const cleanTag = newTagName.trim().toLowerCase();
    if (!availableTags.includes(cleanTag)) {
      setAvailableTags(prev => {
        const newTags = [...prev, cleanTag];
        saveToLocalStorage(newTags, 'focus-tags');
        return newTags;
      });
    }
    setNewTagName('');
  }, [newTagName, availableTags]);

  const removeAvailableTag = useCallback((tag: string) => {
    setAvailableTags(prev => {
      const newTags = prev.filter(t => t !== tag);
      saveToLocalStorage(newTags, 'focus-tags');
      return newTags;
    });
    setTasks(prev => {
      const newTasks = {
        today: prev.today.map(task => ({ 
          ...task, 
          tags: (task.tags || []).filter(t => t !== tag) 
        })),
        todo: prev.todo.map(task => ({ 
          ...task, 
          tags: (task.tags || []).filter(t => t !== tag) 
        })),
        done: prev.done.map(task => ({ 
          ...task, 
          tags: (task.tags || []).filter(t => t !== tag) 
        }))
      };
      saveToLocalStorage(newTasks, 'focus-tasks');
      return newTasks;
    });
  }, []);

  // Функции для проектов
  const addProject = useCallback(() => {
    if (!newProjectName.trim()) return;
    setProjects(prev => {
      const newProjects = [...prev, {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        color: selectedProjectColor
      }];
      saveToLocalStorage(newProjects, 'focus-projects');
      return newProjects;
    });
    setNewProjectName('');
  }, [newProjectName, selectedProjectColor]);

  const removeProject = useCallback((projectName: string) => {
    setProjects(prev => {
      const newProjects = prev.filter(p => p.name !== projectName);
      saveToLocalStorage(newProjects, 'focus-projects');
      return newProjects;
    });
  }, []);

  // Фильтрация
  const filteredTasks = useCallback((section: 'today' | 'todo' | 'done') => {
    let filtered = tasks[section] || [];

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedProjectFilter) {
      filtered = filtered.filter(task => task.project === selectedProjectFilter);
    }

    if (selectedTagFilter) {
      filtered = filtered.filter(task => 
        task.tags && task.tags.includes(selectedTagFilter)
      );
    }

    // Сортируем по порядку
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks, searchQuery, selectedProjectFilter, selectedTagFilter]);

  const getAllTags = useCallback((): string[] => {
    const allTags = new Set(availableTags);
    Object.values(tasks).flat().forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags);
  }, [availableTags, tasks]);

  // Функция архивирования задач
  const archiveTasks = useCallback(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const doneTasks = tasks.done.filter(task => {
      const taskMonth = new Date(task.createdAt).toISOString().slice(0, 7);
      return taskMonth !== currentMonth;
    });
    
    if (doneTasks.length > 0) {
      setArchive(prev => {
        const newArchive = [...prev, {
          month: currentMonth,
          tasks: doneTasks
        }];
        saveToLocalStorage(newArchive, 'focus-archive');
        return newArchive;
      });
      
      // Удаляем архивированные задачи из текущего списка
      setTasks(prev => {
        const newTasks = {
          ...prev,
          done: prev.done.filter(task => {
            const taskMonth = new Date(task.createdAt).toISOString().slice(0, 7);
            return taskMonth === currentMonth;
          })
        };
        saveToLocalStorage(newTasks, 'focus-tasks');
        return newTasks;
      });
    }
  }, [tasks]);

  // Функция отображения HTML заметок
  const formatNotes = (text: string) => {
    if (!text) return '';
    return text; // Теперь возвращаем HTML как есть, так как редактор уже генерирует HTML
  };

  // Мемоизированные вычисляемые значения
  const projectNames = useMemo(() => projects.map(p => p.name), [projects]);
  const currentFilteredTasks = useMemo(() => filteredTasks(activeSection), [filteredTasks, activeSection]);

  // Рендер состояний загрузки и ошибок
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner size="lg" text="Загрузка приложения..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: colors.background
      }}>
        <ErrorState 
          title="Ошибка загрузки"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner size="lg" text="Инициализация..." />
      </div>
    );
  }

  // Рендер
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.background,
      overflowX: 'hidden',
      maxWidth: '100vw'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Skip Link для доступности */}
      <SkipLink targetId="main-content" />
      
      {/* Live Region для объявлений */}
      <LiveRegion role="status" ariaLive="polite">
        {accessibilityState.announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </LiveRegion>
      {/* Header */}
      <div style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '16px 24px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ cursor: 'pointer' }}>
                <Logo size={40} />
              </div>
              
              {/* Индикатор синхронизации */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: colors.text.secondary
              }}>
                {syncStatus === 'syncing' && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #FFA726',
                    borderTop: '2px solid transparent',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
                {syncStatus === 'synced' && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#66BB6A'
                  }} />
                )}
                {syncStatus === 'error' && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#EF5350'
                  }} />
                )}
                <span>
                  {syncStatus === 'syncing' && 'Синхронизация...'}
                  {syncStatus === 'synced' && 'Синхронизировано'}
                  {syncStatus === 'error' && 'Ошибка синхронизации'}
                  {syncStatus === 'idle' && 'Офлайн'}
                </span>
                {lastSyncTime && (
                  <span style={{ fontSize: '10px' }}>
                    {lastSyncTime.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Мобильная кнопка меню */}
              {responsiveState.isMobile && (
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(true)}
                  ariaLabel="Открыть меню"
                >
                  <Menu size={18} />
                </TouchButton>
              )}
              
              <button 
                onClick={() => setShowSearch(!showSearch)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Поиск задач"
                aria-expanded={showSearch}
                aria-haspopup="dialog"
              >
                <Search size={18} color={colors.text.secondary} />
              </button>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  background: showFilters ? '#B8D4E820' : 'none',
                  border: 'none',
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => !showFilters && (e.currentTarget.style.backgroundColor = '#F0F0F0')}
                onMouseLeave={(e) => !showFilters && (e.currentTarget.style.backgroundColor = 'transparent')}
                aria-label="Фильтры"
                aria-expanded={showFilters}
                aria-haspopup="dialog"
              >
                <Filter size={18} color={showFilters ? colors.accent.todo : colors.text.secondary} />
              </button>
              
              <button 
                onClick={() => setShowSettings(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Настройки"
                aria-haspopup="dialog"
              >
                <Settings size={18} color={colors.text.secondary} />
              </button>
              
              <button 
                onClick={() => signOut(auth)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B20'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Выйти"
              >
                <X size={18} color="#FF6B6B" />
              </button>
            </div>
          </div>
          
          {showSearch && (
            <div style={{ marginTop: '16px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск задач..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  color: colors.text.primary,
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}
          
          {/* Блок с цитатами */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '12px 0',
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            marginTop: '16px'
          }}>
            <QuoteCarousel />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '12px 24px', display: 'flex', gap: '12px', boxSizing: 'border-box', width: '100%' }}>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Все проекты</option>
              {projects.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
            
            <select
              value={selectedTagFilter}
              onChange={(e) => setSelectedTagFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Все теги</option>
              {getAllTags().map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <ResponsiveContainer
        mobilePadding={16}
        tabletPadding={20}
        desktopPadding={24}
        maxWidth={{
          mobile: 100,
          tablet: 768,
          desktop: 1024,
        }}
      >
        <AnimatedContainer
          animation="fade"
          duration={0.5}
          style={{ 
            width: '100%',
            overflowX: 'hidden'
          }}
          id="main-content"
          role="main"
        >
        {/* Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            padding: '4px',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            display: 'flex'
          }}>
            {[
              { key: 'today', label: 'Сегодня', count: tasks.today.length, color: colors.accent.today },
              { key: 'todo', label: 'В планах', count: tasks.todo.length, color: colors.accent.todo },
              { key: 'done', label: 'Сделано', count: tasks.done.length, color: colors.accent.done }
            ].map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as Section)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: activeSection === section.key ? 'white' : 'transparent',
                  boxShadow: activeSection === section.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span style={{
                  fontWeight: '500',
                  fontSize: '14px',
                  color: activeSection === section.key ? colors.text.primary : colors.text.secondary
                }}>
                  {section.label}
                </span>
                {section.count > 0 && (
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: activeSection === section.key ? section.color : colors.border,
                    color: colors.text.primary,
                    fontWeight: '500'
                  }}>
                    {section.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {activeSection === 'today' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'white',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: colors.accent.today,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={18} color={colors.text.primary} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: colors.text.primary }}>
                    {completedToday} из {tasks.today.length + completedToday}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                    Сегодня
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'white',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: colors.accent.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={18} color={colors.text.primary} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: colors.text.primary }}>
                    {completedThisMonth}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                    За месяц
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Task */}
        {activeSection !== 'done' && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 48px 48px',
                gap: '12px',
                alignItems: 'center',
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showNewTaskExpanded && addTask()}
                placeholder="Добавить задачу..."
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  maxWidth: '100%',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  border: `1px solid ${colors.border}`,
                  color: colors.text.primary,
                  fontSize: '16px',
                  outline: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
              <button
                onClick={() => setShowNewTaskExpanded(!showNewTaskExpanded)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Plus size={20} color={colors.text.secondary} />
              </button>
              <button
                onClick={addTask}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  backgroundColor: colors.accent.primary,
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Check size={20} />
              </button>
            </div>
            
            {showNewTaskExpanded && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: `1px solid ${colors.border}`
              }}>
                <VisualEditor
                  value={newTaskNotes}
                  onChange={setNewTaskNotes}
                  placeholder="Добавить заметки..."
                />
                
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {newTaskTags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      backgroundColor: colors.accent.todo + '40',
                      color: colors.text.primary,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      #{tag}
                      <button
                        onClick={() => removeNewTaskTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex'
                        }}
                      >
                        <X size={10} color="#FF6B6B" />
                      </button>
                    </span>
                  ))}
                  
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addTag(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">+ Тег</option>
                    {getAllTags().filter(tag => !newTaskTags.includes(tag)).map(tag => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Проект</option>
                    {projects.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  
                  <input
                    type="file"
                    id="new-task-files"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files, true)}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="new-task-files"
                    style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: colors.accent.primary + '20',
                      color: colors.text.primary,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Upload size={12} />
                    Файлы
                  </label>
                </div>
                
                {newTaskFiles.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {newTaskFiles.map(file => (
                      <div key={file.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: colors.background
                      }}>
                        <span style={{
                          fontSize: '12px',
                          color: colors.text.secondary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Paperclip size={12} />
                          {file.name}
                        </span>
                        <button
                          onClick={() => removeFile(file.id, true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={12} color="#FF6B6B" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tasks */}
        <div style={{ 
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}>
          {currentFilteredTasks.length === 0 ? (
            <EmptyState
              title={
                activeSection === 'today' ? 'Нет задач на сегодня' :
                activeSection === 'todo' ? 'Список задач пуст' :
                'Нет выполненных задач'
              }
              description={
                activeSection !== 'done' ? 'Добавьте задачи, чтобы начать работу' :
                'Выполненные задачи появятся здесь'
              }
              icon={
                activeSection === 'today' ? '📅' :
                activeSection === 'todo' ? '📋' :
                '✅'
              }
              actionText={activeSection !== 'done' ? 'Добавить задачу' : undefined}
              onAction={activeSection !== 'done' ? () => inputRef.current?.focus() : undefined}
            />
          ) : (
            <VirtualizedTaskList
              tasks={currentFilteredTasks}
              section={activeSection}
              colors={colors}
              expandedNotes={expandedNotes}
              onToggleNotes={toggleNotes}
              onMoveUp={moveTaskUp}
              onMoveDown={moveTaskDown}
              onUpdateText={updateTaskText}
              onUpdateNotes={updateTaskNotes}
              onUpdateProject={updateTaskProject}
              onAddTagToTask={addTagToTask}
              onRemoveTagFromTask={removeTagFromTask}
              onHandleFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
              getAllTags={getAllTags}
              projectNames={projectNames}
            />
          )}
        </div>

        {/* Celebration */}
        {activeSection === 'today' && tasks.today.length === 0 && completedToday > 0 && (
          <div style={{
            marginTop: '32px',
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${colors.accent.today}40, ${colors.accent.primary}40)`,
            border: `1px solid ${colors.accent.primary}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: colors.text.primary }}>
              Отличная работа!
            </div>
            <div style={{ fontSize: '14px', color: colors.text.secondary }}>
              Все задачи на сегодня выполнены
            </div>
          </div>
        )}
        </AnimatedContainer>
      </ResponsiveContainer>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        >
          <FocusTrap active={showSettings}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            role="document"
            >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Logo size={28} />
                <h2 id="settings-title" style={{ fontSize: '20px', fontWeight: '600', color: colors.text.primary, margin: 0 }}>
                  Настройки
                </h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <X size={20} color={colors.text.secondary} />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: colors.text.primary }}>
                Проекты
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Название проекта"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <input
                  type="color"
                  value={selectedProjectColor}
                  onChange={(e) => setSelectedProjectColor(e.target.value)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer'
                  }}
                />
                <button
                  onClick={addProject}
                  style={{
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: colors.accent.primary,
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {projects.map(project => (
                  <div key={project.name} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: colors.background
                  }}>
                    <span style={{
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: project.color,
                      color: colors.text.primary
                    }}>
                      {project.name}
                    </span>
                    <button
                      onClick={() => removeProject(project.name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      <Trash2 size={14} color="#FF6B6B" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: colors.text.primary }}>
                Теги
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                  placeholder="Новый тег"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addNewTag}
                  style={{
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: colors.accent.primary,
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {getAllTags().map(tag => (
                  <span key={tag} style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    backgroundColor: colors.accent.todo + '40',
                    color: colors.text.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    #{tag}
                    <button
                      onClick={() => removeAvailableTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex'
                      }}
                    >
                      <X size={10} color="#FF6B6B" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: colors.text.primary }}>
                Авторизация
              </h3>
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: colors.text.secondary }}>
                    Email:
                  </span>
                  <span style={{ fontSize: '14px', color: colors.text.primary, marginLeft: '8px', fontWeight: '500' }}>
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut(auth)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FF6B6B20',
                    border: '1px solid #FF6B6B',
                    color: '#FF6B6B',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF6B6B30';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF6B6B20';
                  }}
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: colors.text.primary }}>
                Другие настройки
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={archiveTasks}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: colors.accent.primary + '20',
                    border: `1px solid ${colors.accent.primary}`,
                    color: colors.accent.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent.primary + '30';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent.primary + '20';
                  }}
                >
                  Архивировать старые задачи
                </button>
                
                <button
                  onClick={() => {
                    console.log('=== ДАННЫЕ В LOCALSTORAGE ===');
                    console.log('Задачи:', JSON.parse(localStorage.getItem('focus-tasks') || '{}'));
                    console.log('Проекты:', JSON.parse(localStorage.getItem('focus-projects') || '[]'));
                    console.log('Теги:', JSON.parse(localStorage.getItem('focus-tags') || '[]'));
                    console.log('Архив:', JSON.parse(localStorage.getItem('focus-archive') || '[]'));
                    console.log('Все ключи:', Object.keys(localStorage));
                    alert('Данные выведены в консоль (F12 → Console)');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: colors.accent.todo + '20',
                    border: `1px solid ${colors.accent.todo}`,
                    color: colors.accent.todo,
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent.todo + '30';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent.todo + '20';
                  }}
                >
                  Проверить данные
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Очистить все данные? Это действие нельзя отменить.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FF6B6B20',
                    border: '1px solid #FF6B6B',
                    color: '#FF6B6B',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF6B6B30';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF6B6B20';
                  }}
                >
                  Очистить все данные
                </button>
                
                {/* Кнопки для тестирования виртуализации (только в режиме разработки) */}
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <button
                      onClick={() => {
                        if (window.confirm('Добавить 100 тестовых задач для проверки виртуализации?')) {
                          addTestData(100);
                          window.location.reload();
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#9B59B620',
                        border: '1px solid #9B59B6',
                        color: '#9B59B6',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9B59B630';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#9B59B620';
                      }}
                    >
                      Добавить тестовые данные (100 задач)
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Очистить тестовые данные?')) {
                          clearTestData();
                          window.location.reload();
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#E67E2220',
                        border: '1px solid #E67E22',
                        color: '#E67E22',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E67E2230';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#E67E2220';
                      }}
                    >
                      Очистить тестовые данные
                    </button>
                  </>
                )}
              </div>
              
              {archive.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: colors.text.primary }}>
                    Архив ({archive.length} месяцев):
                  </h4>
                  {archive.map((monthData, index) => (
                    <div key={index} style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: colors.background,
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      {monthData.month}: {monthData.tasks.length} задач
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </FocusTrap>
        </div>
      )}
      
      {/* Мобильная навигация */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        position="left"
      >
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Logo size={32} />
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              ariaLabel="Закрыть меню"
            >
              <X size={20} />
            </TouchButton>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TouchButton
              variant="primary"
              fullWidth
              onClick={() => {
                setActiveSection('today');
                setIsMobileMenuOpen(false);
              }}
            >
              Сегодня ({tasks.today.length})
            </TouchButton>
            
            <TouchButton
              variant="secondary"
              fullWidth
              onClick={() => {
                setActiveSection('todo');
                setIsMobileMenuOpen(false);
              }}
            >
              В планах ({tasks.todo.length})
            </TouchButton>
            
            <TouchButton
              variant="secondary"
              fullWidth
              onClick={() => {
                setActiveSection('done');
                setIsMobileMenuOpen(false);
              }}
            >
              Сделано ({tasks.done.length})
            </TouchButton>
            
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px', marginTop: '16px' }}>
              <TouchButton
                variant="ghost"
                fullWidth
                onClick={() => {
                  setShowSettings(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Настройки
              </TouchButton>
              
              <TouchButton
                variant="danger"
                fullWidth
                onClick={() => {
                  signOut(auth);
                  setIsMobileMenuOpen(false);
                }}
              >
                Выйти
              </TouchButton>
            </div>
          </div>
        </div>
      </MobileNavigation>
      
      {/* PWA статус */}
      <PWAStatus />
      
      {/* Монитор производительности */}
      <PerformanceMonitor
        taskCount={currentFilteredTasks.length}
        isVirtualized={currentFilteredTasks.length >= 10}
      />
    </div>
  );
};

export default FocusMinimal;