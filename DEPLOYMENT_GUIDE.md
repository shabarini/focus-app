# 🚀 Руководство по развертыванию FOCUS Task Manager

## 📋 Подготовка к развертыванию

### 1. **Проверка безопасности**
- [ ] Обновлены все зависимости (`npm audit fix`)
- [ ] Настроены правила Firebase Security
- [ ] Проверены переменные окружения
- [ ] Протестирована валидация данных

### 2. **Сборка приложения**
```bash
npm run build
```

### 3. **Тестирование**
```bash
npm test
npm run build
```

## 🌐 Варианты развертывания

### **Вариант 1: Firebase Hosting (Рекомендуется)**

#### Установка Firebase CLI
```bash
npm install -g firebase-tools
```

#### Инициализация Firebase
```bash
firebase login
firebase init hosting
```

#### Настройка firebase.json
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### Развертывание
```bash
firebase deploy
```

### **Вариант 2: Vercel**

#### Установка Vercel CLI
```bash
npm install -g vercel
```

#### Развертывание
```bash
vercel --prod
```

### **Вариант 3: Netlify**

#### Через Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

#### Через веб-интерфейс
1. Загрузите папку `build` в Netlify
2. Настройте переменные окружения
3. Настройте редирект для SPA

### **Вариант 4: Собственный сервер**

#### Настройка Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/focus-app/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Настройка HTTPS с Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔒 Настройки безопасности для продакшена

### 1. **Переменные окружения**
Создайте файл `.env.production`:
```env
REACT_APP_FIREBASE_API_KEY=your_production_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
NODE_ENV=production
```

### 2. **Firebase Security Rules**
Обновите правила в консоли Firebase:
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

### 3. **CORS настройки**
В Firebase Functions (если используете):
```javascript
const cors = require('cors')({
  origin: ['https://your-domain.com', 'https://www.your-domain.com']
});
```

## 📊 Мониторинг и аналитика

### 1. **Firebase Analytics**
```javascript
// В src/firebase.ts
import { getAnalytics } from 'firebase/analytics';

const analytics = getAnalytics(app);
```

### 2. **Error Tracking**
```bash
npm install @sentry/react @sentry/tracing
```

### 3. **Performance Monitoring**
```javascript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

## 🚨 Чек-лист после развертывания

- [ ] Приложение доступно по HTTPS
- [ ] Аутентификация работает корректно
- [ ] Данные сохраняются в Firebase
- [ ] Загрузка файлов работает
- [ ] Все функции приложения работают
- [ ] Аналитика настроена
- [ ] Мониторинг ошибок активен
- [ ] Резервные копии настроены
- [ ] Домен настроен (если используется)
- [ ] SSL сертификат активен

## 🔧 Устранение неполадок

### Ошибка "Firebase: Error (auth/invalid-api-key)"
- Проверьте правильность API ключа в переменных окружения
- Убедитесь, что ключ не заблокирован в консоли Firebase

### Ошибка "Firebase: Error (permission-denied)"
- Проверьте правила безопасности в Firestore
- Убедитесь, что пользователь аутентифицирован

### Проблемы с CORS
- Настройте разрешенные домены в Firebase
- Проверьте настройки CORS в вашем сервере

### Проблемы с производительностью
- Включите кэширование статических файлов
- Оптимизируйте размер бандла
- Используйте CDN для статических ресурсов
