# Настройка Firebase для FOCUS

## 🚀 Шаг 1: Создание проекта Firebase

1. Перейдите на [console.firebase.google.com](https://console.firebase.google.com)
2. Нажмите "Создать проект"
3. Введите название проекта (например, "focus-app")
4. Отключите Google Analytics (не обязательно)
5. Нажмите "Создать проект"

## 🔐 Шаг 2: Настройка аутентификации

1. В левом меню выберите "Authentication"
2. Нажмите "Начать"
3. Выберите "Email/Password"
4. Включите "Email/Password" и "Email link (passwordless sign-in)"
5. Нажмите "Сохранить"

## 🗄️ Шаг 3: Настройка Firestore Database

1. В левом меню выберите "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите "Начать в тестовом режиме" (для разработки)
4. Выберите ближайший регион (например, "europe-west1")
5. Нажмите "Готово"

## ⚙️ Шаг 4: Получение конфигурации

1. В левом меню выберите "Project settings" (шестеренка)
2. Прокрутите вниз до "Your apps"
3. Нажмите на иконку веб-приложения (</>)
4. Введите название приложения (например, "focus-web")
5. Нажмите "Register app"
6. Скопируйте конфигурацию

## 📝 Шаг 5: Обновление конфигурации в коде

Откройте файл `src/firebase.ts` и замените конфигурацию:

```typescript
const firebaseConfig = {
  apiKey: "ваш-api-key",
  authDomain: "ваш-project.firebaseapp.com",
  projectId: "ваш-project-id",
  storageBucket: "ваш-project.appspot.com",
  messagingSenderId: "ваш-sender-id",
  appId: "ваш-app-id"
};
```

## 🔒 Шаг 6: Настройка правил безопасности Firestore

В консоли Firebase перейдите в Firestore Database → Rules и замените правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать и писать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Шаг 7: Запуск приложения

1. Установите зависимости: `npm install`
2. Запустите приложение: `npm start`
3. Откройте http://localhost:3000
4. Создайте аккаунт или войдите в существующий

## ✨ Возможности после настройки

- ✅ Авторизация пользователей
- ✅ Синхронизация данных между устройствами
- ✅ Облачное хранение задач, проектов и тегов
- ✅ Автоматические резервные копии
- ✅ Работа в реальном времени

## 🔧 Устранение неполадок

### Ошибка "Firebase: Error (auth/invalid-api-key)"
- Проверьте правильность API ключа в конфигурации

### Ошибка "Firebase: Error (auth/operation-not-allowed)"
- Убедитесь, что Email/Password включен в Authentication

### Ошибка "Firebase: Error (permission-denied)"
- Проверьте правила безопасности в Firestore

## 📱 Развертывание на сервере

После настройки Firebase приложение можно развернуть на любом хостинге:

1. **Vercel**: `npm run build` → загрузить папку `build`
2. **Netlify**: `npm run build` → загрузить папку `build`
3. **Firebase Hosting**: `npm install -g firebase-tools` → `firebase deploy`

## 💰 Стоимость

- **Бесплатный план**: 1GB данных, 50,000 операций в день
- **Платный план**: от $25/месяц за больше данных

Для личного использования бесплатного плана более чем достаточно!
