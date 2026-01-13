# 专利深度分析系统

基于 Vue 3 + DeepSeek AI 的专利智能分析系统

## 功能特性

- 🔍 **专利查询**：输入专利号快速查询专利信息
- 🧠 **AI深度分析**：调用腾讯云DeepSeek进行多维度智能分析
- 📊 **实时进度展示**：流式显示AI分析进度和结果
- 💬 **会话管理**：支持多会话管理，历史记录保存
- 📄 **专利摘要**：顶部展示专利关键信息和摘要

## 分析类型

1. **🔬 全面分析** - 技术、商业、法律全方位深度分析
2. **⚙️ 技术分析** - 核心技术创新点和实现路径
3. **💼 商业分析** - 市场价值和商业化可行性
4. **⚖️ 法律分析** - 专利保护范围和法律风险

## 快速开始

### 1. 安装依赖

双击运行 `install.bat` 或执行：
```bash
npm install
```

### 2. 启动应用

**方式一：一键启动（推荐）**
双击运行 `start-all.bat`

**方式二：分别启动**
- 启动后端：双击 `start-server.bat` 或运行 `npm run server`
- 启动前端：双击 `start-frontend.bat` 或运行 `npm run dev`

### 3. 访问应用

- 前端界面：http://localhost:3000
- 后端API：http://localhost:3001

## 使用说明

1. **查询专利**
   - 在输入框输入专利号（如：CN123456789A）
   - 点击"查询专利"按钮
   - 系统会展示专利的详细信息和摘要

2. **开始分析**
   - 选择分析类型（全面/技术/商业/法律）
   - 点击"开始深度分析"
   - 实时查看AI分析进度
   - 等待完整的分析报告生成

3. **会话管理**
   - 点击"新建会话"创建新的分析任务
   - 点击历史会话可切换查看
   - 支持删除不需要的会话

## 技术栈

- **前端**：Vue 3 + Vite
- **后端**：Node.js + Express
- **AI**：腾讯云 DeepSeek API
- **样式**：原生 CSS（渐变美化设计）

## 项目结构

```
patent-analyzer/
├── src/                    # 前端源码
│   ├── App.vue            # 主应用组件
│   └── main.js            # 入口文件
├── server/                # 后端服务
│   └── index.js           # Express服务器
├── index.html             # HTML模板
├── vite.config.js         # Vite配置
├── package.json           # 项目配置
├── install.bat            # 安装脚本
├── start-all.bat          # 一键启动脚本
├── start-server.bat       # 后端启动脚本
└── start-frontend.bat     # 前端启动脚本
```

## 配置说明

### API密钥配置

在 `server/index.js` 中配置你的 DeepSeek API Key：

```javascript
const DEEPSEEK_API_KEY = 'your-api-key-here';
```

### 示例专利数据

系统内置了两个示例专利数据：
- `CN123456789A` - 中文专利示例
- `US2023000001A1` - 英文专利示例

可在 `server/index.js` 的 `mockPatentData` 对象中添加更多测试数据。

## API接口文档

### 1. 专利查询接口
```
POST /api/patent/query
Body: { "patentNumber": "CN123456789A" }
```

### 2. 专利分析接口
```
POST /api/patent/analyze
Body: {
  "patentData": {...},
  "analysisType": "comprehensive"
}
返回：Server-Sent Events (SSE) 流式数据
```

### 3. 健康检查
```
GET /api/health
```

## 注意事项

1. 确保已安装 Node.js (v16+)
2. 确保 3000 和 3001 端口未被占用
3. 需要有效的腾讯云 DeepSeek API Key
4. 建议使用现代浏览器（Chrome、Edge、Firefox）

## 许可证

MIT License
