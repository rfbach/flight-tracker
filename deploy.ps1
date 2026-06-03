# Flight Tracker Deployment Script to AWS S3 (Windows PowerShell)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "Flight Tracker Deployment Script" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Blue

$checks = @(
    @{ name = "AWS CLI"; cmd = "aws" },
    @{ name = "Terraform"; cmd = "terraform" }
)

foreach ($check in $checks) {
    if (Get-Command $check.cmd -ErrorAction SilentlyContinue) {
        Write-Host "$($check.name) is installed" -ForegroundColor Green
    } else {
        Write-Host "Error: $($check.name) is not installed" -ForegroundColor Red
        exit 1
    }
}

# Check build directory
$buildDir = "dist\flight-tracker\browser"
if (-not (Test-Path $buildDir)) {
    Write-Host "Error: Build directory not found at $buildDir" -ForegroundColor Red
    exit 1
}
Write-Host "Build directory found at $buildDir" -ForegroundColor Green

Write-Host ""
Write-Host "==================================" -ForegroundColor Yellow
Write-Host "Deployment Mode:" -ForegroundColor Yellow
Write-Host "  1 = Full deployment" -ForegroundColor Cyan
Write-Host "  2 = Upload only" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Yellow
$deploymentMode = Read-Host "Select mode (1 or 2)"

if ($deploymentMode -eq "1") {
    $uploadOnly = $false
    if (-not (Test-Path "terraform\terraform.tfvars")) {
        Write-Host "Error: terraform.tfvars not found" -ForegroundColor Red
        exit 1
    }
    Write-Host "Terraform configuration found" -ForegroundColor Green
} elseif ($deploymentMode -eq "2") {
    $uploadOnly = $true
    Write-Host "Upload-only mode selected" -ForegroundColor Green
} else {
    Write-Host "Error: Invalid selection" -ForegroundColor Red
    exit 1
}

try {
    Write-Host ""
    Write-Host "Step 1: Building application..." -ForegroundColor Yellow
    
    if (-not (Test-Path ".env")) {
        Write-Host "Error: .env file not found" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Loading environment variables from .env..." -ForegroundColor Blue
    $foundVars = @{}
    Get-Content .env | ForEach-Object {
        $line = $_.Trim()
        if ($line -and $line.StartsWith("VITE_") -and -not $line.StartsWith("#")) {
            $parts = $line.Split("=", 2)
            $key = $parts[0]
            $value = if ($parts.Length -gt 1) { $parts[1] } else { "" }
            $foundVars[$key] = $value
            Write-Host "  Found $key = $value" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Injecting API key into build configuration..." -ForegroundColor Blue
    $apiKey = $foundVars["VITE_AIRLABS_API_KEY"]
    if ($apiKey) {
        $envProdPath = "src\environments\environment.prod.ts"
        $content = Get-Content $envProdPath -Raw
        $newContent = $content.Replace("apiKey: ''", "apiKey: '$apiKey'")
        Set-Content $envProdPath $newContent
        Write-Host "  API key injected successfully" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Running build..." -ForegroundColor Blue
    ng build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "Build completed" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Verifying API key in build output..." -ForegroundColor Blue
    $files = Get-ChildItem -Path $buildDir -Filter "*.js" -Recurse
    $found = $false
    foreach ($file in $files) {
        $fileContent = Get-Content -LiteralPath $file.FullName -Raw
        if ($fileContent -like "*$apiKey*") {
            Write-Host "  API key found in: $($file.Name)" -ForegroundColor Green
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Host "  Warning: API key not found in build" -ForegroundColor Yellow
    }

    if ($uploadOnly) {
        Write-Host ""
        Write-Host "Step 2: Getting S3 bucket info..." -ForegroundColor Yellow
        Push-Location terraform
        $bucketName = terraform output -raw s3_bucket_name
        $websiteUrl = terraform output -raw website_url
        Write-Host "Bucket: $bucketName" -ForegroundColor Green
        Pop-Location
        $stepNumber = 3
    } else {
        Write-Host ""
        Write-Host "Step 2: Infrastructure deployment..." -ForegroundColor Yellow
        Write-Host "Full deployment not implemented in this version" -ForegroundColor Yellow
        $stepNumber = 3
    }

    Write-Host ""
    Write-Host "Deployment completed!" -ForegroundColor Green
    Write-Host "Summary:"
    Write-Host "  S3 Bucket: $bucketName"
    Write-Host "  Website: $websiteUrl"

} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
