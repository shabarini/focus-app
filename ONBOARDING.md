# 👋 Онбординг для нового разработчика

## 🎯 **Добро пожаловать в проект FOCUS Task Manager!**

Этот документ поможет вам быстро понять проект и начать работу.

## 📋 **Что нужно знать в первую очередь**

### **1. О проекте**
- **Название**: FOCUS Task Manager
- **Тип**: Минималистичный планировщик задач
- **Стиль**: Apple/Claude.ai дизайн
- **Статус**: Готово к развертыванию

### **2. Технический стек**
- **Frontend**: React 19 + TypeScript
- **Backend**: Firebase (Auth + Firestore)
- **Стили**: Inline стили (без CSS-фреймворков)
- **Иконки**: Lucide React
- **Editor**: TipTap (rich text)

### **3. Ключевые файлы**
```
📁 focus-app/
├── 📄 README.md                    # Основная документация
├── 📄 PROJECT_CONTEXT.md           # Полный контекст проекта
├── 📄 DEVELOPMENT_HISTORY.md       # История разработки
├── 📄 TECHNICAL_DETAILS.md         # Технические детали
├── 📄 FIREBASE_SETUP.md            # Настройка Firebase
├── 📄 DEPLOYMENT_GUIDE.md          # Развертывание
└── 📁 src/
    ├── 📄 App.tsx                  # Главный компонент
    ├── 📄 FocusMinimal.tsx         # Основное приложение
    ├── 📄 Auth.tsx                 # Аутентификация
    └── 📄 firebase.ts              # Firebase конфигурация
```

## 🚀 **Быстрый старт**

### **Шаг 1: Установка**
```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd focus-app

# Установите зависимости
npm install
```

### **Шаг 2: Настройка Firebase**
1. Следуйте инструкциям в `FIREBASE_SETUP.md`
2. Обновите конфигурацию в `src/firebase.ts`
3. Настройте правила безопасности в Firebase Console

### **Шаг 3: Запуск**
```bash
# Разработка
npm start

# Или используйте быстрый запуск
start-app.bat
```

## 🏗️ **Архитектура проекта**

### **Структура компонентов:**
```
App.tsx (Root)
├── Auth.tsx (Аутентификация)
└── FocusMinimal.tsx (Основное приложение)
    ├── Header (Шапка)
    ├── QuoteCarousel (Цитаты)
    ├── Tabs (Разделы)
    ├── TaskForm (Добавление задач)
    ├── TaskList (Список задач)
    └── SettingsModal (Настройки)
```

### **Управление состоянием:**
- **Локальное**: useState для UI
- **Облачное**: Firebase Firestore
- **Офлайн**: localStorage
- **Синхронизация**: useFirebase хук

## 🎨 **Дизайн-система**

### **Цветовая палитра:**
```javascript
const colors = {
  background: '#FDFBF7',    // Теплый светлый фон
  text: {
    primary: '#2E2E2E',     // Основной текст
    secondary: '#8E8E93',   // Вторичный текст
  },
  accent: {
    today: '#A8D5BA',       // Зеленый (Сегодня)
    todo: '#B8D4E8',        // Голубой (В планах)
    done: '#C3E8D1',        // Мятный (Сделано)
    primary: '#7FB69E'      // Основной акцент
  }
};
```

### **Принципы дизайна:**
- Минималистичный стиль
- Inline стили для портативности
- Адаптивная верстка
- Плавные анимации

## 🔧 **Основные функции**

### **Управление задачами:**
- ✅ Добавление, редактирование, удаление
- ✅ Перемещение между разделами
- ✅ Проекты и теги
- ✅ Прикрепление файлов
- ✅ Rich text заметки

### **Организация:**
- ✅ Поиск и фильтрация
- ✅ Статистика выполнения
- ✅ Архив задач
- ✅ Переупорядочивание

### **Аутентификация:**
- ✅ Firebase Auth
- ✅ Email/password
- ✅ Облачная синхронизация

## 🔐 **Безопасность**

### **Валидация данных:**
- Все входящие данные проверяются
- Ограничения на размер файлов (5MB)
- Защита от XSS атак
- Санитизация пользовательского ввода

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

## 🐛 **Известные проблемы и решения**

### **TypeScript ошибки:**
- **Проблема**: `Property 'name' does not exist on type 'unknown'`
- **Решение**: Используйте типизацию `Array.from(files as FileList)`

- **Проблема**: `Type 'number' is not assignable to type 'string'`
- **Решение**: Преобразуйте числа в строки: `opacity = '1'`

### **UI проблемы:**
- **Проблема**: Textarea выходит за границы
- **Решение**: Используйте `width: '97%'` в стилях

### **Интеграционные проблемы:**
- **Проблема**: React Quill не работает с React 19
- **Решение**: Используйте TipTap вместо React Quill

## 📝 **Стиль кода**

### **Компоненты:**
```typescript
// Используйте функциональные компоненты
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  return (
    <div style={{ /* inline стили */ }}>
      {/* JSX */}
    </div>
  );
};
```

### **Стили:**
```typescript
// Используйте inline стили
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: colors.background
  }
};
```

### **Типизация:**
```typescript
// Всегда используйте TypeScript
interface Task {
  id: string;
  text: string;
  section: 'today' | 'todo' | 'done';
}

type Section = 'today' | 'todo' | 'done';
```

## 🧪 **Тестирование**

### **Текущее состояние:**
- ❌ Нет unit тестов
- ❌ Нет integration тестов
- ❌ Нет E2E тестов

### **Рекомендации:**
1. Добавьте Jest для unit тестов
2. Используйте React Testing Library
3. Добавьте Cypress для E2E тестов

## 🚀 **Развертывание**

### **Варианты:**
1. **Firebase Hosting** (рекомендуется)
2. **Vercel**
3. **Netlify**
4. **Собственный сервер**

### **Процесс:**
```bash
# Сборка
npm run build

# Развертывание (Firebase)
firebase deploy
```

## 📚 **Полезные ресурсы**

### **Документация:**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TipTap Documentation](https://tiptap.dev/)

### **Инструменты:**
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firebase Console](https://console.firebase.google.com/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

## 🤝 **Рабочий процесс**

### **Для новых функций:**
1. Создайте feature branch
2. Реализуйте функционал
3. Добавьте валидацию
4. Протестируйте
5. Создайте Pull Request

### **Для исправления багов:**
1. Воспроизведите баг
2. Найдите причину
3. Исправьте
4. Протестируйте
5. Обновите документацию

### **Для рефакторинга:**
1. Обсудите изменения
2. Создайте план
3. Реализуйте поэтапно
4. Протестируйте
5. Обновите документацию

## 📞 **Поддержка**

### **Если у вас есть вопросы:**
1. Проверьте документацию в проекте
2. Посмотрите `PROJECT_CONTEXT.md`
3. Изучите `DEVELOPMENT_HISTORY.md`
4. Обратитесь к команде

### **Полезные команды:**
```bash
# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Проверка типов TypeScript
npx tsc --noEmit

# Аудит зависимостей
npm audit

# Обновление зависимостей
npm update
```

## 🎯 **Следующие шаги**

### **Краткосрочные цели:**
1. Изучите код и документацию
2. Настройте локальную среду
3. Запустите приложение
4. Познакомьтесь с Firebase

### **Долгосрочные цели:**
1. Добавьте unit тесты
2. Улучшите производительность
3. Добавьте новые функции
4. Подготовьте к продакшену

---

**Удачи в разработке! 🚀**

**Дата создания**: Август 2024  
**Версия**: 1.0.0
