# 🔧 Технические детали FOCUS Task Manager

## 🏗️ **Архитектура приложения**

### **Структура компонентов:**
```
App.tsx (Root)
├── Auth.tsx (Аутентификация)
└── FocusMinimal.tsx (Основное приложение)
    ├── Header (Шапка с логотипом и поиском)
    ├── QuoteCarousel (Карусель цитат)
    ├── Tabs (Переключение разделов)
    ├── Stats (Статистика)
    ├── TaskForm (Форма добавления задач)
    ├── TaskList (Список задач)
    │   └── TaskItem (Компонент задачи)
    └── SettingsModal (Модальное окно настроек)
```

### **Управление состоянием:**
- **Локальное состояние**: useState для UI состояния
- **Облачное состояние**: Firebase Firestore для данных
- **Офлайн поддержка**: localStorage для резервного копирования
- **Синхронизация**: useFirebase хук для автоматической синхронизации

## 📦 **Зависимости и их назначение**

### **Основные зависимости:**
```json
{
  "react": "^19.0.0",           // Основной фреймворк
  "react-dom": "^19.0.0",       // DOM рендеринг
  "typescript": "^5.0.0",       // Типизация
  "firebase": "^10.0.0",        // Backend и аутентификация
  "lucide-react": "^0.3.0",     // Иконки
  "@tiptap/react": "^2.0.0",    // Rich text editor
  "@tiptap/starter-kit": "^2.0.0", // Базовые расширения TipTap
  "@tiptap/extension-link": "^2.0.0", // Расширение для ссылок
  "@tiptap/extension-bold": "^2.0.0",  // Расширение для жирного текста
  "@tiptap/extension-italic": "^2.0.0", // Расширение для курсива
  "@tiptap/extension-ordered-list": "^2.0.0", // Нумерованные списки
  "@tiptap/extension-bullet-list": "^2.0.0"   // Маркированные списки
}
```

### **Dev зависимости:**
```json
{
  "@types/react": "^19.0.0",    // TypeScript типы для React
  "@types/react-dom": "^19.0.0", // TypeScript типы для React DOM
  "@types/node": "^20.0.0"      // TypeScript типы для Node.js
}
```

## 🎨 **Система стилей**

### **Подход к стилизации:**
- **Inline стили**: Все стили написаны inline для максимальной портативности
- **CSS классы**: Минимальное использование для переопределения inline стилей
- **Цветовая схема**: Централизованная система цветов в объекте colors

### **Цветовая палитра:**
```javascript
const colors = {
  background: '#FDFBF7',    // Теплый светлый фон
  text: {
    primary: '#2E2E2E',     // Основной текст
    secondary: '#8E8E93',   // Вторичный текст
    placeholder: '#C7C7CC'  // Плейсхолдеры
  },
  accent: {
    today: '#A8D5BA',       // Мягкий зеленый (Сегодня)
    todo: '#B8D4E8',        // Голубой (В планах)
    done: '#C3E8D1',        // Мятный (Сделано)
    primary: '#7FB69E'      // Основной акцент
  },
  border: '#F0F0F0'         // Границы
};
```

### **CSS классы (src/App.css):**
```css
/* Переопределение inline стилей для textarea */
.task-notes-textarea {
  width: 97% !important;
  box-sizing: border-box !important;
  max-width: 97% !important;
  overflow-x: hidden !important;
}

/* Стили для TipTap редактора */
.visual-editor-content p {
  margin: 0 0 8px 0;
}

.visual-editor-content h1,
.visual-editor-content h2,
.visual-editor-content h3 {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.visual-editor-content ul,
.visual-editor-content ol {
  margin: 8px 0;
  padding-left: 20px;
}

.visual-editor-content a {
  color: #7FB69E;
  text-decoration: underline;
}
```

## 🔐 **Система безопасности**

