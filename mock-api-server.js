/**
 * Mock API Server for Mr.π Capture Extension Testing
 *
 * 这是一个简单的Mock API服务器，用于本地测试扩展功能
 * 不需要真实的后端，模拟保存成功的响应
 */

const http = require('http');

const PORT = 3000;
const API_ENDPOINT = '/api/captured-items';

// 存储捕获的数据（内存中，仅用于演示）
const capturedItems = [];

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 设置CORS头，允许Chrome扩展访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 处理POST /api/captured-items
  if (req.method === 'POST' && req.url === API_ENDPOINT) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // 验证Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Unauthorized',
            message: 'Missing or invalid Authorization header'
          }));
          return;
        }

        // 验证必填字段
        if (!data.url || !data.title || !data.tags || data.tags.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Bad Request',
            message: 'Missing required fields: url, title, or tags'
          }));
          return;
        }

        // 创建捕获项
        const capturedItem = {
          id: capturedItems.length + 1,
          url: data.url,
          title: data.title,
          note: data.note || '',
          tags: data.tags,
          source: data.source || 'unknown',
          createdAt: new Date().toISOString()
        };

        // 保存到内存
        capturedItems.push(capturedItem);

        // 在控制台打印接收到的数据
        console.log('\n✅ 接收到新的捕获数据:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📌 ID:      ${capturedItem.id}`);
        console.log(`🔗 URL:     ${capturedItem.url}`);
        console.log(`📝 标题:    ${capturedItem.title}`);
        console.log(`💬 备注:    ${capturedItem.note || '(无)'}`);
        console.log(`🏷️  标签:    ${capturedItem.tags.join(', ')}`);
        console.log(`📱 来源:    ${capturedItem.source}`);
        console.log(`⏰ 时间:    ${capturedItem.createdAt}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // 返回成功响应
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: capturedItem,
          message: 'Item captured successfully'
        }));

      } catch (error) {
        console.error('❌ 解析请求数据失败:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid JSON format'
        }));
      }
    });
  }
  // 处理GET请求 - 查看所有捕获的数据
  else if (req.method === 'GET' && req.url === API_ENDPOINT) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: capturedItems.length,
      data: capturedItems
    }));
  }
  // 健康检查端点
  else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Mock API Server is running',
      itemsCount: capturedItems.length
    }));
  }
  // 404 - 未找到
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `Endpoint ${req.url} not found`
    }));
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log('\n🚀 Mock API Server 已启动！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 监听地址:  http://localhost:${PORT}`);
  console.log(`📬 API端点:   http://localhost:${PORT}${API_ENDPOINT}`);
  console.log(`💚 健康检查:  http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 提示:');
  console.log('1. 保持此终端窗口打开');
  console.log('2. 按 Ctrl+C 停止服务器');
  console.log('3. 服务器会在控制台打印所有接收到的数据\n');
  console.log('⏳ 等待扩展发送数据...\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n👋 正在关闭服务器...');
  console.log(`📊 总共接收了 ${capturedItems.length} 条数据`);
  server.close(() => {
    console.log('✅ 服务器已关闭\n');
    process.exit(0);
  });
});
