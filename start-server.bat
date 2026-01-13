@echo off
echo ===================================
echo 启动后端服务器
echo ===================================
echo.

cd /d "%~dp0"

echo 正在启动API服务器 (端口: 3001)...
echo.

node server/index.js

pause