### **Валидация данных:**
```typescript
// Пример валидации задачи
export const validateTask = (task: {
  text: string;
  notes?: string;
  files?: any[];
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!task.text || task.text.trim().length === 0) {
    errors.push('Текст задачи обязателен');
  } else if (task.text.length > 500) {
    errors.push('Текст задачи не должен превышать 500 символов');
  }
  
  if (task.notes && task.notes.length > 5000) {
    errors.push('Заметки не должны превышать 5000 символов');
  }
  
  if (task.files && task.files.length > 10) {
    errors.push('Максимум 10 файлов на задачу');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### **Firebase Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.email_verified == true;
    }
  }
}
```

### **Защита от XSS:**
```typescript
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/[<>]/g, '') // Убираем потенциально опасные символы
    .substring(0, 5000); // Ограничиваем длину
};

export const hasXSS = (text: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(text));
};
```

## 📊 **Структура данных**

### **Модель задачи:**
```typescript
interface Task {
  id: string;
  text: string;
  notes?: string;
  section: 'today' | 'todo' | 'done';
  project?: string;
  tags: string[];
  files: FileAttachment[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64
}
```

### **Модель проекта:**
```typescript
interface Project {
  name: string;
  color: string;
}
```

### **Модель пользователя:**
```typescript
interface UserData {
  tasks: {
    today: Task[];
    todo: Task[];
    done: Task[];
  };
  projects: Project[];
  tags: string[];
  completedThisMonth: number;
  archive: Task[];
}
```

## 🔄 **Система синхронизации**

### **Firebase интеграция:**
```typescript
// src/useFirebase.ts
export const useFirebase = (user: any) => {
  const saveToFirebase = useCallback(async (data: any) => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }, [user]);

  const loadFromFirebase = useCallback(async () => {
    if (!user) return null;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.error('Error loading from Firebase:', error);
    }
    
    return null;
  }, [user]);

  return { saveToFirebase, loadFromFirebase };
};
```

### **Офлайн поддержка:**
```typescript
// localStorage функции
const saveToLocalStorage = (data: any) => {
  try {
    localStorage.setItem('focus-app-data', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('focus-app-data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};
```

## 🎯 **Производительность**

### **Оптимизации:**
1. **React.memo**: Для предотвращения лишних ре-рендеров
2. **useCallback**: Для мемоизации функций
3. **useMemo**: Для кэширования вычислений
4. **Debouncing**: Для ограничения частоты обновлений

### **Пример оптимизации:**
```typescript
// Debounced функция для сохранения
const debouncedSave = useCallback(
  debounce((data) => {
    saveToFirebase(data);
    saveToLocalStorage(data);
  }, 1000),
  [saveToFirebase]
);
```

## 🧪 **Тестирование**

### **Текущее состояние:**
- ❌ Нет unit тестов
- ❌ Нет integration тестов
- ❌ Нет E2E тестов

### **Рекомендации по тестированию:**
```typescript
// Пример unit теста для валидации
describe('validateTask', () => {
  it('should validate empty task text', () => {
    const result = validateTask({ text: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Текст задачи обязателен');
  });

  it('should validate task with valid data', () => {
    const result = validateTask({ 
      text: 'Valid task',
      notes: 'Valid notes'
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

## 📱 **Адаптивность**

### **Breakpoints:**
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### **Адаптивные элементы:**
- Гибкая сетка для задач
- Адаптивные размеры шрифтов
- Мобильная навигация
- Touch-friendly кнопки

## 🔧 **Конфигурация**

### **Переменные окружения:**
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Security Settings
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_MAX_TASKS_PER_USER=1000
REACT_APP_MAX_PROJECTS_PER_USER=50
REACT_APP_MAX_TAGS_PER_USER=100

# Feature Flags
REACT_APP_ENABLE_FILE_UPLOAD=true
REACT_APP_ENABLE_ARCHIVE=true
REACT_APP_ENABLE_EXPORT=true
```

### **TypeScript конфигурация:**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## 🚀 **Развертывание**

### **Build процесс:**
```bash
npm run build
```

### **Оптимизации сборки:**
- Минификация кода
- Tree shaking
- Code splitting
- Asset optimization

### **Размер бандла:**
- **Основной бандл**: ~500KB
- **Vendor бандл**: ~300KB
- **Total**: ~800KB (gzipped: ~200KB)

---

**Дата создания**: Август 2024  
**Версия**: 1.0.0  
**Статус**: Актуально
