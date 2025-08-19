# Простой скрипт для создания бэкапов
param(
    [string]$Description = "backup"
)

$Date = Get-Date -Format "yyyy-MM-dd-HHmm"
$BackupName = "focus-app-backup-$Description-$Date"
$BackupPath = "..\backups\$BackupName"

# Создаем папку backups если её нет
if (-not (Test-Path "..\backups")) {
    New-Item -ItemType Directory -Path "..\backups" | Out-Null
    Write-Host "Создана папка backups" -ForegroundColor Green
}

Write-Host "Создание бэкапа: $BackupName" -ForegroundColor Yellow

# Копируем файлы
Copy-Item -Path "." -Destination $BackupPath -Recurse -Exclude @("node_modules", ".git", "build", "dist", "*.log")

Write-Host "Бэкап создан: $BackupPath" -ForegroundColor Green

