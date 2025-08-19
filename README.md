# 🎯 FOCUS Task Manager - Live Demo

Минималистичный планировщик задач в стиле Apple/Claude.ai с акцентом на простоту и функциональность.

![FOCUS Task Manager](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=for-the-badge&logo=firebase)

## ✨ Особенности

- 🎨 **Минималистичный дизайн** - в стиле Apple/Claude.ai
- 🔐 **Безопасная аутентификация** - Firebase Auth
- ☁️ **Облачная синхронизация** - Firebase Firestore
- 📝 **Rich text editor** - TipTap для заметок
- 🏷️ **Проекты и теги** - организация задач
- 📎 **Прикрепление файлов** - до 5MB
- 🔍 **Поиск и фильтрация** - быстрый доступ к задачам
- 📊 **Статистика** - отслеживание прогресса
- 💬 **Мотивирующие цитаты** - карусель вдохновения
- 📱 **Адаптивный дизайн** - работает на всех устройствах

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Firebase проект

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <your-repo-url>
cd focus-app
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте Firebase**
- Следуйте инструкциям в [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- Скопируйте конфигурацию в `src/firebase.ts`

4. **Запустите приложение**
```bash
npm start
```

Или используйте быстрый запуск:
```bash
start-app.bat
```

## 📁 Структура проекта

```
focus-app/
├── src/
│   ├── App.tsx              # Главный компонент
│   ├── FocusMinimal.tsx     # Основное приложение
│   ├── Auth.tsx             # Аутентификация
│   ├── VisualEditor.tsx     # Rich text editor
│   ├── QuoteCarousel.tsx    # Карусель цитат
│   ├── Logo.tsx             # Логотип
│   ├── firebase.ts          # Firebase конфигурация
│   ├── useFirebase.ts       # Firebase хук
│   ├── utils/
│   │   └── validation.ts    # Валидация данных
│   └── types.d.ts           # TypeScript типы
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.png
├── FIREBASE_SETUP.md        # Настройка Firebase
├── FIREBASE_SECURITY_RULES.md # Безопасность
├── DEPLOYMENT_GUIDE.md      # Развертывание
└── PROJECT_CONTEXT.md       # Полный контекст
```

## 🔧 Технологии

- **Frontend**: React 19, TypeScript
- **Backend**: Firebase (Auth, Firestore)
- **UI**: Inline стили, Lucide React иконки
- **Editor**: TipTap rich text editor
- **Build**: Create React App

## 🎨 Дизайн-система

```javascript
const colors = {
  background: '#FDFBF7',    // Теплый светлый фон
  text: {
    primary: '#2E2E2E',     // Основной текст
    secondary: '#8E8E93',   // Вторичный текст
  },
  accent: {
    today: '#A8D5BA',       // Мягкий зеленый
    todo: '#B8D4E8',        // Голубой
    done: '#C3E8D1',        // Мятный
    primary: '#7FB69E'      // Основной акцент
  }
};
```

## 🔒 Безопасность

- ✅ Валидация всех входящих данных
- ✅ Firebase Security Rules
- ✅ Защита от XSS атак
- ✅ Ограничения размера файлов
- ✅ Санитизация пользовательского ввода

## 📚 Документация

### **Основная документация:**
- [Полный контекст проекта](./PROJECT_CONTEXT.md) - вся информация о проекте
- [История разработки](./DEVELOPMENT_HISTORY.md) - этапы и решения
- [Технические детали](./TECHNICAL_DETAILS.md) - архитектура и код
- [Онбординг для разработчиков](./ONBOARDING.md) - быстрый старт

### **Настройка и развертывание:**
- [Настройка Firebase](./FIREBASE_SETUP.md)
- [Правила безопасности](./FIREBASE_SECURITY_RULES.md)
- [Безопасность сервера](./SERVER_SECURITY.md)
- [Руководство по развертыванию](./DEPLOYMENT_GUIDE.md)

## 🚀 Развертывание

### Firebase Hosting (рекомендуется)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Другие платформы
См. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) для подробных инструкций по развертыванию на:
- Vercel
- Netlify
- Собственный сервер

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [документацию](./FIREBASE_SETUP.md)
2. Создайте [Issue](../../issues)
3. Обратитесь к [контексту проекта](./PROJECT_CONTEXT.md)

## 🎯 Статус проекта

**Версия**: 1.0.0  
**Статус**: Готово к развертыванию  
**Последнее обновление**: Август 2024

---

**Создано с ❤️ для продуктивности**
