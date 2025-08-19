# Скрипт для ежедневной проверки статуса проекта
# Использование: .\scripts\daily-check.ps1

Write-Host "🔍 Ежедневная проверка статуса проекта Focus App" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Получаем текущую дату
$Date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Дата проверки: $Date" -ForegroundColor Yellow

# 1. Проверяем наличие package.json
Write-Host "`n📦 Проверка package.json..." -ForegroundColor Green
if (Test-Path "package.json") {
    Write-Host "✅ package.json найден" -ForegroundColor Green
    $PackageInfo = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "   Версия: $($PackageInfo.version)" -ForegroundColor Gray
    Write-Host "   Название: $($PackageInfo.name)" -ForegroundColor Gray
} else {
    Write-Host "❌ package.json не найден!" -ForegroundColor Red
    exit 1
}

# 2. Проверяем зависимости
Write-Host "`n📚 Проверка зависимостей..." -ForegroundColor Green
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules найден" -ForegroundColor Green
    $NodeModulesSize = (Get-ChildItem "node_modules" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Размер: $([math]::Round($NodeModulesSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "⚠️  node_modules не найден, выполните npm install" -ForegroundColor Yellow
}

# 3. Проверяем основные файлы проекта
Write-Host "`n📁 Проверка основных файлов..." -ForegroundColor Green
$RequiredFiles = @(
    "src/FocusMinimal.tsx",
    "src/components/TaskManager.tsx",
    "src/components/PWAStatus.tsx",
    "public/index.html",
    "CHANGELOG.md",
    "VERSION.md"
)

foreach ($File in $RequiredFiles) {
    if (Test-Path $File) {
        Write-Host "✅ $File" -ForegroundColor Green
    } else {
        Write-Host "❌ $File - НЕ НАЙДЕН!" -ForegroundColor Red
    }
}

# 4. Проверяем бэкапы
Write-Host "`n💾 Проверка бэкапов..." -ForegroundColor Green
if (Test-Path "..\backups") {
    $Backups = Get-ChildItem "..\backups" -Directory
    Write-Host "✅ Найдено бэкапов: $($Backups.Count)" -ForegroundColor Green
    
    if ($Backups.Count -gt 0) {
        $LatestBackup = $Backups | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        $DaysSinceLastBackup = (Get-Date) - $LatestBackup.LastWriteTime
        Write-Host "   Последний бэкап: $($LatestBackup.Name)" -ForegroundColor Gray
        Write-Host "   Создан: $($DaysSinceLastBackup.Days) дней назад" -ForegroundColor Gray
        
        if ($DaysSinceLastBackup.Days -gt 7) {
            Write-Host "⚠️  Рекомендуется создать новый бэкап" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ Папка бэкапов не найдена!" -ForegroundColor Red
}

# 5. Проверяем размер проекта
Write-Host "`n📊 Статистика проекта..." -ForegroundColor Green
$ProjectSize = (Get-ChildItem "." -Recurse -Exclude "node_modules" | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   Размер проекта: $([math]::Round($ProjectSize, 2)) MB" -ForegroundColor Gray

$FileCount = (Get-ChildItem "." -Recurse -File -Exclude "node_modules" | Measure-Object).Count
Write-Host "   Количество файлов: $FileCount" -ForegroundColor Gray

# 6. Проверяем последние изменения
Write-Host "`n📝 Последние изменения..." -ForegroundColor Green
$RecentFiles = Get-ChildItem "." -Recurse -File -Exclude "node_modules" | 
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 5

if ($RecentFiles.Count -gt 0) {
    Write-Host "   Файлы, измененные за последние 24 часа:" -ForegroundColor Gray
    foreach ($File in $RecentFiles) {
        $RelativePath = $File.FullName.Replace((Get-Location).Path + "\", "")
        Write-Host "   - $RelativePath ($($File.LastWriteTime.ToString('HH:mm')))" -ForegroundColor Gray
    }
} else {
    Write-Host "   Нет изменений за последние 24 часа" -ForegroundColor Gray
}

# 7. Рекомендации
Write-Host "`n💡 Рекомендации:" -ForegroundColor Cyan
$Recommendations = @()

if (-not (Test-Path "node_modules")) {
    $Recommendations += "Выполнить: npm install"
}

if ($Backups.Count -eq 0 -or $DaysSinceLastBackup.Days -gt 7) {
    $Recommendations += "Создать бэкап: .\scripts\simple-backup.ps1 'daily-check'"
}

if ($Recommendations.Count -gt 0) {
    foreach ($Rec in $Recommendations) {
        Write-Host "   • $Rec" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Все в порядке!" -ForegroundColor Green
}

Write-Host "`n✅ Проверка завершена" -ForegroundColor Green


