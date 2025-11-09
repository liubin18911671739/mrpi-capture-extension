/**
 * background.js - Service Worker for Mr.π Capture Extension
 * 
 * Manifest V3 使用 Service Worker 替代传统的 background page
 * 这里可以监听扩展事件，处理跨页面的逻辑
 */

// 扩展安装或更新时触发
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Mr.π Capture Extension installed:', details.reason);
  
  // 首次安装时，可以设置默认值或打开欢迎页面
  if (details.reason === 'install') {
    console.log('First time installation');
    // 可以在这里打开 options 页面引导用户配置 Token
    // chrome.runtime.openOptionsPage();
  } else if (details.reason === 'update') {
    console.log('Extension updated to version:', chrome.runtime.getManifest().version);
  }
});

// 监听来自 popup 或 content script 的消息（扩展点）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  // 示例：处理特定类型的消息
  if (request.action === 'ping') {
    sendResponse({ status: 'pong' });
  }
  
  // 如果需要异步处理，记得 return true
  // return true;
});

// 扩展图标点击事件（如果不使用 popup，可以在这里处理）
// chrome.action.onClicked.addListener((tab) => {
//   console.log('Extension icon clicked on tab:', tab.id);
// });

console.log('Mr.π Capture background service worker loaded');
