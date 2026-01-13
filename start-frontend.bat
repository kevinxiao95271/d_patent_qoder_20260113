@echo off
echo ===================================
echo 启动前端界面
echo ===================================
echo.

cd /d "%~dp0"

echo 正在启动前端开发服务器 (端口: 3000)...
echo.

npm run dev

pause
