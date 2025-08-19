# Главный скрипт для автоматизации рабочего процесса
# Использование: .\scripts\workflow.ps1 [действие]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "check", "backup", "end", "help")]
    [string]$Action
)

function Show-Help {
    Write-Host "🛠️  Автоматизированный рабочий процесс Focus App" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Доступные действия:" -ForegroundColor Yellow
    Write-Host "  start   - Начало рабочего дня (проверка + бэкап)" -ForegroundColor Gray
    Write-Host "  check   - Проверка статуса проекта" -ForegroundColor Gray
    Write-Host "  backup  - Создание бэкапа перед изменениями" -ForegroundColor Gray
    Write-Host "  end     - Завершение рабочего дня" -ForegroundColor Gray
    Write-Host "  help    - Показать эту справку" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Примеры использования:" -ForegroundColor Yellow
    Write-Host "  .\scripts\workflow.ps1 start" -ForegroundColor Gray
    Write-Host "  .\scripts\workflow.ps1 backup 'new-feature'" -ForegroundColor Gray
    Write-Host "  .\scripts\workflow.ps1 end" -ForegroundColor Gray
}

function Start-WorkDay {
    Write-Host "🌅 Начало рабочего дня" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    
    # 1. Проверяем статус проекта
    Write-Host "`n🔍 Проверка статуса проекта..." -ForegroundColor Green
    & "$PSScriptRoot\daily-check.ps1"
    
    # 2. Создаем бэкап текущего состояния
    Write-Host "`n💾 Создание бэкапа текущего состояния..." -ForegroundColor Green
    & "$PSScriptRoot\auto-backup.ps1" "start-of-day"
    
    # 3. Проверяем задачи на сегодня
    if (Test-Path "TOMORROW_TASKS.md") {
        Write-Host "`n📋 Задачи на сегодня:" -ForegroundColor Green
        Get-Content "TOMORROW_TASKS.md" | Select-Object -First 20 | ForEach-Object {
            Write-Host "   $_" -ForegroundColor Gray
        }
        Write-Host "   ..." -ForegroundColor Gray
    }
    
    Write-Host "`n🎯 Готово к работе! Можете начинать разработку." -ForegroundColor Green
    Write-Host "   Для создания бэкапа перед изменениями: .\scripts\workflow.ps1 backup 'описание'" -ForegroundColor Yellow
}

function New-Backup {
    param([string]$Description = "changes")
    
    Write-Host "💾 Создание бэкапа перед изменениями" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    
    & "$PSScriptRoot\auto-backup.ps1" $Description
}

function End-WorkDay {
    Write-Host "🌅 Завершение рабочего дня" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    
    & "$PSScriptRoot\end-of-day.ps1"
}

# Основная логика
switch ($Action) {
    "start" { Start-WorkDay }
    "check" { & "$PSScriptRoot\daily-check.ps1" }
    "backup" { 
        $Description = $args[0]
        if (-not $Description) {
            $Description = Read-Host "Введите описание бэкапа"
        }
        New-Backup $Description 
    }
    "end" { End-WorkDay }
    "help" { Show-Help }
    default { 
        Write-Host "Unknown action: $Action" -ForegroundColor Red
        Show-Help
    }
}
