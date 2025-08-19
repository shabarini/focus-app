# ⚡ Быстрое обновление на сервере

## 🚀 Автоматическое обновление (рекомендуется)

```bash
# Сделайте скрипт исполняемым и запустите
chmod +x update-server.sh
./update-server.sh
```

## 🔧 Ручное обновление по типам серверов

### PM2 (Node.js приложения)
```bash
# 1. Создайте .env.local
cat > .env.local << 'EOF'
REACT_APP_FIREBASE_API_KEY=AIzaSyDZFbSEB3diDEbksJ1yoKYR7PItcy9yHRM
REACT_APP_FIREBASE_AUTH_DOMAIN=focus-minimal.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=focus-minimal
REACT_APP_FIREBASE_STORAGE_BUCKET=focus-minimal.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=934428312093
REACT_APP_FIREBASE_APP_ID=1:934428312093:web:6f138087402b576329fcf4
EOF

# 2. Установите зависимости и соберите
npm install && npm run build

# 3. Перезапустите PM2
pm2 restart focus-app
```

### Systemd (Linux сервисы)
```bash
# 1. Создайте .env.local (как выше)
# 2. Установите зависимости и соберите (как выше)

# 3. Перезапустите сервис
sudo systemctl restart focus-app
```

### Docker
```bash
# 1. Создайте .env.local (как выше)
# 2. Пересоберите и перезапустите контейнеры
docker-compose down
docker-compose build
docker-compose up -d
```

### Nginx + статические файлы
```bash
# 1. Создайте .env.local (как выше)
# 2. Установите зависимости и соберите (как выше)

# 3. Скопируйте файлы в папку nginx
sudo cp -r build/* /var/www/html/

# 4. Перезагрузите nginx
sudo systemctl reload nginx
```

### Vercel/Netlify
```bash
# 1. Добавьте переменные окружения в настройках проекта
# 2. Перезапустите деплой
vercel --prod
# или
netlify deploy --prod
```

## 🔍 Проверка после обновления

### 1. Проверьте консоль браузера (F12 → Console)
```javascript
// Должно быть без ошибок Firebase
```

### 2. Проверьте индикатор синхронизации
- В заголовке должно быть "Синхронизировано" или "Синхронизация..."

### 3. Протестируйте синхронизацию
- Создайте задачу на одном устройстве
- Проверьте, что она появилась на другом

## 🛠️ Устранение проблем

### Ошибка: "Firebase configuration is missing"
```bash
# Проверьте, что .env.local создан в корне проекта
ls -la .env.local
```

### Ошибка: "Module not found"
```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Приложение не запускается
```bash
# Проверьте логи
pm2 logs focus-app
# или
sudo journalctl -u focus-app -f
```

## 📱 Firebase Security Rules

Убедитесь, что в Firebase Console настроены правила:

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

---

**Выберите команды для вашего типа сервера и выполните их по порядку! 🎉**
