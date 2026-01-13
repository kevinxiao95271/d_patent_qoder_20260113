@echo off
echo ===================================
echo 专利深度分析系统 - 安装依赖
echo ===================================
echo.

cd /d "%~dp0"

echo [1/3] 安装依赖包...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo 安装失败！请检查npm是否正确安装。
    pause
    exit /b 1
)

echo.
echo ===================================
echo 安装完成！
echo ===================================
echo.
echo 使用说明：
echo 1. 运行 start-server.bat 启动后端服务
echo 2. 运行 start-frontend.bat 启动前端界面
echo 或者运行 start-all.bat 同时启动前后端
echo.
pause
