# Скрипт для создания бэкапов проекта Focus App
# Использование: .\scripts\backup.ps1 [тип_бэкапа] [описание]

param(
    [string]$BackupType = "auto",
    [string]$Description = ""
)

# Получаем текущую дату
$Date = Get-Date -Format "yyyy-MM-dd-HHmm"
$CurrentDir = Get-Location
$ProjectName = "focus-app"

# Определяем имя бэкапа
if ($BackupType -eq "manual") {
    if ($Description -eq "") {
        Write-Host "Для ручного бэкапа необходимо указать описание" -ForegroundColor Red
        Write-Host "Пример: .\scripts\backup.ps1 manual 'before-refactoring'" -ForegroundColor Yellow
        exit 1
    }
    $BackupName = "$ProjectName-manual-backup-$Description-$Date"
} else {
    # Читаем версию из VERSION.md
    $VersionFile = "VERSION.md"
    if (Test-Path $VersionFile) {
        $VersionContent = Get-Content $VersionFile -Raw
        if ($VersionContent -match "Текущая версия: v(\d+\.\d+\.\d+)") {
            $Version = $matches[1]
        } else {
            $Version = "unknown"
        }
    } else {
        $Version = "unknown"
    }
    $BackupName = "$ProjectName-backup-v$Version-$Date"
}

# Путь для бэкапа
$BackupPath = "..\backups\$BackupName"

# Проверяем существование папки backups
if (-not (Test-Path "..\backups")) {
    New-Item -ItemType Directory -Path "..\backups" | Out-Null
    Write-Host "Создана папка backups" -ForegroundColor Green
}

# Создаем бэкап
Write-Host "Создание бэкапа: $BackupName" -ForegroundColor Yellow

# Копируем файлы проекта
Copy-Item -Path "." -Destination $BackupPath -Recurse -Exclude @("node_modules", ".git", "build", "dist", "*.log")

# Создаем файл с информацией о бэкапе
$BackupInfo = @"
# Информация о бэкапе

**Имя бэкапа:** $BackupName
**Дата создания:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Тип бэкапа:** $BackupType
**Описание:** $Description

## Содержимое бэкапа
- Исходный код проекта
- Конфигурационные файлы
- Документация

## Исключено
- node_modules (зависимости)
- .git (система контроля версий)
- build/dist (собранные файлы)
- *.log (логи)

## Восстановление
1. Скопировать папку бэкапа
2. Переименовать в '$ProjectName'
3. Выполнить: npm install
4. Запустить: npm start
"@

$BackupInfo | Out-File -FilePath "$BackupPath\BACKUP_INFO.md" -Encoding UTF8

Write-Host "Бэкап создан успешно: $BackupPath" -ForegroundColor Green
Write-Host "Размер бэкапа: $((Get-ChildItem $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB) MB" -ForegroundColor Cyan

# Обновляем VERSION.md если это автоматический бэкап
if ($BackupType -eq "auto") {
    Write-Host "Бэкап записан в VERSION.md" -ForegroundColor Cyan
}

