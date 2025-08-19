#!/bin/bash

# Быстрый скрипт развертывания Focus Minimal
# Использование: ./quick-deploy.sh SERVER_IP [DOMAIN]

if [ -z "$1" ]; then
    echo "❌ Укажите IP сервера: ./quick-deploy.sh YOUR_SERVER_IP [DOMAIN]"
    exit 1
fi

SERVER_IP=$1
DOMAIN=$2

echo "🚀 Быстрое развертывание Focus Minimal на $SERVER_IP"

# Сборка проекта
echo "📦 Собираем проект..."
npm run build

# Создание архива
echo "📦 Создаем архив..."
tar -czf focus-minimal.tar.gz -C build .

# Копирование на сервер
echo "📤 Копируем на сервер..."
scp focus-minimal.tar.gz root@$SERVER_IP:/tmp/

# Выполнение команд на сервере
echo "🔧 Развертываем..."
ssh root@$SERVER_IP << EOF
    # Установка необходимого ПО
    apt update -y
    apt install nginx -y
    
    # Создание директории
    mkdir -p /var/www/focus-minimal
    
    # Распаковка
    tar -xzf /tmp/focus-minimal.tar.gz -C /var/www/focus-minimal
    
    # Настройка прав
    chown -R www-data:www-data /var/www/focus-minimal
    chmod -R 755 /var/www/focus-minimal
    
    # Создание конфигурации Nginx
    cat > /etc/nginx/sites-available/focus-minimal << 'NGINX'
server {
    listen 80;
    server_name $DOMAIN $SERVER_IP;
    root /var/www/focus-minimal;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX
    
    # Активация сайта
    ln -sf /etc/nginx/sites-available/focus-minimal /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    
    # Очистка
    rm /tmp/focus-minimal.tar.gz
    
    echo "✅ Развертывание завершено!"
EOF

# Очистка локальных файлов
rm focus-minimal.tar.gz

echo "🎉 Приложение развернуто!"
echo "🌐 Доступно по адресу: http://$SERVER_IP"
if [ ! -z "$DOMAIN" ]; then
    echo "🌐 Или: http://$DOMAIN"
fi

