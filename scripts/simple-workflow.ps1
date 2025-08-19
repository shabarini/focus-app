# Простой скрипт для автоматизации рабочего процесса
param(
    [string]$Action = "help"
)

function Show-Help {
    Write-Host "Automated Workflow for Focus App" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available actions:" -ForegroundColor Yellow
    Write-Host "  start   - Start work day (check + backup)" -ForegroundColor Gray
    Write-Host "  check   - Check project status" -ForegroundColor Gray
    Write-Host "  backup  - Create backup before changes" -ForegroundColor Gray
    Write-Host "  end     - End work day" -ForegroundColor Gray
    Write-Host "  help    - Show this help" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\scripts\simple-workflow.ps1 start" -ForegroundColor Gray
    Write-Host "  .\scripts\simple-workflow.ps1 backup new-feature" -ForegroundColor Gray
    Write-Host "  .\scripts\simple-workflow.ps1 end" -ForegroundColor Gray
}

function Start-WorkDay {
    Write-Host "Starting work day..." -ForegroundColor Green
    
    # Check project status
    Write-Host "Checking project status..." -ForegroundColor Yellow
    & "$PSScriptRoot\daily-check.ps1"
    
    # Create backup
    Write-Host "Creating backup..." -ForegroundColor Yellow
    & "$PSScriptRoot\simple-backup.ps1" "start-of-day"
    
    Write-Host "Ready to work!" -ForegroundColor Green
}

function New-Backup {
    param([string]$Description = "changes")
    Write-Host "Creating backup: $Description" -ForegroundColor Green
    & "$PSScriptRoot\simple-backup.ps1" $Description
}

function End-WorkDay {
    Write-Host "Ending work day..." -ForegroundColor Green
    & "$PSScriptRoot\end-of-day.ps1"
}

# Main logic
switch ($Action) {
    "start" { Start-WorkDay }
    "check" { & "$PSScriptRoot\daily-check.ps1" }
    "backup" { 
        $Description = $args[0]
        if (-not $Description) {
            $Description = Read-Host "Enter backup description"
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

