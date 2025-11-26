# Rembg MCP Server Setup Script for Windows
# Run this script in PowerShell

Write-Host "=== Rembg MCP Server Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    # Prompt for API token
    Write-Host ""
    Write-Host "You need a Replicate API token to use this service." -ForegroundColor Cyan
    Write-Host "Get your token from: https://replicate.com/account/api-tokens" -ForegroundColor Cyan
    Write-Host ""
    $token = Read-Host "Enter your Replicate API token (or press Enter to skip)"
    
    if ($token) {
        "REPLICATE_API_TOKEN=$token" | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✓ .env file created successfully" -ForegroundColor Green
    } else {
        "REPLICATE_API_TOKEN=your_replicate_api_token_here" | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "! .env file created with placeholder. Please edit it and add your token." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Build the server
Write-Host ""
Write-Host "Building the server..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to build the server" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Server built successfully" -ForegroundColor Green

# Display next steps
Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your Replicate API token is set in the .env file" -ForegroundColor White
Write-Host "2. Test the server by running: npm start" -ForegroundColor White
Write-Host "3. Configure Claude Desktop to use this MCP server" -ForegroundColor White
Write-Host ""
Write-Host "For Claude Desktop configuration, add this to:" -ForegroundColor Cyan
Write-Host "%APPDATA%\Claude\claude_desktop_config.json" -ForegroundColor White
Write-Host ""
Write-Host "See README.md for detailed configuration instructions." -ForegroundColor Cyan
Write-Host ""




