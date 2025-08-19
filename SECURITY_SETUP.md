# 🔒 НАСТРОЙКА БЕЗОПАСНОСТИ ДЛЯ СЕРВЕРА

## 🚨 **КРИТИЧЕСКИ ВАЖНО: Первые шаги**

### **1. Создание файла с переменными окружения**

Создайте файл `.env.local` в корне проекта:

```bash
# В папке focus-app
cp env.example .env.local
```

Заполните `.env.local` реальными значениями из вашего Firebase проекта:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDZFbSEB3diDEbksJ1yoKYR7PItcy9yHRM
REACT_APP_FIREBASE_AUTH_DOMAIN=focus-minimal.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=focus-minimal
REACT_APP_FIREBASE_STORAGE_BUCKET=focus-minimal.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=934428312093
REACT_APP_FIREBASE_APP_ID=1:934428312093:web:6f138087402b576329fcf4
```

### **2. Проверка .gitignore**

Убедитесь, что в `.gitignore` есть строки:

```gitignore
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🌐 **Настройка веб-сервера**

### **Nginx конфигурация**

Создайте файл `/etc/nginx/sites-available/focus-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL сертификаты
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Безопасные заголовки
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    root /var/www/focus-app/build;
    index index.html;
    
    # Основные файлы
    location / {
        try_files $uri $uri/ /index.html;
        
        # Кэширование статических файлов
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API ограничения
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        return 404; # У вас нет API endpoints
    }
    
    # Запрет доступа к скрытым файлам
    location ~ /\. {
        deny all;
    }
    
    # Запрет доступа к файлам конфигурации
    location ~ \.(env|config|ini|log)$ {
        deny all;
    }
}
```

### **Активация конфигурации**

```bash
# Создать символическую ссылку
sudo ln -s /etc/nginx/sites-available/focus-app /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

## 🔐 **SSL сертификаты**

### **Let's Encrypt (бесплатно)**

```bash
# Установка Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛡️ **Дополнительные меры безопасности**

### **1. Настройка файрвола**

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Или iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP
```

### **2. Обновление системы**

```bash
# Регулярные обновления
sudo apt update && sudo apt upgrade -y

# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### **3. Мониторинг безопасности**

```bash
# Установка fail2ban
sudo apt install fail2ban

# Конфигурация
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 **Проверка безопасности**

### **1. Тестирование SSL**

```bash
# Проверка SSL конфигурации
curl -I https://your-domain.com

# Онлайн проверка
# https://www.ssllabs.com/ssltest/
```

### **2. Проверка заголовков**

```bash
# Проверка безопасности заголовков
curl -I https://your-domain.com | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Content-Security-Policy)"
```

### **3. Сканирование уязвимостей**

```bash
# Установка nmap
sudo apt install nmap

# Сканирование портов
nmap -sS -sV -O your-domain.com
```

## 🔄 **Автоматизация развертывания**

### **Скрипт развертывания**

Создайте файл `deploy.sh`:

```bash
#!/bin/bash

# Остановка приложения
echo "🛑 Остановка приложения..."
sudo systemctl stop focus-app

# Обновление кода
echo "📥 Обновление кода..."
git pull origin main

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

# Сборка приложения
echo "🔨 Сборка приложения..."
npm run build

# Копирование файлов
echo "📁 Копирование файлов..."
sudo cp -r build/* /var/www/focus-app/

# Установка прав доступа
echo "🔐 Установка прав доступа..."
sudo chown -R www-data:www-data /var/www/focus-app
sudo chmod -R 755 /var/www/focus-app

# Перезапуск сервисов
echo "🔄 Перезапуск сервисов..."
sudo systemctl restart nginx
sudo systemctl start focus-app

echo "✅ Развертывание завершено!"
```

### **Systemd сервис**

Создайте файл `/etc/systemd/system/focus-app.service`:

```ini
[Unit]
Description=Focus App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/focus-app
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 📋 **Чек-лист безопасности**

- [ ] ✅ Создан файл `.env.local` с реальными ключами
- [ ] ✅ `.env.local` добавлен в `.gitignore`
- [ ] ✅ Настроен HTTPS с SSL сертификатом
- [ ] ✅ Установлены безопасные HTTP заголовки
- [ ] ✅ Настроен файрвол
- [ ] ✅ Включены автоматические обновления
- [ ] ✅ Установлен fail2ban
- [ ] ✅ Настроен rate limiting
- [ ] ✅ Проверены права доступа к файлам
- [ ] ✅ Настроен мониторинг

## 🆘 **Аварийное восстановление**

### **Резервное копирование**

```bash
# Создание бэкапа
sudo tar -czf /backup/focus-app-$(date +%Y%m%d).tar.gz /var/www/focus-app

# Восстановление
sudo tar -xzf /backup/focus-app-20250817.tar.gz -C /
```

### **Восстановление после атаки**

1. Отключить сервер от сети
2. Проанализировать логи
3. Восстановить из чистого бэкапа
4. Обновить все пароли и ключи
5. Проверить целостность системы

---

**⚠️ ВАЖНО**: Этот документ содержит базовые настройки безопасности. Для продакшена рекомендуется дополнительная настройка в зависимости от требований.

