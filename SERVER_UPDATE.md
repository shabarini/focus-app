# 🚀 Обновление приложения на сервере

## 📋 Что нужно обновить

### 1. **Файлы для обновления:**
- `src/App.js` - Заменен FocusMinimal на TaskManager
- `src/components/DataManager.tsx` - Добавлена Firebase синхронизация
- `src/components/TaskManager.tsx` - Обновлен для работы с синхронизацией
- `src/firebase.ts` - Уже обновлен для работы с переменными окружения

### 2. **Новый файл для создания:**
- `.env.local` или `.env.production` - Firebase конфигурация

## 🔧 Пошаговое обновление

### Шаг 1: Создайте файл с переменными окружения

Создайте файл `.env.local` (для разработки) или `.env.production` (для продакшена) в папке `focus-app`:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyDZFbSEB3diDEbksJ1yoKYR7PItcy9yHRM
REACT_APP_FIREBASE_AUTH_DOMAIN=focus-minimal.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=focus-minimal
REACT_APP_FIREBASE_STORAGE_BUCKET=focus-minimal.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=934428312093
REACT_APP_FIREBASE_APP_ID=1:934428312093:web:6f138087402b576329fcf4

# Security Settings
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_MAX_TASKS_PER_USER=1000
REACT_APP_MAX_PROJECTS_PER_USER=50
REACT_APP_MAX_TAGS_PER_USER=100
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_DEBUG_MODE=false

# Feature Flags
REACT_APP_ENABLE_FILE_UPLOAD=true
REACT_APP_ENABLE_ARCHIVE=true
REACT_APP_ENABLE_EXPORT=true
```

### Шаг 2: Обновите файлы на сервере

#### Вариант A: Через Git (рекомендуется)
```bash
# На сервере
cd /path/to/your/focus-app
git pull origin main
```

#### Вариант B: Ручное обновление файлов
Скопируйте обновленные файлы:
- `src/App.js`
- `src/components/DataManager.tsx`
- `src/components/TaskManager.tsx`

### Шаг 3: Установите зависимости (если нужно)
```bash
npm install
```

### Шаг 4: Соберите приложение
```bash
npm run build
```

### Шаг 5: Перезапустите сервер

#### Для PM2:
```bash
pm2 restart focus-app
# или
pm2 restart all
```

#### Для systemd:
```bash
sudo systemctl restart focus-app
```

#### Для Docker:
```bash
docker-compose down
docker-compose up -d
```

#### Для nginx + статических файлов:
```bash
# Просто перезагрузите страницу в браузере
# или перезапустите nginx
sudo systemctl reload nginx
```

## 🔍 Проверка обновления

### 1. **Проверьте консоль браузера**
- Откройте DevTools (F12)
- Перейдите на вкладку Console
- Убедитесь, что нет ошибок Firebase

### 2. **Проверьте индикатор синхронизации**
- В заголовке должно появиться "Синхронизировано" или "Синхронизация..."
- Должно отображаться время последней синхронизации

### 3. **Протестируйте синхронизацию**
- Создайте задачу на одном устройстве
- Проверьте, что она появилась на другом устройстве

## 🛠️ Устранение проблем

### Проблема: "Firebase configuration is missing"
**Решение:**
1. Убедитесь, что файл `.env.local` создан в правильной папке
2. Проверьте, что переменные окружения начинаются с `REACT_APP_`
3. Перезапустите приложение

### Проблема: "Module not found"
**Решение:**
```bash
npm install
npm run build
```

### Проблема: Приложение не запускается
**Решение:**
```bash
# Проверьте логи
pm2 logs focus-app
# или
sudo journalctl -u focus-app -f
```

### Проблема: Синхронизация не работает
**Решение:**
1. Проверьте Firebase Security Rules
2. Убедитесь, что пользователь авторизован
3. Проверьте подключение к интернету

## 📱 Firebase Security Rules

Убедитесь, что в Firebase Console настроены правильные правила:

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

## ✅ Чек-лист обновления

- [ ] Создан файл `.env.local` с Firebase конфигурацией
- [ ] Обновлены файлы `App.js`, `DataManager.tsx`, `TaskManager.tsx`
- [ ] Установлены зависимости (`npm install`)
- [ ] Собрано приложение (`npm run build`)
- [ ] Перезапущен сервер
- [ ] Проверена работа синхронизации
- [ ] Настроены Firebase Security Rules

---

**После выполнения всех шагов облачная синхронизация будет работать! 🎉**
