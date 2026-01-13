@echo off
echo ===================================
echo 专利深度分析系统 - 启动所有服务
echo ===================================
echo.

cd /d "%~dp0"

echo [1/2] 启动后端API服务器...
start "后端服务器" cmd /k "node server/index.js"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端界面...
start "前端界面" cmd /k "npm run dev"

echo.
echo ===================================
echo 服务启动中...
echo ===================================
echo.
echo 后端服务: http://localhost:3001
echo 前端界面: http://localhost:3000
echo.
echo 请等待浏览器自动打开，或手动访问上述地址
echo 关闭此窗口不会停止服务，请关闭对应的服务窗口
echo.
pause
