# Mr.π Capture - Chrome Extension

> 一键保存网页信息到 Mr.π AI Studio 的 Chrome 浏览器扩展（Manifest V3）

**项目状态**：✅ 核心功能完成 | 📦 包含Mock API测试工具 | ⏳ 等待测试验证

## 📋 项目简介

Mr.π Capture 是「Mr.π AI Studio」配套的浏览器扩展工具，帮助用户快速捕获和分类互联网上的有价值信息。

### 核心功能

- 🎯 **一键捕获**：自动读取当前页面标题和 URL
- ✏️ **灵活编辑**：可修改标题、添加备注说明
- 🏷️ **智能分类**：支持 Product、Competitor、Content、Inspiration 四种标签
- 🔐 **安全认证**：基于 API Token 的简单认证方案
- ⚡ **即时同步**：数据实时发送到后端 API
- 👋 **友好引导**：首次使用自动提示配置步骤（新增）

## 🗂️ 项目结构

```
mrpi-capture-extension/
├── manifest.json            # Manifest V3 配置文件
├── background.js            # Service Worker 后台脚本
├── popup.html              # 弹出窗口 UI
├── popup.js                # 弹出窗口逻辑（含首次使用引导）
├── options.html            # 设置页面 UI
├── options.js              # 设置页面逻辑
├── icons/                  # 扩展图标目录
│   ├── icon{16,48,128}.png # PNG图标文件（已生成）
│   ├── icon.svg            # SVG源文件
│   └── README.md           # 图标说明文档
├── mock-api-server.js      # 🆕 Mock API服务器（本地测试用）
├── TEST_GUIDE.md           # 🆕 详细测试指南
├── QUICK_TEST_GUIDE.md     # 🆕 快速测试指南
├── IMPLEMENTATION_LOG.md   # 🆕 开发历史记录
├── CLAUDE.md               # 开发者指南
├── TODO.md                 # 任务清单
└── README.md               # 项目文档（本文件）
```

## 🚀 快速开始（推荐：使用Mock API测试）

### 方式1：使用Mock API本地测试（推荐）⭐

**无需真实后端，5分钟完成测试！**

#### 步骤 1：启动Mock API服务器

```bash
node mock-api-server.js
```

服务器将在 `http://localhost:3000` 启动并在终端显示所有接收到的数据。

#### 步骤 2：加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的「**开发者模式**」
4. 点击「**加载已解压的扩展程序**」
5. 选择本项目的根目录 `mrpi-capture-extension/`
6. 扩展加载成功后，工具栏会出现图标

**重要**：修改代码后，必须点击扩展卡片上的刷新按钮 🔄

#### 步骤 3：配置 API Token（首次使用）

1. 点击扩展图标
2. 看到蓝色提示：「👋 首次使用？请先点击下方"⚙️ 配置 API Token"进行设置」
3. 点击「**⚙️ 配置 API Token**」链接
4. 输入任意token（长度>10字符即可，如：`test-token-12345678`）
5. 点击「**💾 保存设置**」

#### 步骤 4：测试捕获功能

1. 打开任意网页（例如 https://www.example.com）
2. 点击扩展图标
3. URL和标题已自动填充 ✅
4. 编辑标题、输入备注
5. 选择标签（Product/Competitor/Content/Inspiration）
6. 点击「**💾 保存到 Mr.π**」
7. 看到绿色成功提示 ✅
8. **查看Mock服务器终端** - 会显示接收到的完整数据！

#### 步骤 5：验证数据

在浏览器访问：`http://localhost:3000/api/captured-items`
查看所有已保存的数据（JSON格式）

---

### 方式2：连接真实后端API

#### 修改API地址

编辑 `popup.js` 第14行：

```javascript
BASE_URL: 'https://api.mrpi.ai',  // 改为你的生产API地址
```

#### 更新权限（可选）

编辑 `manifest.json`，移除localhost权限：

```json
"host_permissions": [
  "https://api.mrpi.ai/*"
  // 移除: "http://localhost:3000/*"
]
```

#### 重新加载扩展

在 `chrome://extensions/` 点击扩展的刷新按钮 🔄

---

### 调试工具

- **Popup 调试**：在弹出窗口上右键 → 检查 → Console
- **Service Worker 调试**：`chrome://extensions/` → Service Worker → Console
- **Options 调试**：在设置页面右键 → 检查 → Console
- **Mock API日志**：查看运行 `mock-api-server.js` 的终端窗口

每个界面有独立的DevTools实例。

## 🔧 技术细节

### Manifest V3 规范

- ✅ 使用 `service_worker` 替代传统 `background.page`
- ✅ 最小权限原则：仅申请 `activeTab` 和 `storage`
- ✅ 明确声明 `host_permissions` 用于 API 访问
- ✅ 无需 `content_scripts`，通过 `chrome.tabs.query` 获取页面信息

### API 请求格式

**接口地址**（可在 `popup.js:14` 中修改）：
```javascript
// 开发环境（默认）
BASE_URL: 'http://localhost:3000'

// 生产环境
BASE_URL: 'https://api.mrpi.ai'
```

**完整端点**：`/api/captured-items`

**请求方法**：`POST`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <YOUR_API_TOKEN>
```

**请求体**：
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "note": "用户输入的备注",
  "tags": ["Product"],
  "source": "chrome_extension"
}
```

### 数据存储

使用 `chrome.storage.sync` 存储 API Token：
- 自动在用户设备间同步
- 安全存储，扩展卸载后自动清除

## 🛠️ Mock API服务器详细说明

### 功能特性

