# 后端服务部署和测试脚本
$ErrorActionPreference = "Continue"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "后端接口部署和自动化测试" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 切换到项目目录
Set-Location "d:\AiCode\qoder\test002"

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/3] 正在安装依赖..." -ForegroundColor Yellow
    npm install --loglevel error
    if ($LASTEXITCODE -ne 0) {
        Write-Host "依赖安装失败！" -ForegroundColor Red
        exit 1
    }
    Write-Host "依赖安装完成！" -ForegroundColor Green
} else {
    Write-Host "[1/3] 依赖已安装，跳过安装步骤" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] 启动后端服务器..." -ForegroundColor Yellow

# 启动后端服务器
$serverJob = Start-Job -ScriptBlock {
    Set-Location "d:\AiCode\qoder\test002"
    node server/index.js
}

Write-Host "等待服务器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host ""
Write-Host "[3/3] 运行自动化测试..." -ForegroundColor Yellow
Write-Host ""

# 运行测试
node test-api.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "测试完成！所有接口正常运行" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Yellow
    Write-Host "测试完成，请检查上方详情" -ForegroundColor Yellow
    Write-Host "====================================" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "后端服务器仍在运行中..." -ForegroundColor Cyan
Write-Host "访问地址: http://localhost:3001" -ForegroundColor Cyan
Write-Host "健康检查: http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键停止服务器..." -ForegroundColor Yellow

# 等待用户输入
$null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 停止服务器
Stop-Job -Job $serverJob
Remove-Job -Job $serverJob

Write-Host "服务器已停止" -ForegroundColor Green
