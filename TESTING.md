# 后端接口部署和测试指南

## 📋 测试准备

已为您创建以下测试工具：

### 测试脚本
1. **test-simple.js** - 使用 Node.js 原生 http 模块的简单测试
2. **test-api.js** - 使用 node-fetch 的完整测试（需要先安装依赖）
3. **deploy-and-test.bat** - Windows 批处理自动化脚本
4. **deploy-and-test.ps1** - PowerShell 自动化脚本

## 🚀 快速测试（推荐）

### 方法一：使用批处理文件（最简单）

1. 打开文件资源管理器，进入：`d:\AiCode\qoder\test002`
2. 双击运行 **`deploy-and-test.bat`**
3. 等待自动安装依赖、启动服务器并运行测试

### 方法二：手动执行（分步骤）

打开两个命令行窗口：

**窗口1 - 启动服务器：**
```bash
cd d:\AiCode\qoder\test002
npm install
node server/index.js
```

**窗口2 - 运行测试：**
```bash
cd d:\AiCode\qoder\test002
node test-simple.js
```

### 方法三：使用 PowerShell

```powershell
cd d:\AiCode\qoder\test002

# 安装依赖（如果还没安装）
npm install

# 启动服务器（后台）
Start-Job -ScriptBlock { Set-Location d:\AiCode\qoder\test002; node server/index.js }

# 等待3秒
Start-Sleep -Seconds 3

# 运行测试
node test-simple.js
```

## 🧪 测试内容

### 接口测试列表

| 测试项 | 接口 | 方法 | 测试内容 |
|--------|------|------|----------|
| 1 | `/api/health` | GET | 健康检查接口 |
| 2 | `/api/patent/query` | POST | 查询中文专利（CN123456789A） |
| 3 | `/api/patent/query` | POST | 查询美国专利（US2023000001A1） |
| 4 | `/api/patent/query` | POST | 空参数验证 |
| 5 | `/api/patent/query` | POST | 不存在的专利处理 |

### 预期测试结果

所有5个测试应该通过：
- ✓ 健康检查接口 (200)
- ✓ 专利查询接口 - CN专利 (200)
- ✓ 专利查询接口 - US专利 (200)
- ✓ 专利查询接口 - 空参数验证 (400)
- ✓ 专利查询接口 - 不存在的专利 (404)

成功率应为 **100%**

## 📊 测试输出示例

```
========================================
后端接口快速测试
========================================

开始测试...

✓ 健康检查接口
  状态码: 200 (期望: 200)
  状态: ok

✓ 专利查询接口 - CN专利
  状态码: 200 (期望: 200)
  专利名称: 一种基于人工智能的图像识别系统及方法

✓ 专利查询接口 - US专利
  状态码: 200 (期望: 200)
  专利名称: Method and System for Blockchain-based Data Security

✓ 专利查询接口 - 空参数验证
  状态码: 400 (期望: 400)
  错误信息: 专利号不能为空

✓ 专利查询接口 - 不存在的专利
  状态码: 404 (期望: 404)
  错误信息: 未找到该专利信息，请检查专利号是否正确

========================================
测试结果汇总
========================================
✓ 通过: 5 个
✗ 失败: 0 个
总计: 5 个
成功率: 100.00%
========================================

🎉 所有测试通过！后端接口运行正常。
```

## 🔧 手动测试接口

如果想要手动测试单个接口，可以使用以下方法：

### 使用浏览器测试

启动服务器后，在浏览器访问：
```
http://localhost:3001/api/health
```

### 使用 curl 测试

```bash
# 健康检查
curl http://localhost:3001/api/health

# 专利查询
curl -X POST http://localhost:3001/api/patent/query \
  -H "Content-Type: application/json" \
  -d "{\"patentNumber\":\"CN123456789A\"}"
```

### 使用 PowerShell 测试

```powershell
# 健康检查
Invoke-RestMethod -Uri "http://localhost:3001/api/health"

# 专利查询
$body = @{
    patentNumber = "CN123456789A"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/patent/query" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

## ✅ 接口功能说明

### 1. 健康检查接口
- **地址**：`GET /api/health`
- **功能**：检查服务器运行状态
- **响应示例**：
```json
{
  "status": "ok",
  "timestamp": "2026-01-12T07:30:00.000Z"
}
```

### 2. 专利查询接口
- **地址**：`POST /api/patent/query`
- **功能**：根据专利号查询专利信息
- **请求参数**：
```json
{
  "patentNumber": "CN123456789A"
}
```
- **响应示例**：
```json
{
  "success": true,
  "data": {
    "patentNumber": "CN123456789A",
    "title": "一种基于人工智能的图像识别系统及方法",
    "abstract": "本发明公开了...",
    "applicant": "某某科技有限公司",
    "inventor": "张三;李四;王五",
    "applicationDate": "2023-01-15",
    "publicationDate": "2023-06-20",
    "ipcClassification": "G06K9/62",
    "claims": [...],
    "description": "..."
  }
}
```

### 3. 专利分析接口
- **地址**：`POST /api/patent/analyze`
- **功能**：调用 DeepSeek AI 进行专利深度分析
- **请求参数**：
```json
{
  "patentData": { ... },
  "analysisType": "comprehensive"
}
```
- **响应**：Server-Sent Events (SSE) 流式输出

## 🎯 测试成功标准

后端接口部署成功的标准：

- [x] 服务器能够正常启动
- [x] 监听在 3001 端口
- [x] 健康检查接口返回 200
- [x] 专利查询接口能正确返回数据
- [x] 参数验证功能正常
- [x] 错误处理正确
- [x] 所有测试用例通过

## 📝 注意事项

1. **端口占用**：确保 3001 端口未被其他程序占用
2. **Node.js 版本**：建议使用 Node.js v16 或更高版本
3. **依赖安装**：首次运行需要执行 `npm install`
4. **API密钥**：DeepSeek API密钥已配置在 `server/index.js` 中

## 🐛 常见问题

**Q: 服务器启动失败？**
- 检查端口 3001 是否被占用
- 确认 Node.js 已正确安装
- 查看错误日志

**Q: 测试失败？**
- 确认服务器已经启动
- 等待几秒让服务器完全启动
- 检查防火墙设置

**Q: 无法安装依赖？**
- 检查网络连接
- 尝试切换 npm 镜像源
- 使用 `npm install --verbose` 查看详细日志

## 🎉 下一步

后端接口测试通过后，您可以：

1. **启动前端界面**
   ```bash
   npm run dev
   ```

2. **运行完整系统**
   - 双击 `start-all.bat` 启动前后端
   - 访问 http://localhost:3000

3. **进行端到端测试**
   - 在前端界面输入专利号
   - 进行 AI 深度分析
   - 测试会话管理功能

---

**项目路径**：`d:\AiCode\qoder\test002`
**创建时间**：2026-01-12
**版本**：1.0.0
