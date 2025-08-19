import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Plus, Check, X, Settings, Search, Filter, Award, LogOut } from 'lucide-react';
import { DataManagerProvider, useDataManager } from './DataManager';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

type Section = 'today' | 'todo' | 'done';

interface TaskManagerProps {
  user: any;
}

const TaskManagerContent: React.FC = () => {
  const dataManager = useDataManager();
  
  // Локальное состояние
  const [activeSection, setActiveSection] = useState<Section>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  // Загружаем данные из DataManager
  const tasks = dataManager.loadTasks();
  const projects = dataManager.loadProjects();
  
  // Фильтрация задач
  const currentTasks = useMemo(() => {
    let filtered = tasks[activeSection] || [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tasks, activeSection, searchQuery]);

  // Функции для работы с задачами
  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      project: selectedProject,
      createdAt: new Date().toISOString(),
      order: (tasks[activeSection] || []).length
    };

    const newTasks = {
      ...tasks,
      [activeSection]: [...(tasks[activeSection] || []), task]
    };
    
    dataManager.saveTasks(newTasks);
    setNewTask('');
    setSelectedProject('');
  }, [newTask, selectedProject, activeSection, tasks, dataManager]);

  const moveTask = useCallback((taskId: number, fromSection: Section, toSection: Section) => {
    const task = tasks[fromSection]?.find(t => t.id === taskId);
    if (!task) return;

    const newTasks = {
      ...tasks,
      [fromSection]: tasks[fromSection]?.filter(t => t.id !== taskId) || [],
      [toSection]: [...(tasks[toSection] || []), { ...task, order: (tasks[toSection] || []).length }]
    };
    
    dataManager.saveTasks(newTasks);
  }, [tasks, dataManager]);

  const deleteTask = useCallback((taskId: number, section: Section) => {
    const newTasks = {
      ...tasks,
      [section]: tasks[section]?.filter(t => t.id !== taskId) || []
    };
    
    dataManager.saveTasks(newTasks);
  }, [tasks, dataManager]);

  // Цвета
  const colors = {
    background: '#FDFBF7',
    text: {
      primary: '#2E2E2E',
      secondary: '#8E8E93'
    },
    accent: {
      today: '#A8D5BA',
      todo: '#B8D4E8',
      done: '#C3E8D1',
      primary: '#7FB69E'
    },
    border: '#F0F0F0'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: `1px solid ${colors.border}`,
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: colors.text.primary,
              margin: 0
            }}>
              FOCUS
            </h1>
            
            {/* Индикатор синхронизации */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: colors.text.secondary
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#66BB6A'
              }} />
              <span>Синхронизировано</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                color: colors.text.secondary
              }}
            >
              <Settings size={20} />
            </button>
            
            <button
              onClick={() => signOut(auth)}
              style={{
                padding: '8px 16px',
                backgroundColor: colors.accent.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Navigation */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: '16px',
          flexWrap: 'nowrap'
        }}>
          {(['today', 'todo', 'done'] as Section[]).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                padding: '12px 24px',
                backgroundColor: activeSection === section ? colors.accent[section] : 'transparent',
                color: activeSection === section ? colors.text.primary : colors.text.secondary,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeSection === section ? '600' : '400',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {section === 'today' ? 'Сегодня' : section === 'todo' ? 'В планах' : 'Сделано'}
              <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                ({(tasks[section] || []).length})
              </span>
            </button>
          ))}
        </nav>

        {/* Search */}
        <div style={{
          marginBottom: '24px'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '600px'
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.text.secondary,
              zIndex: 1
            }} />
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Add Task */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'nowrap'
          }}>
            <input
              type="text"
              placeholder="Добавить задачу..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'white',
                minWidth: 0
              }}
            />
            
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: '12px 16px',
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'white',
                minWidth: '140px',
                flexShrink: 0
              }}
            >
              <option value="">Без проекта</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={addTask}
              disabled={!newTask.trim()}
              style={{
                padding: '12px 20px',
                backgroundColor: newTask.trim() ? colors.accent.primary : colors.border,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: newTask.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={20} />
              Добавить
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${colors.border}`
        }}>
          {currentTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: colors.text.secondary
            }}>
              <p>Нет задач в этом разделе</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    backgroundColor: 'white'
                  }}
                >
                  <button
                    onClick={() => moveTask(task.id, activeSection, 'done')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      color: colors.accent.done
                    }}
                  >
                    <Check size={20} />
                  </button>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      color: colors.text.primary,
                      marginBottom: '4px'
                    }}>
                      {task.text}
                    </div>
                    {task.project && (
                      <div style={{
                        fontSize: '12px',
                        color: colors.text.secondary
                      }}>
                        {task.project}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id, activeSection)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      color: '#EF5350'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TaskManager: React.FC<TaskManagerProps> = ({ user }) => {
  return (
    <DataManagerProvider user={user}>
      <TaskManagerContent />
    </DataManagerProvider>
  );
};

export default TaskManager;
