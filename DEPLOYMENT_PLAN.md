# 🚀 План развертывания Focus Minimal на сервер

## 📋 Что нужно от вас

### 1. **VPS сервер** 
- **Минимум**: 1 CPU, 1GB RAM, 20GB SSD
- **Рекомендуется**: 2 CPU, 2GB RAM, 40GB SSD
- **Провайдеры**: DigitalOcean, Vultr, Linode, Hetzner, AWS Lightsail

### 2. **Домен** (опционально, но рекомендуется)
- Купить домен (например, `yourdomain.com`)
- Настроить DNS записи на ваш сервер

### 3. **SSH доступ к серверу**
- Публичный ключ для безопасного подключения

## 🔧 Подготовка сервера

### Шаг 1: Создание VPS
```bash
# Выберите провайдера и создайте VPS с Ubuntu 22.04 LTS
# Получите IP адрес сервера
```

### Шаг 2: Подключение к серверу
```bash
ssh root@YOUR_SERVER_IP
```

### Шаг 3: Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### Шаг 4: Установка необходимого ПО
```bash
# Nginx (веб-сервер)
sudo apt install nginx -y

# Node.js (для сборки)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Certbot (для SSL сертификатов)
sudo apt install certbot python3-certbot-nginx -y

# UFW (файрвол)
sudo apt install ufw -y
```

## 🌐 Настройка веб-сервера

### Шаг 1: Создание конфигурации Nginx
```bash
sudo nano /etc/nginx/sites-available/focus-minimal
```

Содержимое файла:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    root /var/www/focus-minimal;
    index index.html;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA роутинг
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Шаг 2: Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/focus-minimal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 Настройка SSL (HTTPS)

### Шаг 1: Получение SSL сертификата
```bash
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

### Шаг 2: Автоматическое обновление
```bash
sudo crontab -e
# Добавить строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛡️ Настройка безопасности

### Шаг 1: Настройка файрвола
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Шаг 2: Настройка Fail2ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📦 Развертывание приложения

### Шаг 1: Создание директории
```bash
sudo mkdir -p /var/www/focus-minimal
sudo chown -R $USER:$USER /var/www/focus-minimal
```

### Шаг 2: Клонирование/копирование кода
```bash
# Вариант 1: Git (если есть репозиторий)
git clone https://github.com/yourusername/focus-minimal.git /var/www/focus-minimal

# Вариант 2: SCP (если нет репозитория)
scp -r ./build/* root@YOUR_SERVER_IP:/var/www/focus-minimal/
```

### Шаг 3: Сборка на сервере
```bash
cd /var/www/focus-minimal
npm install
npm run build
```

### Шаг 4: Настройка прав
```bash
sudo chown -R www-data:www-data /var/www/focus-minimal
sudo chmod -R 755 /var/www/focus-minimal
```

## 🔄 Автоматизация развертывания

### Создание скрипта развертывания
```bash
nano deploy.sh
```

Содержимое скрипта (см. файл `scripts/deploy.sh` выше)

### Настройка прав на выполнение
```bash
chmod +x deploy.sh
```

## 📊 Мониторинг

### Шаг 1: Настройка логирования
```bash
# Просмотр логов Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Просмотр логов системы
sudo journalctl -u nginx -f
```

### Шаг 2: Мониторинг ресурсов
```bash
# Установка htop для мониторинга
sudo apt install htop -y
htop
```

## 🚨 Резервное копирование

### Создание скрипта бэкапа
```bash
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/focus-minimal"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/focus-minimal_$DATE.tar.gz /var/www/focus-minimal
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 📝 Чек-лист развертывания

- [ ] VPS создан и настроен
- [ ] Домен настроен (если используется)
- [ ] Nginx установлен и настроен
- [ ] SSL сертификат получен
- [ ] Файрвол настроен
- [ ] Приложение развернуто
- [ ] Права доступа настроены
- [ ] Тестирование завершено
- [ ] Мониторинг настроен
- [ ] Бэкапы настроены

## 🆘 Устранение неполадок

### Проблема: Приложение не загружается
```bash
# Проверка статуса Nginx
sudo systemctl status nginx

# Проверка конфигурации
sudo nginx -t

# Проверка логов
sudo tail -f /var/log/nginx/error.log
```

### Проблема: SSL не работает
```bash
# Проверка сертификата
sudo certbot certificates

# Обновление сертификата
sudo certbot renew
```

### Проблема: Медленная загрузка
```bash
# Проверка ресурсов
htop

# Оптимизация Nginx
sudo nano /etc/nginx/nginx.conf
```

## 📞 Поддержка

Если возникнут проблемы:
1. Проверьте логи: `sudo tail -f /var/log/nginx/error.log`
2. Проверьте статус сервисов: `sudo systemctl status nginx`
3. Проверьте конфигурацию: `sudo nginx -t`

## 🎯 Следующие шаги

1. **Выберите провайдера VPS** и создайте сервер
2. **Купите домен** (если планируете использовать)
3. **Выполните шаги** из плана по порядку
4. **Протестируйте** приложение после развертывания
5. **Настройте мониторинг** и бэкапы

**Готовы начать?** 🚀


