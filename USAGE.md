# 专利深度分析系统 - 使用指南

## 系统已创建完成！

您的专利深度分析系统已经成功创建在：`d:\AiCode\qoder\test002`

## 📋 项目文件清单

✅ **配置文件**
- `package.json` - 项目依赖配置
- `vite.config.js` - Vite构建配置
- `index.html` - HTML入口文件

✅ **前端代码**
- `src/App.vue` - Vue主应用组件（含完整UI和交互逻辑）
- `src/main.js` - Vue入口文件

✅ **后端代码**
- `server/index.js` - Express API服务器（含专利查询和DeepSeek分析）

✅ **启动脚本**
- `install.bat` - 安装依赖脚本
- `start-all.bat` - 一键启动前后端
- `start-server.bat` - 启动后端服务
- `start-frontend.bat` - 启动前端界面

## 🚀 快速启动步骤

### 方法一：使用 Windows 资源管理器（推荐新手）

1. **打开项目文件夹**
   - 打开文件资源管理器
   - 导航到：`d:\AiCode\qoder\test002`

2. **安装依赖**
   - 双击运行 `install.bat`
   - 等待依赖安装完成

3. **启动应用**
   - 双击运行 `start-all.bat`
   - 会自动打开两个命令窗口（后端服务器 + 前端界面）
   - 浏览器会自动打开 http://localhost:3000

### 方法二：使用命令行

```bash
# 1. 进入项目目录
cd d:\AiCode\qoder\test002

# 2. 安装依赖
npm install

# 3. 启动后端（新开一个命令行窗口）
npm run server

# 4. 启动前端（再开一个命令行窗口）
npm run dev
```

## 💡 功能使用说明

### 1️⃣ 查询专利
- 在输入框输入专利号，例如：`CN123456789A` 或 `US2023000001A1`
- 点击"🔍 查询专利"按钮
- 系统会显示专利的详细信息和摘要

### 2️⃣ 深度分析
- 查询到专利后，选择分析类型：
  - 🔬 **全面分析**：技术、商业、法律全方位分析
  - ⚙️ **技术分析**：专注技术创新和实现路径
  - 💼 **商业分析**：市场价值和商业化分析
  - ⚖️ **法律分析**：专利保护范围和法律风险
- 点击"🚀 开始深度分析"
- 实时查看AI分析进度和结果

### 3️⃣ 会话管理
- 点击左侧"➕ 新建会话"创建新的分析任务
- 点击历史会话可切换查看之前的分析结果
- 每个会话独立保存专利数据和分析结果

## 🎯 系统特色

### ✨ 核心功能
1. **智能专利查询** - 快速检索专利信息
2. **AI深度分析** - 调用腾讯云DeepSeek进行专业分析
3. **实时进度展示** - 流式显示AI思考过程
4. **多维度分析** - 技术/商业/法律多角度解读
5. **会话历史** - 保存和管理多个分析任务

### 🎨 界面设计
- 渐变紫色主题，现代美观
- 响应式布局，适配各种屏幕
- 流畅动画效果
- 清晰的信息层次

### ⚡ 技术亮点
- Vue 3 Composition API
- Server-Sent Events (SSE) 流式输出
- DeepSeek AI 深度分析
- 实时进度反馈

## 📊 示例专利数据

系统内置了两个测试专利：

1. **CN123456789A** - 中文专利
   - 一种基于人工智能的图像识别系统及方法

2. **US2023000001A1** - 英文专利
   - Method and System for Blockchain-based Data Security

您可以使用这些专利号进行测试。

## 🔧 配置说明

### DeepSeek API配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的API密钥：
```env
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.lkeap.cloud.tencent.com/v1/chat/completions
```

⚠️ **注意**：`.env` 文件已被添加到 `.gitignore`，不会提交到代码仓库。

### 端口配置
- 前端界面：http://localhost:3000
- 后端API：http://localhost:3001

如需修改端口，请编辑：
- `vite.config.js` - 前端端口
- `server/index.js` - 后端端口

## 📝 注意事项

1. ✅ 确保已安装 Node.js（建议 v16 或更高版本）
2. ✅ 确保 3000 和 3001 端口未被占用
3. ✅ 需要稳定的网络连接以访问 DeepSeek API
4. ✅ 建议使用现代浏览器（Chrome、Edge、Firefox）

## 🐛 常见问题

**Q: 安装依赖失败？**
A: 检查网络连接，尝试切换npm镜像：`npm config set registry https://registry.npmmirror.com`

**Q: 端口被占用？**
A: 修改配置文件中的端口号，或关闭占用端口的程序

**Q: DeepSeek API调用失败？**
A: 检查API密钥是否有效，网络是否畅通

**Q: 浏览器没有自动打开？**
A: 手动访问 http://localhost:3000

## 📦 项目结构

```
d:\AiCode\qoder\test002\
├── src/
│   ├── App.vue           # 主应用组件（862行）
│   └── main.js           # 入口文件
├── server/
│   └── index.js          # Express服务器（273行）
├── index.html            # HTML模板
├── package.json          # 依赖配置
├── vite.config.js        # Vite配置
├── install.bat           # 安装脚本
├── start-all.bat         # 一键启动
├── start-server.bat      # 启动后端
├── start-frontend.bat    # 启动前端
├── README.md             # 项目说明
└── USAGE.md              # 本文件
```

## 🎓 开发说明

如需修改或扩展功能：

1. **添加更多专利数据**
   - 编辑 `server/index.js` 中的 `mockPatentData` 对象

2. **修改界面样式**
   - 编辑 `src/App.vue` 中的 `<style>` 部分

3. **调整AI提示词**
   - 编辑 `server/index.js` 中的 `buildAnalysisPrompt` 函数

4. **添加新的分析类型**
   - 在 `src/App.vue` 的 `analysisTypes` 数组中添加
   - 在 `server/index.js` 的 `buildAnalysisPrompt` 中添加对应提示词

## 🎉 开始使用

现在您可以：
1. 双击 `install.bat` 安装依赖
2. 双击 `start-all.bat` 启动应用
3. 在浏览器中体验专利智能分析！

祝您使用愉快！如有问题，请查看 README.md 获取更多帮助。
