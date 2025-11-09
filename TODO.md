# Mr.π Capture - MVP 任务清单

> **MVP定义**：最小可行产品，确保核心功能可用、用户体验完整、无明显bug

**项目状态**：✅ 核心功能完成 + UX优化完成 + Mock API测试工具就绪

**最新进展**（2025-11-09）：
- ✅ 首次使用体验优化（自动检测token并显示友好提示）
- ✅ Mock API服务器创建并运行（本地测试无需真实后端）
- ✅ 完整测试文档编写（TEST_GUIDE.md + QUICK_TEST_GUIDE.md）
- ✅ **新增**：1.1 正常流程测试执行文档完成
  - `TEST_1.1_EXECUTION_INSTRUCTIONS.md` - 快速执行指南
  - `TEST_EXECUTION_REPORT_1.1.md` - 详细测试报告模板（22个测试用例）
- ⏳ 等待手动测试验证并填写测试报告

---

## 🚀 快速开始测试

**当前Mock API服务器状态**：✅ 运行中 (`http://localhost:3000`)

**📋 推荐测试流程（1.1 正常流程）**：
1. 阅读 **`TEST_1.1_EXECUTION_INSTRUCTIONS.md`** - 快速执行指南（5分钟）
2. 按照指南执行两个测试场景（首次使用流程 + 完整捕获流程）
3. 填写 **`TEST_EXECUTION_REPORT_1.1.md`** 测试报告模板
4. 观察Mock服务器终端输出验证数据传输

**备选测试方式**：
- 快速验证：`QUICK_TEST_GUIDE.md`（5分钟快速测试）
- 完整测试：`TEST_GUIDE.md`（所有测试场景和检查清单）

---

## 🎯 MVP 核心任务（必须完成）

### 1. 功能测试与验证
**优先级**：P0（最高）
**状态**：✅ 代码实现完成，⏳ 等待手动测试

**已完成的代码改进**：
- ✅ 首次使用流程优化：popup加载时自动检测token（`checkApiToken()`函数）
- ✅ 蓝色info消息提示系统（`.message.info` CSS类）
- ✅ Mock API服务器创建（`mock-api-server.js`）
- ✅ 扩展配置为使用本地API（`popup.js:14` BASE_URL设为localhost:3000）

#### 1.1 正常流程测试
**测试工具**：使用Mock API服务器（`node mock-api-server.js`）
**测试文档**：
- 📄 `TEST_1.1_EXECUTION_INSTRUCTIONS.md` - 执行指南（从这里开始）
- 📄 `TEST_EXECUTION_REPORT_1.1.md` - 测试报告模板（记录结果）

**测试状态**：✅ 代码实现完成 → ⏳ 等待手动执行测试

- [ ] 安装扩展后首次使用流程
  - [ ] 点击扩展图标显示popup
  - [ ] ✨ **新功能**：自动显示蓝色提示"👋 首次使用？请先点击下方'⚙️ 配置 API Token'进行设置"
  - [ ] 点击"⚙️ 配置API Token"跳转到options页面
  - [ ] 成功保存token（Mock服务器接受任意>10字符的token）
- [ ] 完整的信息捕获流程
  - [ ] 打开任意网页（如https://www.example.com）
  - [ ] 点击扩展图标
  - [ ] 验证URL和标题自动填充正确
  - [ ] 编辑标题
  - [ ] 输入备注
  - [ ] 选择标签（Product/Competitor/Content/Inspiration）
  - [ ] 点击"保存到Mr.π"
  - [ ] 验证成功提示显示
  - [ ] 验证1.5秒后popup自动关闭
  - [ ] ✨ **新增**：验证Mock服务器终端显示接收到的数据

#### 1.2 异常流程测试
- [ ] API Token未配置场景
  - [ ] 直接点击保存按钮
  - [ ] 验证错误提示："未配置 API Token，请先在设置中配置"
- [ ] 网络错误场景
  - [ ] 断网状态下尝试保存
  - [ ] 验证错误提示："无法连接到服务器，请检查网络"
- [ ] API返回错误场景（需后端配合）
  - [ ] 使用无效token
  - [ ] 验证显示适当的错误信息
