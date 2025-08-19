# Скрипт для автоматического завершения рабочего дня
# Использование: .\scripts\end-of-day.ps1

Write-Host "🌅 Завершение рабочего дня" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

$Date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Дата: $Date" -ForegroundColor Yellow

# 1. Проверяем изменения за день
Write-Host "`n📝 Анализ изменений за день..." -ForegroundColor Green
$TodayChanges = Get-ChildItem "." -Recurse -File -Exclude "node_modules" | 
    Where-Object { $_.LastWriteTime.Date -eq (Get-Date).Date } |
    Sort-Object LastWriteTime -Descending

if ($TodayChanges.Count -gt 0) {
    Write-Host "✅ Найдено изменений: $($TodayChanges.Count)" -ForegroundColor Green
    Write-Host "   Измененные файлы:" -ForegroundColor Gray
    
    $FileTypes = @{}
    foreach ($File in $TodayChanges) {
        $Extension = $File.Extension
        if ($FileTypes.ContainsKey($Extension)) {
            $FileTypes[$Extension]++
        } else {
            $FileTypes[$Extension] = 1
        }
        
        $RelativePath = $File.FullName.Replace((Get-Location).Path + "\", "")
        Write-Host "   - $RelativePath" -ForegroundColor Gray
    }
    
    Write-Host "`n   Статистика по типам файлов:" -ForegroundColor Gray
    foreach ($Type in $FileTypes.GetEnumerator() | Sort-Object Value -Descending) {
        Write-Host "   - $($Type.Key): $($Type.Value)" -ForegroundColor Gray
    }
} else {
    Write-Host "ℹ️  Нет изменений за сегодня" -ForegroundColor Yellow
}

# 2. Создаем финальный бэкап
Write-Host "`n💾 Создание финального бэкапа..." -ForegroundColor Green
$BackupDate = Get-Date -Format "yyyy-MM-dd-HHmm"
$BackupName = "focus-app-end-of-day-$BackupDate"
$BackupPath = "..\backups\$BackupName"

# Создаем папку backups если её нет
if (-not (Test-Path "..\backups")) {
    New-Item -ItemType Directory -Path "..\backups" | Out-Null
}

# Копируем файлы проекта
Copy-Item -Path "." -Destination $BackupPath -Recurse -Exclude @("node_modules", ".git", "build", "dist", "*.log")

# Создаем файл с информацией о бэкапе
$BackupInfo = @"
# Бэкап конца рабочего дня

**Имя бэкапа:** $BackupName
**Дата создания:** $Date
**Тип:** Конец рабочего дня

## Статистика дня
- Измененных файлов: $($TodayChanges.Count)
- Типы файлов: $($FileTypes.Keys -join ', ')

## Измененные файлы
$($TodayChanges | ForEach-Object { 
    $RelativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
    "- $RelativePath ($($_.LastWriteTime.ToString('HH:mm')))"
} | Out-String)

## Задачи на завтра
- [ ] Проверить работоспособность приложения
- [ ] Протестировать новые функции
- [ ] Обновить документацию при необходимости

## Восстановление
1. Скопировать папку бэкапа
2. Переименовать в 'focus-app'
3. Выполнить: npm install
4. Запустить: npm start
"@

$BackupInfo | Out-File -FilePath "$BackupPath\BACKUP_INFO.md" -Encoding UTF8

$BackupSize = (Get-ChildItem $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "✅ Бэкап создан: $BackupName ($([math]::Round($BackupSize, 2)) MB)" -ForegroundColor Green

# 3. Обновляем CHANGELOG.md
Write-Host "`n📝 Обновление CHANGELOG.md..." -ForegroundColor Green
$ChangelogPath = "CHANGELOG.md"
if (Test-Path $ChangelogPath) {
    $ChangelogContent = Get-Content $ChangelogPath -Raw
    $NewEntry = @"

### Конец рабочего дня - $(Get-Date -Format "yyyy-MM-dd HH:mm")
- Создан бэкап: $BackupName
- Измененных файлов: $($TodayChanges.Count)
- Типы файлов: $($FileTypes.Keys -join ', ')
"@
    
    # Добавляем запись после заголовка "Неопубликовано"
    $UpdatedContent = $ChangelogContent -replace "## \[Неопубликовано\] - 2024-08-17", "## [Неопубликовано] - 2024-08-17$NewEntry"
    $UpdatedContent | Out-File -FilePath $ChangelogPath -Encoding UTF8
    Write-Host "✅ CHANGELOG.md обновлен" -ForegroundColor Green
}

# 4. Создаем файл с задачами на завтра
Write-Host "`n📋 Создание задач на завтра..." -ForegroundColor Green
$TomorrowTasks = @"
# Задачи на завтра - $(Get-Date).AddDays(1).ToString('yyyy-MM-dd')

## Приоритетные задачи
- [ ] Проверить работоспособность приложения после изменений
- [ ] Протестировать новые функции
- [ ] Обновить документацию при необходимости

## Дополнительные задачи
- [ ] Оптимизировать производительность
- [ ] Добавить новые функции
- [ ] Исправить найденные баги

## Заметки
- Сегодня изменено файлов: $($TodayChanges.Count)
- Основные типы файлов: $($FileTypes.Keys -join ', ')
- Последний бэкап: $BackupName

## Команды для быстрого старта
```powershell
# Проверка статуса
.\scripts\daily-check.ps1

# Запуск приложения
npm start

# Создание бэкапа перед изменениями
.\scripts\auto-backup.ps1 "new-feature"
```
"@

$TomorrowTasksPath = "TOMORROW_TASKS.md"
$TomorrowTasks | Out-File -FilePath $TomorrowTasksPath -Encoding UTF8
Write-Host "✅ Создан файл задач: $TomorrowTasksPath" -ForegroundColor Green

# 5. Итоговая статистика
Write-Host "`n📊 Итоговая статистика дня:" -ForegroundColor Cyan
Write-Host "   Измененных файлов: $($TodayChanges.Count)" -ForegroundColor Gray
Write-Host "   Созданных бэкапов: 1" -ForegroundColor Gray
Write-Host "   Обновленных документов: 2 (CHANGELOG.md, TOMORROW_TASKS.md)" -ForegroundColor Gray

Write-Host "`n🎉 Рабочий день завершен! Хорошего отдыха! 🌙" -ForegroundColor Green
Write-Host "   Завтра начните с: .\scripts\daily-check.ps1" -ForegroundColor Yellow

