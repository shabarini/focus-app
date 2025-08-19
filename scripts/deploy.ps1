# PowerShell скрипт развертывания Focus Minimal
# Использование: .\deploy.ps1 -ServerIP "YOUR_SERVER_IP" [-Domain "yourdomain.com"]

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$Domain
)

Write-Host "🚀 Развертывание Focus Minimal на $ServerIP" -ForegroundColor Green

# Проверка наличия npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm не найден. Установите Node.js и npm." -ForegroundColor Red
    exit 1
}

# Сборка проекта
Write-Host "📦 Собираем проект..." -ForegroundColor Yellow
npm run build

if (-not (Test-Path "build")) {
    Write-Host "❌ Ошибка сборки. Папка build не найдена." -ForegroundColor Red
    exit 1
}

# Создание архива
Write-Host "📦 Создаем архив..." -ForegroundColor Yellow
if (Test-Path "focus-minimal.zip") {
    Remove-Item "focus-minimal.zip"
}

Compress-Archive -Path "build\*" -DestinationPath "focus-minimal.zip"

# Копирование на сервер
Write-Host "📤 Копируем на сервер..." -ForegroundColor Yellow
scp focus-minimal.zip root@${ServerIP}:/tmp/

# Выполнение команд на сервере
Write-Host "🔧 Развертываем на сервере..." -ForegroundColor Yellow

$nginxConfig = @"
server {
    listen 80;
    server_name $Domain $ServerIP;
    root /var/www/focus-minimal;
    index index.html;
    
    location / {
        try_files `$uri `$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
"@

$commands = @"
# Установка необходимого ПО
apt update -y
apt install nginx unzip -y

# Создание директории
mkdir -p /var/www/focus-minimal

# Распаковка
unzip -o /tmp/focus-minimal.zip -d /var/www/focus-minimal/

# Настройка прав
chown -R www-data:www-data /var/www/focus-minimal
chmod -R 755 /var/www/focus-minimal

# Создание конфигурации Nginx
echo '$nginxConfig' > /etc/nginx/sites-available/focus-minimal

# Активация сайта
ln -sf /etc/nginx/sites-available/focus-minimal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Очистка
rm /tmp/focus-minimal.zip

echo "✅ Развертывание завершено!"
"@

# Отправка команд на сервер
$commands | ssh root@${ServerIP} bash

# Очистка локальных файлов
Remove-Item "focus-minimal.zip"

Write-Host "🎉 Приложение развернуто!" -ForegroundColor Green
Write-Host "🌐 Доступно по адресу: http://$ServerIP" -ForegroundColor Cyan

if ($Domain) {
    Write-Host "🌐 Или: http://$Domain" -ForegroundColor Cyan
}

Write-Host "📊 Для проверки логов: ssh root@${ServerIP} 'tail -f /var/log/nginx/error.log'" -ForegroundColor Gray
