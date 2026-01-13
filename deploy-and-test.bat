@echo off
echo ====================================
echo 后端接口部署和自动化测试
echo ====================================
echo.

cd /d "%~dp0"

REM 检查依赖是否已安装
if not exist "node_modules" (
    echo [1/3] 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo 依赖安装失败！
        pause
        exit /b 1
    )
    echo 依赖安装完成！
) else (
    echo [1/3] 依赖已安装，跳过安装步骤
)

echo.
echo [2/3] 启动后端服务器...
start "后端服务器" /min cmd /c "node server/index.js"

echo 等待服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] 运行自动化测试...
echo.
node test-api.js

if %errorlevel% equ 0 (
    echo.
    echo ====================================
    echo 测试完成！所有接口正常运行
    echo ====================================
) else (
    echo.
    echo ====================================
    echo 测试完成，部分接口存在问题
    echo ====================================
)

echo.
echo 后端服务器仍在运行中...
echo 访问地址: http://localhost:3001
echo 健康检查: http://localhost:3001/api/health
echo.
pause
