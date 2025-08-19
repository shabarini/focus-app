# 🔒 Безопасность сервера для FOCUS Task Manager

## 🎯 **Обзор безопасности**

Этот документ содержит рекомендации по обеспечению безопасности при развертывании FOCUS Task Manager на сервере.

## 🛡️ **Уровни безопасности**

### **1. Клиентская безопасность (Frontend)**
- ✅ Валидация данных на клиенте
- ✅ Санитизация пользовательского ввода
- ✅ Защита от XSS атак
- ✅ Ограничения на размер файлов
- ✅ Проверка типов файлов

### **2. Серверная безопасность (Backend)**
- ✅ Firebase Security Rules
- ✅ Аутентификация и авторизация
- ✅ Валидация данных на сервере
- ✅ Rate limiting
- ✅ Логирование безопасности

### **3. Инфраструктурная безопасность**
- ✅ HTTPS/TLS шифрование
- ✅ Безопасные заголовки HTTP
- ✅ Защита от DDoS атак
- ✅ Мониторинг безопасности

## 🔧 **Настройка безопасности**

### **Firebase Security Rules (Обязательно!)**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать и писать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.email_verified == true
        && request.resource.size < 1 * 1024 * 1024; // 1MB лимит
    }
    
    // Запрещаем доступ к системным коллекциям
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **Переменные окружения (.env)**

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
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_DEBUG_MODE=false
```

## 🌐 **HTTP заголовки безопасности**

### **Для Nginx:**
```nginx
# Безопасные заголовки
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;" always;

# HTTPS редирект
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}

# Защита от DDoS
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### **Для Apache:**
```apache
# Безопасные заголовки
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;"

# HTTPS редирект
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🔐 **SSL/TLS настройка**

### **Получение SSL сертификата:**
```bash
# Let's Encrypt (бесплатно)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Настройка SSL в Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Современные SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

## 🚨 **Мониторинг безопасности**

### **Логирование:**
```bash
# Мониторинг логов Nginx
tail -f /var/log/nginx/access.log | grep -E "(404|500|403)"

# Мониторинг подозрительной активности
grep -E "(script|javascript|iframe)" /var/log/nginx/access.log

# Мониторинг попыток взлома
grep -E "(admin|login|wp-admin)" /var/log/nginx/access.log
```

### **Алерты безопасности:**
```bash
# Скрипт для мониторинга
#!/bin/bash
# monitor_security.sh

LOG_FILE="/var/log/nginx/access.log"
ALERT_EMAIL="admin@yourdomain.com"

# Проверка подозрительных запросов
suspicious_requests=$(grep -c "script\|javascript\|iframe" $LOG_FILE)

if [ $suspicious_requests -gt 10 ]; then
    echo "ВНИМАНИЕ: Обнаружено $suspicious_requests подозрительных запросов" | mail -s "Security Alert" $ALERT_EMAIL
fi
```

## 🔍 **Проверка безопасности**

### **Автоматические проверки:**
```bash
# Проверка SSL
curl -I https://yourdomain.com

# Проверка заголовков безопасности
curl -I -s https://yourdomain.com | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)"

# Проверка уязвимостей
nmap --script ssl-enum-ciphers -p 443 yourdomain.com
```

### **Ручные проверки:**
1. **XSS тестирование**: Попробуйте вставить `<script>alert('test')</script>` в поля ввода
2. **CSRF тестирование**: Проверьте, что формы требуют аутентификации
3. **SQL Injection**: Проверьте поля поиска на уязвимости
4. **File Upload**: Попробуйте загрузить файлы с опасными расширениями

## 🛠️ **Инструменты безопасности**

### **Рекомендуемые инструменты:**
- **OWASP ZAP**: Автоматическое тестирование безопасности
- **Nmap**: Сканирование портов и сервисов
- **Lynis**: Аудит безопасности Linux
- **Fail2ban**: Защита от брутфорс атак

### **Установка Fail2ban:**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Конфигурация для Nginx
sudo nano /etc/fail2ban/jail.local

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
```

## 📊 **Метрики безопасности**

### **Что отслеживать:**
- Количество неудачных попыток входа
- Подозрительные запросы к API
- Попытки загрузки запрещенных файлов
- Аномальная активность пользователей
- Ошибки аутентификации

### **Дашборд безопасности:**
```javascript
// Пример метрик для Firebase Analytics
const securityMetrics = {
  failedLogins: 0,
  suspiciousRequests: 0,
  fileUploadAttempts: 0,
  xssAttempts: 0
};

// Отправка метрик
firebase.analytics().logEvent('security_event', securityMetrics);
```

## 🚀 **Чек-лист развертывания**

### **Перед развертыванием:**
- [ ] Настроены Firebase Security Rules
- [ ] Включен HTTPS
- [ ] Настроены безопасные заголовки HTTP
- [ ] Настроен файрвол
- [ ] Установлен Fail2ban
- [ ] Настроено логирование
- [ ] Проведено тестирование безопасности

### **После развертывания:**
- [ ] Проверена работа HTTPS
- [ ] Проверены заголовки безопасности
- [ ] Протестированы основные функции
- [ ] Настроен мониторинг
- [ ] Созданы резервные копии
- [ ] Документированы настройки

## 📞 **Поддержка безопасности**

### **В случае инцидента:**
1. **Немедленно**: Остановите подозрительную активность
2. **Анализ**: Изучите логи и определите источник
3. **Исправление**: Устраните уязвимость
4. **Уведомление**: Сообщите пользователям при необходимости
5. **Документирование**: Запишите инцидент и меры

### **Контакты для экстренных случаев:**
- **Техническая поддержка**: tech@yourdomain.com
- **Безопасность**: security@yourdomain.com
- **Администратор**: admin@yourdomain.com

---

**Важно**: Безопасность - это непрерывный процесс. Регулярно обновляйте зависимости, проверяйте логи и проводите аудит безопасности.

**Дата создания**: Август 2024  
**Версия**: 1.0.0
