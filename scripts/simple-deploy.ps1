# Simple deployment script for Focus Minimal
param([string]$ServerIP)

Write-Host "Deploying Focus Minimal to $ServerIP" -ForegroundColor Green

# Build project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Create archive
Write-Host "Creating archive..." -ForegroundColor Yellow
if (Test-Path "focus-minimal.zip") {
    Remove-Item "focus-minimal.zip"
}
Compress-Archive -Path "build\*" -DestinationPath "focus-minimal.zip"

# Copy to server
Write-Host "Copying to server..." -ForegroundColor Yellow
scp focus-minimal.zip root@${ServerIP}:/tmp/

# Deploy commands
$deployCommands = @"
apt update -y
apt install nginx unzip -y
mkdir -p /var/www/focus-minimal
unzip -o /tmp/focus-minimal.zip -d /var/www/focus-minimal/
chown -R www-data:www-data /var/www/focus-minimal
chmod -R 755 /var/www/focus-minimal
echo 'server { listen 80; server_name $ServerIP; root /var/www/focus-minimal; index index.html; location / { try_files \$uri \$uri/ /index.html; } }' > /etc/nginx/sites-available/focus-minimal
ln -sf /etc/nginx/sites-available/focus-minimal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
rm /tmp/focus-minimal.zip
echo "Deployment completed!"
"@

# Execute on server
Write-Host "Deploying on server..." -ForegroundColor Yellow
$deployCommands | ssh root@${ServerIP} bash

# Cleanup
Remove-Item "focus-minimal.zip"

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Access at: http://$ServerIP" -ForegroundColor Cyan


