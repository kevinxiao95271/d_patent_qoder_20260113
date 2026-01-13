@echo off
title 后端接口快速测试
color 0A

echo.
echo ====================================
echo   后端接口快速测试工具
echo ====================================
echo.

cd /d "%~dp0"

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [√] Node.js 已安装
echo.

REM 检查依赖
if not exist "node_modules" (
    echo [1/4] 正在安装项目依赖...
    echo.
    call npm install --loglevel=error
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo [√] 依赖安装完成
) else (
    echo [1/4] 依赖已安装
)

echo.
echo [2/4] 启动后端服务器...
start /B /MIN cmd /c "node server/index.js > server.log 2>&1"

REM 等待服务器启动
echo [3/4] 等待服务器启动 (3秒)...
ping 127.0.0.1 -n 4 > nul

echo [4/4] 运行测试...
echo.
echo ====================================
echo.

node test-simple.js

echo.
echo ====================================
echo   测试完成
echo ====================================
echo.
echo 服务器日志已保存到: server.log
echo 服务器访问地址: http://localhost:3001
echo.
echo 按任意键关闭服务器并退出...
pause >nul

REM 关闭服务器
taskkill /F /FI "WINDOWTITLE eq server/index.js" >nul 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001"') do taskkill /F /PID %%a >nul 2>nul

echo.
echo 服务器已关闭
timeout /t 2 >nul