- [ ] 表单验证场景
  - [ ] 清空标题字段提交
  - [ ] 不选择标签提交
  - [ ] 验证错误提示："请填写所有必填项"

#### 1.3 边界条件测试
- [ ] 特殊URL测试
  - [ ] chrome://extensions/ （特殊页面）
  - [ ] file:/// 本地文件
  - [ ] about:blank 空白页
  - [ ] 验证各场景下的行为是否合理
- [ ] 长文本测试
  - [ ] 超长标题（500+字符）
  - [ ] 超长备注（5000+字符）
  - [ ] 验证UI显示和API提交正常
- [ ] 特殊字符测试
  - [ ] 标题/备注包含emoji、中文、特殊符号
  - [ ] 验证数据正确传输

### 2. 代码清理与优化
**优先级**：P0
**状态**：未开始

- [ ] 处理console.log输出（当前有11处）
  - [ ] 选项1：完全移除所有console.log
  - [ ] 选项2：添加debug标志，条件性输出
  ```javascript
  // 建议方案：在各文件顶部添加
  const DEBUG = false; // 生产环境设为false
  const log = DEBUG ? console.log.bind(console) : () => {};
  // 然后将console.log替换为log
  ```
- [ ] 检查并移除未使用的代码
  - [ ] background.js中的注释代码是否需要清理
  - [ ] 确认所有TODO注释是否已处理

### 3. 配置验证
**优先级**：P0
**状态**：⚠️ 需要注意

**当前配置状态**：
- ⚠️ **API地址**：`popup.js:14` 当前为 `http://localhost:3000`（开发环境）
  - 用于本地测试
  - **发布前必须改为**：`https://api.mrpi.ai`（生产环境）
- ✅ **权限配置**：`manifest.json` 同时包含localhost和生产环境权限
  ```json
  "host_permissions": [
    "https://api.mrpi.ai/*",
    "http://localhost:3000/*"
  ]
  ```
- ✅ 版本号：1.0.0
- ✅ 描述文字：`一键保存网页信息到 Mr.π AI Studio`

**发布检查清单**：
- [ ] 将 `popup.js:14` 的 `BASE_URL` 改为 `'https://api.mrpi.ai'`
- [ ] 移除 `manifest.json` 中的 `http://localhost:3000/*` 权限（可选）
- [ ] 验证生产API可访问

---

## ✨ MVP+ 增强任务（建议完成）

### 4. 用户体验优化
**优先级**：P1
**状态**：✅ 部分完成

**已完成**：
- ✅ 首次使用引导：自动检测token并显示友好提示
- ✅ 三级消息系统：success（绿）、error（红）、info（蓝）
- ✅ 消息行为优化：成功消息3秒后自动消失，错误和info消息持续显示

**待优化**：
- [ ] Token输入体验改进
  - [ ] options.js中token长度验证（当前>10）是否合理
  - [ ] 考虑添加token格式说明文字
- [ ] 错误信息优化
  - ✅ 当前错误信息已较友好
  - [ ] 考虑添加错误代码对照表（方便调试）
- [ ] 成功反馈优化
  - ✅ 当前1.5秒延迟关闭popup
  - [ ] 根据测试反馈决定是否调整

### 5. 性能检查
**优先级**：P1
**状态**：未开始

- [ ] 验证chrome.storage.sync操作性能
  - [ ] 大量保存操作时的响应速度
- [ ] 验证popup打开速度
  - [ ] 首次打开延迟是否可接受
  - [ ] 标签页信息获取速度
- [ ] Service Worker稳定性
  - [ ] 长时间运行后是否有内存泄漏
  - [ ] 验证background.js事件监听正常

---

## 📦 发布准备任务（非MVP，可后续完成）

### 6. 发布文档
**优先级**：P2
**状态**：未开始

- [ ] 编写隐私政策（Chrome Web Store要求）
  - [ ] 说明收集哪些数据（URL、标题、备注）
  - [ ] 说明数据如何使用和存储
  - [ ] 说明API Token的安全性
- [ ] 编写使用条款
- [ ] 准备用户指南（可选）

### 7. 商店素材
**优先级**：P2
**状态**：未开始

