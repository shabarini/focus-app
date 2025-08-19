# Скрипт для восстановления проекта из бэкапа
# Использование: .\scripts\restore.ps1 [имя_бэкапа]

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupName
)

# Путь к папке бэкапов
$BackupsPath = "..\backups"
$BackupPath = "$BackupsPath\$BackupName"

# Проверяем существование бэкапа
if (-not (Test-Path $BackupPath)) {
    Write-Host "Бэкап '$BackupName' не найден!" -ForegroundColor Red
    Write-Host "Доступные бэкапы:" -ForegroundColor Yellow
    
    if (Test-Path $BackupsPath) {
        Get-ChildItem $BackupsPath -Directory | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  Папка бэкапов не найдена" -ForegroundColor Red
    }
    exit 1
}

# Подтверждение восстановления
Write-Host "ВНИМАНИЕ: Восстановление из бэкапа перезапишет текущие файлы!" -ForegroundColor Red
Write-Host "Бэкап: $BackupName" -ForegroundColor Yellow
$Confirm = Read-Host "Продолжить? (y/N)"

if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "Восстановление отменено" -ForegroundColor Yellow
    exit 0
}

# Останавливаем сервер разработки если запущен
Write-Host "Остановка сервера разработки..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Создаем бэкап текущего состояния
$CurrentDate = Get-Date -Format "yyyy-MM-dd-HHmm"
$CurrentBackup = "focus-app-current-state-$CurrentDate"
Write-Host "Создание бэкапа текущего состояния: $CurrentBackup" -ForegroundColor Yellow

Copy-Item -Path "." -Destination "$BackupsPath\$CurrentBackup" -Recurse -Exclude @("node_modules", ".git", "build", "dist", "*.log")

# Удаляем текущие файлы (кроме node_modules и .git)
Write-Host "Удаление текущих файлов..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Exclude @("node_modules", ".git", "backups") | Remove-Item -Recurse -Force

# Копируем файлы из бэкапа
Write-Host "Восстановление файлов из бэкапа..." -ForegroundColor Yellow
Copy-Item -Path "$BackupPath\*" -Destination "." -Recurse -Force

# Устанавливаем зависимости
Write-Host "Установка зависимостей..." -ForegroundColor Yellow
npm install

Write-Host "Восстановление завершено успешно!" -ForegroundColor Green
Write-Host "Текущее состояние сохранено в: $CurrentBackup" -ForegroundColor Cyan
Write-Host "Для запуска выполните: npm start" -ForegroundColor Yellow

