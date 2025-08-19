import { Task, Project } from '../types';

// Экспорт в JSON (полный формат)
export const exportToJSON = (data: any): string => {
  return JSON.stringify(data, null, 2);
};

// Экспорт в CSV (только задачи)
export const exportTasksToCSV = (tasks: Record<string, Task[]>): string => {
  const headers = ['Секция', 'Текст', 'Проект', 'Теги', 'Заметки', 'Дата создания', 'Порядок'];
  const rows = [headers.join(',')];
  
  Object.entries(tasks).forEach(([section, taskList]) => {
    taskList.forEach(task => {
      const row = [
        section,
        `"${task.text.replace(/"/g, '""')}"`,
        task.project || '',
        task.tags ? `"${task.tags.join('; ')}"` : '',
        task.notes ? `"${task.notes.replace(/"/g, '""')}"` : '',
        task.createdAt || '',
        task.order || 0
      ];
      rows.push(row.join(','));
    });
  });
  
  return rows.join('\n');
};

// Экспорт в TXT (простой текстовый формат)
export const exportToTXT = (tasks: Record<string, Task[]>, projects: Project[]): string => {
  let content = '=== FOCUS MINIMAL - ЭКСПОРТ ДАННЫХ ===\n\n';
  
  // Проекты
  content += '📁 ПРОЕКТЫ:\n';
  projects.forEach(project => {
    content += `- ${project.name}\n`;
  });
  content += '\n';
  
  // Задачи по секциям
  Object.entries(tasks).forEach(([section, taskList]) => {
    const sectionNames = {
      today: '📅 СЕГОДНЯ',
      todo: '📋 К ВЫПОЛНЕНИЮ',
      done: '✅ ВЫПОЛНЕНО'
    };
    
    content += `${sectionNames[section as keyof typeof sectionNames] || section.toUpperCase()}:\n`;
    if (taskList.length === 0) {
      content += '  (пусто)\n';
    } else {
      taskList.forEach((task, index) => {
        content += `  ${index + 1}. ${task.text}\n`;
        if (task.project) {
          content += `     Проект: ${task.project}\n`;
        }
        if (task.tags && task.tags.length > 0) {
          content += `     Теги: ${task.tags.join(', ')}\n`;
        }
        if (task.notes) {
          content += `     Заметки: ${task.notes}\n`;
        }
        content += '\n';
      });
    }
    content += '\n';
  });
  
  content += `\nЭкспортировано: ${new Date().toLocaleString('ru-RU')}\n`;
  return content;
};

// Экспорт в HTML (красивый формат)
export const exportToHTML = (tasks: Record<string, Task[]>, projects: Project[]): string => {
  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Focus Minimal - Экспорт данных</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
        }
        .section {
            background: white;
            margin: 20px 0;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .task {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .task-text {
            font-weight: 600;
            margin-bottom: 8px;
        }
        .task-meta {
            font-size: 0.9em;
            color: #666;
        }
        .task-meta span {
            margin-right: 15px;
        }
        .project {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-right: 10px;
        }
        .tag {
            display: inline-block;
            background: #f3e5f5;
            color: #7b1fa2;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-right: 5px;
        }
        .empty {
            color: #999;
            font-style: italic;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Focus Minimal</h1>
        <p>Экспорт данных</p>
        <p>${new Date().toLocaleString('ru-RU')}</p>
    </div>

    <div class="section">
        <h2>📁 Проекты</h2>
        ${projects.map(project => `
            <div class="project">${project.name}</div>
        `).join('')}
    </div>

    ${Object.entries(tasks).map(([section, taskList]) => {
        const sectionNames = {
            today: '📅 Сегодня',
            todo: '📋 К выполнению',
            done: '✅ Выполнено'
        };
        
        return `
            <div class="section">
                <h2>${sectionNames[section as keyof typeof sectionNames] || section}</h2>
                ${taskList.length === 0 ? 
                    '<div class="empty">Нет задач</div>' :
                    taskList.map(task => `
                        <div class="task">
                            <div class="task-text">${task.text}</div>
                            <div class="task-meta">
                                ${task.project ? `<span>Проект: <span class="project">${task.project}</span></span>` : ''}
                                ${task.tags && task.tags.length > 0 ? 
                                    `<span>Теги: ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</span>` : ''}
                                ${task.notes ? `<span>Заметки: ${task.notes}</span>` : ''}
                                <span>Создано: ${new Date(task.createdAt).toLocaleDateString('ru-RU')}</span>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
    }).join('')}

    <div class="footer">
        <p>Экспортировано из Focus Minimal</p>
        <p>${new Date().toLocaleString('ru-RU')}</p>
    </div>
</body>
</html>`;

  return html;
};

// Создание файла для скачивания
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