- [ ] 准备Chrome Web Store宣传图
  - [ ] 1280x800像素的宣传图（至少1张）
  - [ ] 640x400像素的截图（建议3-5张）
- [ ] 准备详细描述文案
- [ ] 准备推广用的短描述

---

## 🔍 验收标准

### MVP发布条件（所有P0任务完成）：
- ✅ 所有正常流程测试通过
- ✅ 所有异常流程有合适的错误处理
- ✅ 边界条件测试无严重bug
- ✅ console.log已处理（移除或条件化）
- ✅ API地址确认为生产环境
- ✅ manifest.json配置验证无误

### MVP+发布条件（额外完成P1任务）：
- ✅ MVP条件 + 用户体验优化完成
- ✅ 性能检查通过
- ✅ 无明显卡顿或延迟

---

## 🛠️ 开发工具

### Mock API服务器
**文件**：`mock-api-server.js`
**用途**：本地测试，无需真实后端

**启动命令**：
```bash
node mock-api-server.js
```

**功能**：
- 监听 `http://localhost:3000`
- 处理 `/api/captured-items` POST请求
- 验证Authorization header和数据格式
- 在终端美观显示接收到的数据
- 健康检查：`http://localhost:3000/health`

**使用场景**：
- 本地开发测试
- 功能验证
- UI/UX测试
- 数据格式验证

### 测试文档
- **TEST_1.1_EXECUTION_INSTRUCTIONS.md**：1.1 正常流程测试执行指南（推荐从这里开始）
- **TEST_EXECUTION_REPORT_1.1.md**：1.1 正常流程测试报告模板（22个测试用例）
- **QUICK_TEST_GUIDE.md**：快速测试指南（5分钟快速验证）
- **TEST_GUIDE.md**：完整测试场景和检查清单
- **IMPLEMENTATION_LOG.md**：开发历史和实现细节

---

## 📝 测试记录

### 测试准备状态

✅ **1.1 正常流程测试**：
- ✅ 功能代码实现完成并验证
- ✅ Mock API 服务器运行中 (PID: 20850, http://localhost:3000)
- ✅ 测试执行指南已创建：`TEST_1.1_EXECUTION_INSTRUCTIONS.md`
- ✅ 测试报告模板已创建：`TEST_EXECUTION_REPORT_1.1.md`
- ⏳ 等待手动执行测试并填写报告

### 执行 1.1 测试的步骤

1. **打开测试指南**：查看 `TEST_1.1_EXECUTION_INSTRUCTIONS.md`
2. **在Chrome加载扩展**：chrome://extensions/ → 加载已解压的扩展程序
3. **执行测试场景 1**：首次使用流程（验证蓝色提示、Token配置）
4. **执行测试场景 2**：完整捕获流程（验证自动填充、保存、Mock服务器输出）
5. **记录结果**：在 `TEST_EXECUTION_REPORT_1.1.md` 中填写测试结果

### 1.1 测试结果概览（待填写）

**测试日期**：[待执行]
**测试环境**：
- **Mock API服务器**：✅ 已启动 (http://localhost:3000)
- **Chrome版本**：[待填写]
- **操作系统**：macOS (Darwin 25.0.0)

**功能测试结果**：
- [ ] 首次安装流程：待测试（6个检查点）
- [ ] 完整捕获流程：待测试（12个检查点）
- [ ] 额外验证测试：待测试（4个检查点）

**总计**：22个测试用例待执行

### 发现的问题
（测试完成后在 TEST_EXECUTION_REPORT_1.1.md 中填写）

### 优化建议
（测试完成后在 TEST_EXECUTION_REPORT_1.1.md 中填写）

---

**最后更新**：2025-11-09
**MVP目标发布日期**：待定
**当前阶段**：✅ 1.1 正常流程测试准备完成 → ⏳ 等待手动执行测试并填写报告

**下一步行动**：
1. 📖 阅读 `TEST_1.1_EXECUTION_INSTRUCTIONS.md` 了解测试步骤
2. 🧪 按照指南执行测试（预计5-10分钟）
3. 📝 填写 `TEST_EXECUTION_REPORT_1.1.md` 测试报告
4. ✅ 根据测试结果决定是否继续 1.2 异常流程测试
