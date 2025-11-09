/**
 * popup.js - Mr.π Capture Extension Popup Logic
 * 
 * 功能：
 * 1. 自动获取当前标签页的 URL 和标题
 * 2. 允许用户编辑标题、添加备注、选择标签
 * 3. 点击保存时发送数据到后端 API
 * 4. 处理成功/失败提示
 */

// API 配置常量 - 方便后续修改
const API_CONFIG = {
  // 开发环境使用本地Mock API
  BASE_URL: 'http://localhost:3000',
  // 生产环境使用: 'https://api.mrpi.ai'
  ENDPOINT: '/api/captured-items',
  get FULL_URL() {
    return this.BASE_URL + this.ENDPOINT;
  }
};

// DOM 元素
let form, titleInput, urlInput, noteInput, tagSelect, saveBtn, messageDiv, settingsLink;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取 DOM 元素
  form = document.getElementById('captureForm');
  titleInput = document.getElementById('title');
  urlInput = document.getElementById('url');
  noteInput = document.getElementById('note');
  tagSelect = document.getElementById('tag');
  saveBtn = document.getElementById('saveBtn');
  messageDiv = document.getElementById('message');
  settingsLink = document.getElementById('settingsLink');

  // 加载当前标签页信息
  loadCurrentTabInfo();

  // 检查API Token配置状态
  checkApiToken();

  // 绑定事件
  form.addEventListener('submit', handleSubmit);
  settingsLink.addEventListener('click', openSettings);
});

/**
 * 获取当前标签页的 URL 和标题
 */
async function loadCurrentTabInfo() {
  try {
    // 查询当前活动标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      // 填充 URL（只读）
      urlInput.value = tab.url || '';
      
      // 填充标题（可编辑）
      titleInput.value = tab.title || '';
      
      console.log('Loaded tab info:', { url: tab.url, title: tab.title });
    } else {
      showMessage('无法获取当前标签页信息', 'error');
    }
  } catch (error) {
    console.error('Error loading tab info:', error);
    showMessage('加载页面信息失败', 'error');
  }
}

/**
 * 处理表单提交
 */
async function handleSubmit(event) {
  event.preventDefault();

  // 获取表单数据
  const formData = {
    url: urlInput.value.trim(),
    title: titleInput.value.trim(),
    note: noteInput.value.trim(),
    tags: [tagSelect.value],
    source: 'chrome_extension'
  };

  // 基础验证
  if (!formData.url || !formData.title || !formData.tags[0]) {
    showMessage('请填写所有必填项', 'error');
    return;
  }

  // 禁用按钮，防止重复提交
  saveBtn.disabled = true;
  saveBtn.textContent = '保存中...';

  try {
    // 从 storage 读取 API Token
    const { apiToken } = await chrome.storage.sync.get('apiToken');

    if (!apiToken) {
      showMessage('未配置 API Token，请先在设置中配置', 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 保存到 Mr.π';
      return;
    }

    // 发送请求到后端 API
    const response = await fetch(API_CONFIG.FULL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify(formData)
    });

    // 处理响应
    if (response.ok) {
      const result = await response.json();
      console.log('Save success:', result);
      
      showMessage('保存成功 ✔', 'success');
      
      // 1.5 秒后关闭 popup
      setTimeout(() => {
        window.close();
      }, 1500);
    } else {
      // 处理 HTTP 错误
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `请求失败 (${response.status})`;
      
      console.error('Save failed:', response.status, errorData);
      showMessage(`保存失败: ${errorMessage}`, 'error');
      
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 保存到 Mr.π';
    }
  } catch (error) {
    console.error('Error saving data:', error);
    
    // 网络错误或其他异常
    let errorMsg = '保存失败，请检查网络连接';
    if (error.message.includes('Failed to fetch')) {
      errorMsg = '无法连接到服务器，请检查网络';
    }
    
    showMessage(errorMsg, 'error');
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 保存到 Mr.π';
  }
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'success', 'error', 或 'info'
 */
function showMessage(message, type = 'success') {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type} show`;

  // 3 秒后自动隐藏（错误和info消息保持显示）
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.classList.remove('show');
    }, 3000);
  }
}

/**
 * 检查API Token配置状态
 * 如果未配置，显示友好提示
 */
async function checkApiToken() {
  try {
    const { apiToken } = await chrome.storage.sync.get('apiToken');

    if (!apiToken) {
      // 显示配置提示
      showMessage('👋 首次使用？请先点击下方"⚙️ 配置 API Token"进行设置', 'info');
      console.log('API Token not configured');
    } else {
      console.log('API Token is configured');
    }
  } catch (error) {
    console.error('Error checking API Token:', error);
  }
}

/**
 * 打开设置页面
 */
function openSettings(event) {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
}
