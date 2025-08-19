#!/bin/bash

# 🚀 Скрипт обновления FOCUS приложения на сервере
# Автор: AI Assistant
# Дата: $(date)

echo "🔄 Начинаем обновление FOCUS приложения..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ОШИБКА]${NC} $1"
}

success() {
    echo -e "${GREEN}[УСПЕХ]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ]${NC} $1"
}

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    error "Файл package.json не найден. Убедитесь, что вы находитесь в папке focus-app"
    exit 1
fi

# Шаг 1: Создание файла .env.local
log "Создаем файл .env.local с Firebase конфигурацией..."

cat > .env.local << 'EOF'
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
EOF

if [ $? -eq 0 ]; then
    success "Файл .env.local создан успешно"
else
    error "Ошибка при создании файла .env.local"
    exit 1
fi

# Шаг 2: Установка зависимостей
log "Устанавливаем зависимости..."
npm install

if [ $? -eq 0 ]; then
    success "Зависимости установлены успешно"
else
    error "Ошибка при установке зависимостей"
    exit 1
fi

# Шаг 3: Сборка приложения
log "Собираем приложение..."
npm run build

if [ $? -eq 0 ]; then
    success "Приложение собрано успешно"
else
    error "Ошибка при сборке приложения"
    exit 1
fi

# Шаг 4: Определение типа сервера и перезапуск
log "Определяем тип сервера..."

# Проверяем PM2
if command -v pm2 &> /dev/null; then
    log "Обнаружен PM2, перезапускаем приложение..."
    pm2 restart focus-app 2>/dev/null || pm2 restart all
    if [ $? -eq 0 ]; then
        success "PM2 перезапущен успешно"
    else
        warning "PM2 не найден или ошибка перезапуска"
    fi
fi

# Проверяем systemd
if systemctl is-active --quiet focus-app 2>/dev/null; then
    log "Обнаружен systemd сервис, перезапускаем..."
    sudo systemctl restart focus-app
    if [ $? -eq 0 ]; then
        success "Systemd сервис перезапущен успешно"
    else
        warning "Ошибка перезапуска systemd сервиса"
    fi
fi

# Проверяем Docker
if [ -f "docker-compose.yml" ]; then
    log "Обнаружен Docker Compose, перезапускаем контейнеры..."
    docker-compose down && docker-compose up -d
    if [ $? -eq 0 ]; then
        success "Docker контейнеры перезапущены успешно"
    else
        warning "Ошибка перезапуска Docker контейнеров"
    fi
fi

# Проверяем nginx
if command -v nginx &> /dev/null; then
    log "Обнаружен nginx, перезагружаем конфигурацию..."
    sudo systemctl reload nginx 2>/dev/null || sudo nginx -s reload
    if [ $? -eq 0 ]; then
        success "Nginx перезагружен успешно"
    else
        warning "Ошибка перезагрузки nginx"
    fi
fi

# Финальная проверка
log "Проверяем статус приложения..."

# Ждем немного для запуска
sleep 3

# Проверяем, что приложение отвечает (если есть URL)
if [ ! -z "$APP_URL" ]; then
    log "Проверяем доступность приложения по адресу: $APP_URL"
    if curl -s -o /dev/null -w "%{http_code}" "$APP_URL" | grep -q "200"; then
        success "Приложение доступно и работает!"
    else
        warning "Приложение может быть недоступно. Проверьте логи."
    fi
else
    log "Переменная APP_URL не установлена. Проверьте приложение вручную."
fi

echo ""
success "🎉 Обновление завершено!"
echo ""
echo "📋 Что было сделано:"
echo "✅ Создан файл .env.local с Firebase конфигурацией"
echo "✅ Установлены зависимости"
echo "✅ Собрано приложение"
echo "✅ Перезапущен сервер"
echo ""
echo "🔍 Для проверки:"
echo "1. Откройте приложение в браузере"
echo "2. Проверьте индикатор синхронизации в заголовке"
echo "3. Создайте задачу и проверьте синхронизацию"
echo ""
echo "📖 Дополнительная информация:"
echo "- Инструкция по настройке: SYNC_SETUP.md"
echo "- Логи PM2: pm2 logs focus-app"
echo "- Логи systemd: sudo journalctl -u focus-app -f"