- ✅ 完整的API模拟（POST /api/captured-items）
- ✅ 请求验证（Authorization header、必填字段）
- ✅ 美观的终端日志输出
- ✅ 数据持久化（内存中，重启清空）
- ✅ CORS支持（允许Chrome扩展访问）
- ✅ 健康检查端点（GET /health）

### 可用端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/captured-items` | POST | 接收扩展保存的数据 |
| `/api/captured-items` | GET | 查看所有已保存数据 |
| `/health` | GET | 服务器健康检查 |

### 终端输出示例

保存数据时，终端会显示：

```
✅ 接收到新的捕获数据:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 ID:      1
🔗 URL:     https://www.example.com/
📝 标题:    Example Domain - 测试
💬 备注:    这是一个测试
🏷️  标签:    Product
📱 来源:    chrome_extension
⏰ 时间:    2025-11-09T12:40:50.123Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 停止服务器

在运行服务器的终端按 `Ctrl+C`

---

## 📝 常见问题

### Q1: 首次使用没有看到蓝色提示？
**A**: 确保：
1. 扩展已重新加载（`chrome://extensions/` → 刷新 🔄）
2. 之前没有配置过token（清空storage重新测试：右键popup → 检查 → Console → 输入 `chrome.storage.sync.clear()`）

### Q2: 保存失败，提示「无法连接到服务器」？
**A**: 检查以下几点：
- **使用Mock API**：确保 `node mock-api-server.js` 正在运行
- **使用生产API**：
  - 网络连接是否正常
  - API 地址是否正确（`popup.js:14`）
  - 后端服务是否启动
  - CORS 是否配置正确

### Q3: Mock服务器没有显示接收到的数据？
**A**:
1. 确认扩展的API地址配置为 `http://localhost:3000`（`popup.js:14`）
2. 检查扩展是否重新加载
3. 查看Popup的Console是否有错误信息

### Q4: 如何查看请求日志？
**A**:
- **扩展侧**：
  - Popup 日志：右键 Popup → 检查 → Console
  - Background 日志：`chrome://extensions/` → Service Worker → Console
- **服务器侧**：
  - Mock API日志：查看运行 `mock-api-server.js` 的终端

## 🛠️ 二次开发建议

### 扩展点 1：丰富标签选项
在 `popup.html` 第 56-61 行修改 `<select>` 的 `<option>` 列表。

### 扩展点 2：支持多标签选择
将 `<select>` 改为多选模式，或使用 checkbox 组，修改 `popup.js` 中的数据组装逻辑。

### 扩展点 3：添加网页截图功能
使用 `chrome.tabs.captureVisibleTab` API 捕获截图，上传到后端。

### 扩展点 4：自动提取关键词
使用 `chrome.scripting.executeScript` 注入脚本，提取页面 meta 标签或正文摘要。

### 扩展点 5：右键菜单快捷保存
在 `background.js` 中使用 `chrome.contextMenus.create` 创建右键菜单项。

## ⚠️ 注意事项

1. **权限审查**：如果后续添加更多权限，需在 `manifest.json` 中声明并重新加载扩展
2. **HTTPS 限制**：Service Worker 仅在 HTTPS 或 localhost 环境下工作
3. **跨域问题**：确保后端 API 配置了正确的 CORS 头
4. **Token 安全**：当前方案将 Token 存储在 `chrome.storage.sync`，已相对安全，但不要在代码中硬编码 Token
5. **错误处理**：所有网络请求都已包含 try-catch，建议根据实际 API 响应格式调整错误提示

## 📚 测试文档

完整的测试指南请参考：

- **QUICK_TEST_GUIDE.md** - 5分钟快速测试指南（使用Mock API）
- **TEST_GUIDE.md** - 详细测试场景和检查清单
- **TODO.md** - 开发任务清单和进度追踪

## 📦 发布前检查清单

- [x] ✅ PNG 图标已生成（16/48/128）
- [ ] ⚠️ 修改 API 地址为生产环境（`popup.js:14` 当前为 localhost:3000）
- [ ] 更新 `manifest.json` 中的版本号
- [ ] 测试所有功能（参考 TEST_GUIDE.md）
  - [ ] 正常流程测试
  - [ ] 异常流程测试
  - [ ] 边界条件测试
- [ ] 移除或条件化 console.log
- [ ] 移除 `manifest.json` 中的 localhost 权限（可选）
- [ ] 编写隐私政策和使用条款
- [ ] 准备 Chrome Web Store 宣传素材

## 📄 许可证

本项目为 Mr.π AI Studio 配套工具，版权归项目所有者所有。

---

## 🎉 最新更新（2025-11-09）

### 功能改进
- ✅ **首次使用体验优化**：自动检测API Token，未配置时显示友好的蓝色引导提示
- ✅ **三级消息系统**：success（绿色）、error（红色）、info（蓝色）
- ✅ **Mock API测试工具**：无需真实后端即可完整测试所有功能

### 开发工具
- ✅ **本地Mock服务器**：`mock-api-server.js` 提供完整的API模拟
- ✅ **完整测试文档**：TEST_GUIDE.md 和 QUICK_TEST_GUIDE.md
- ✅ **开发者指南**：CLAUDE.md 提供架构说明和开发流程

### 技术细节
- 扩展使用 Manifest V3 规范
- 纯JavaScript实现，无需构建工具
- 图标文件已生成（16x16、48x48、128x128 PNG）
- 支持本地测试和生产环境切换

---

**开发时间**: 2025年11月9日
**Manifest 版本**: V3
**最低 Chrome 版本**: 88+
**当前状态**: ✅ 开发完成，⏳ 等待测试验证
# mrpi-capture-extension
