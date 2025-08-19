#!/bin/bash

# Автоматический скрипт развертывания Focus App на сервер
# Автор: AI Assistant
# Дата: $(date)

set -e  # Остановка при ошибке

# Конфигурация сервера
SERVER_IP="80.87.103.151"
SERVER_USER="focus"
SERVER_PATH="/home/focus/focus-app/frontend"
LOCAL_PATH="./"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка подключения к серверу
check_connection() {
    log_info "Проверка подключения к серверу..."
    if ssh -o ConnectTimeout=10 -o BatchMode=yes ${SERVER_USER}@${SERVER_IP} "echo 'Connection successful'" 2>/dev/null; then
        log_success "Подключение к серверу установлено"
    else
        log_error "Не удалось подключиться к серверу. Проверьте:"
        log_error "1. IP адрес: ${SERVER_IP}"
        log_error "2. Логин: ${SERVER_USER}"
        log_error "3. SSH ключи или пароль"
        exit 1
    fi
}

# Создание резервной копии на сервере
create_backup() {
    log_info "Создание резервной копии на сервере..."
    ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
        cd /home/focus/focus-app/frontend
        if [ -d "src" ]; then
            BACKUP_DIR="/home/focus/backups/frontend-$(date +%Y%m%d-%H%M%S)"
            mkdir -p /home/focus/backups
            cp -r src "$BACKUP_DIR"
            echo "Резервная копия создана: $BACKUP_DIR"
        fi
EOF
    log_success "Резервная копия создана"
}

# Копирование файлов на сервер
copy_files() {
    log_info "Копирование файлов на сервер..."
    
    # Создаем временную папку для файлов
    TEMP_DIR=$(mktemp -d)
    
    # Копируем необходимые файлы
    cp src/FocusMinimal.tsx "$TEMP_DIR/"
    cp src/App.js "$TEMP_DIR/"
    cp src/firebase.ts "$TEMP_DIR/"
    cp .env.local "$TEMP_DIR/"
    cp package.json "$TEMP_DIR/"
    
    # Копируем на сервер
    scp -r "$TEMP_DIR"/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
    
    # Очищаем временную папку
    rm -rf "$TEMP_DIR"
    
    log_success "Файлы скопированы на сервер"
}

# Обновление зависимостей
update_dependencies() {
    log_info "Обновление зависимостей на сервере..."
    ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
        cd /home/focus/focus-app/frontend
        
        # Останавливаем текущий процесс если запущен
        if pgrep -f "npm start" > /dev/null; then
            pkill -f "npm start"
            sleep 2
        fi
        
        # Устанавливаем зависимости
        echo "Установка зависимостей..."
        npm install
        
        # Проверяем что все установилось
        if [ $? -eq 0 ]; then
            echo "Зависимости установлены успешно"
        else
            echo "Ошибка установки зависимостей"
            exit 1
        fi
EOF
    log_success "Зависимости обновлены"
}

# Сборка приложения
build_app() {
    log_info "Сборка приложения на сервере..."
    ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
        cd /home/focus/focus-app/frontend
        
        echo "Сборка приложения..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "Приложение собрано успешно"
        else
            echo "Ошибка сборки приложения"
            exit 1
        fi
EOF
    log_success "Приложение собрано"
}

# Запуск приложения
start_app() {
    log_info "Запуск приложения на сервере..."
    ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
        cd /home/focus/focus-app/frontend
        
        # Проверяем что dist папка существует
        if [ ! -d "dist" ]; then
            echo "Папка dist не найдена. Сборка не удалась."
            exit 1
        fi
        
        # Запускаем preview сервер
        echo "Запуск preview сервера..."
        nohup npm run preview -- --host 0.0.0.0 --port 3000 > server.log 2>&1 &
        
        # Ждем немного и проверяем что сервер запустился
        sleep 3
        if pgrep -f "vite preview" > /dev/null; then
            echo "Сервер запущен успешно"
        else
            echo "Ошибка запуска сервера"
            exit 1
        fi
EOF
    log_success "Приложение запущено"
}

# Проверка статуса
check_status() {
    log_info "Проверка статуса приложения..."
    ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
        echo "=== Статус процессов ==="
        ps aux | grep -E "(vite|node)" | grep -v grep
        
        echo ""
        echo "=== Порт 3000 ==="
        netstat -tlnp | grep :3000 || echo "Порт 3000 не слушается"
        
        echo ""
        echo "=== Логи сервера ==="
        if [ -f "/home/focus/focus-app/frontend/server.log" ]; then
            tail -10 /home/focus/focus-app/frontend/server.log
        else
            echo "Файл логов не найден"
        fi
EOF
}

# Основная функция
main() {
    echo "🚀 Автоматическое развертывание Focus App на сервер"
    echo "=================================================="
    echo "Сервер: ${SERVER_USER}@${SERVER_IP}"
    echo "Путь: ${SERVER_PATH}"
    echo "=================================================="
    
    # Проверяем что мы в правильной папке
    if [ ! -f "package.json" ] || [ ! -f "src/FocusMinimal.tsx" ]; then
        log_error "Скрипт должен запускаться из папки focus-app"
        exit 1
    fi
    
    # Выполняем этапы развертывания
    check_connection
    create_backup
    copy_files
    update_dependencies
    build_app
    start_app
    check_status
    
    echo ""
    echo "🎉 Развертывание завершено!"
    echo "🌐 Приложение доступно по адресу: http://${SERVER_IP}:3000"
    echo ""
    echo "📋 Что было сделано:"
    echo "✅ Создана резервная копия"
    echo "✅ Файлы скопированы на сервер"
    echo "✅ Зависимости обновлены"
    echo "✅ Приложение собрано"
    echo "✅ Сервер запущен"
    echo ""
    echo "🔍 Для проверки логов: ssh ${SERVER_USER}@${SERVER_IP} 'tail -f /home/focus/focus-app/frontend/server.log'"
}

# Запуск основной функции
main "$@"
