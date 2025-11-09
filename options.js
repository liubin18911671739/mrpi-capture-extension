/**
 * options.js - Mr.π Capture Extension Options Page Logic
 * 
 * 功能：
 * 1. 从 chrome.storage.sync 读取已保存的 API Token
 * 2. 允许用户修改 Token
 * 3. 保存到 chrome.storage.sync
 * 4. 显示/隐藏 Token 功能
 */

// DOM 元素
let form, tokenInput, saveBtn, messageDiv, toggleBtn;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取 DOM 元素
  form = document.getElementById('settingsForm');
  tokenInput = document.getElementById('apiToken');
  saveBtn = document.getElementById('saveBtn');
  messageDiv = document.getElementById('message');
  toggleBtn = document.getElementById('toggleBtn');

  // 加载已保存的配置
  loadSettings();

  // 绑定事件
  form.addEventListener('submit', handleSubmit);
  toggleBtn.addEventListener('click', togglePasswordVisibility);
});

/**
 * 从 storage 加载已保存的 API Token
 */
async function loadSettings() {
  try {
    const { apiToken } = await chrome.storage.sync.get('apiToken');
    
    if (apiToken) {
      tokenInput.value = apiToken;
      console.log('Loaded API Token from storage');
    } else {
      console.log('No API Token found in storage');
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    showMessage('加载设置失败', 'error');
  }
}

/**
 * 处理表单提交，保存 API Token
 */
async function handleSubmit(event) {
  event.preventDefault();

  const apiToken = tokenInput.value.trim();

  // 验证 Token 不为空
  if (!apiToken) {
    showMessage('请输入 API Token', 'error');
    return;
  }

  // 简单验证 Token 格式（可根据实际情况调整）
  if (apiToken.length < 10) {
    showMessage('API Token 格式不正确，长度过短', 'error');
    return;
  }

  // 禁用按钮，防止重复提交
  saveBtn.disabled = true;
  saveBtn.textContent = '保存中...';

  try {
    // 保存到 chrome.storage.sync
    await chrome.storage.sync.set({ apiToken });
    
    console.log('API Token saved successfully');
    showMessage('保存成功 ✔', 'success');
    
    // 恢复按钮状态
    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 保存设置';
    }, 1500);
  } catch (error) {
    console.error('Error saving settings:', error);
    showMessage('保存失败，请重试', 'error');
    
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 保存设置';
  }
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'success' 或 'error'
 */
function showMessage(message, type = 'success') {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type} show`;
  
  // 3 秒后自动隐藏
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

/**
 * 切换密码显示/隐藏
 */
function togglePasswordVisibility() {
  const currentType = tokenInput.type;
  
  if (currentType === 'password') {
    tokenInput.type = 'text';
    toggleBtn.textContent = '🙈';
    toggleBtn.title = '隐藏';
  } else {
    tokenInput.type = 'password';
    toggleBtn.textContent = '👁️';
    toggleBtn.title = '显示';
  }
}
