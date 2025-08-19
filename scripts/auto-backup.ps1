# Скрипт для автоматического создания бэкапа перед изменениями
# Использование: .\scripts\auto-backup.ps1 [описание]

param(
    [string]$Description = "auto-backup"
)

Write-Host "🤖 Автоматическое создание бэкапа" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Проверяем, есть ли несохраненные изменения
Write-Host "`n📝 Проверка изменений..." -ForegroundColor Green
$RecentChanges = Get-ChildItem "." -Recurse -File -Exclude "node_modules" | 
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-1) }

if ($RecentChanges.Count -gt 0) {
    Write-Host "⚠️  Обнаружены недавние изменения:" -ForegroundColor Yellow
    foreach ($File in $RecentChanges | Select-Object -First 3) {
        $RelativePath = $File.FullName.Replace((Get-Location).Path + "\", "")
        Write-Host "   - $RelativePath" -ForegroundColor Gray
    }
    if ($RecentChanges.Count -gt 3) {
        Write-Host "   ... и еще $($RecentChanges.Count - 3) файлов" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ Нет недавних изменений" -ForegroundColor Green
}

# Создаем бэкап
$Date = Get-Date -Format "yyyy-MM-dd-HHmm"
$BackupName = "focus-app-auto-backup-$Description-$Date"
$BackupPath = "..\backups\$BackupName"

# Создаем папку backups если её нет
if (-not (Test-Path "..\backups")) {
    New-Item -ItemType Directory -Path "..\backups" | Out-Null
    Write-Host "`n📁 Создана папка backups" -ForegroundColor Green
}

Write-Host "`n💾 Создание бэкапа: $BackupName" -ForegroundColor Yellow

# Копируем файлы проекта
Copy-Item -Path "." -Destination $BackupPath -Recurse -Exclude @("node_modules", ".git", "build", "dist", "*.log")

# Создаем файл с информацией о бэкапе
$BackupInfo = @"
# Автоматический бэкап

**Имя бэкапа:** $BackupName
**Дата создания:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Тип:** Автоматический
**Описание:** $Description

## Причина создания
- Автоматический бэкап перед изменениями
- Количество измененных файлов: $($RecentChanges.Count)

## Измененные файлы
$($RecentChanges | ForEach-Object { 
    $RelativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
    "- $RelativePath ($($_.LastWriteTime.ToString('yyyy-MM-dd HH:mm')))"
} | Out-String)

## Восстановление
1. Скопировать папку бэкапа
2. Переименовать в 'focus-app'
3. Выполнить: npm install
4. Запустить: npm start
"@

$BackupInfo | Out-File -FilePath "$BackupPath\BACKUP_INFO.md" -Encoding UTF8

# Вычисляем размер бэкапа
$BackupSize = (Get-ChildItem $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "✅ Бэкап создан успешно!" -ForegroundColor Green
Write-Host "   Путь: $BackupPath" -ForegroundColor Gray
Write-Host "   Размер: $([math]::Round($BackupSize, 2)) MB" -ForegroundColor Gray
Write-Host "   Файлов: $($RecentChanges.Count)" -ForegroundColor Gray

# Обновляем CHANGELOG.md
Write-Host "`n📝 Обновление CHANGELOG.md..." -ForegroundColor Green
$ChangelogPath = "CHANGELOG.md"
if (Test-Path $ChangelogPath) {
    $ChangelogContent = Get-Content $ChangelogPath -Raw
    $NewEntry = @"

### Автоматический бэкап - $(Get-Date -Format "yyyy-MM-dd HH:mm")
- Создан бэкап: $BackupName
- Причина: $Description
- Измененных файлов: $($RecentChanges.Count)
"@
    
    # Добавляем запись после заголовка "Неопубликовано"
    $UpdatedContent = $ChangelogContent -replace "## \[Неопубликовано\] - 2024-08-17", "## [Неопубликовано] - 2024-08-17$NewEntry"
    $UpdatedContent | Out-File -FilePath $ChangelogPath -Encoding UTF8
    Write-Host "✅ CHANGELOG.md обновлен" -ForegroundColor Green
}

Write-Host "`n🎯 Готово к работе! Можете безопасно вносить изменения." -ForegroundColor Green


