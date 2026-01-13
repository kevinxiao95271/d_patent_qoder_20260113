import http from 'http';

console.log('\n========================================');
console.log('后端接口快速测试');
console.log('========================================\n');

// 测试配置
const tests = [
  {
    name: '健康检查接口',
    method: 'GET',
    path: '/api/health',
    expectedStatus: 200
  },
  {
    name: '专利查询接口 - CN专利',
    method: 'POST',
    path: '/api/patent/query',
    body: { patentNumber: 'CN123456789A' },
    expectedStatus: 200
  },
  {
    name: '专利查询接口 - US专利',
    method: 'POST',
    path: '/api/patent/query',
    body: { patentNumber: 'US2023000001A1' },
    expectedStatus: 200
  },
  {
    name: '专利查询接口 - 空参数验证',
    method: 'POST',
    path: '/api/patent/query',
    body: { patentNumber: '' },
    expectedStatus: 400
  },
  {
    name: '专利查询接口 - 不存在的专利',
    method: 'POST',
    path: '/api/patent/query',
    body: { patentNumber: 'INVALID999' },
    expectedStatus: 404
  }
];

let passed = 0;
let failed = 0;

function makeRequest(test) {
  return new Promise((resolve) => {
    const postData = test.body ? JSON.stringify(test.body) : '';
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = res.statusCode === test.expectedStatus;
        
        if (success) {
          console.log(`✓ ${test.name}`);
          console.log(`  状态码: ${res.statusCode} (期望: ${test.expectedStatus})`);
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.data && parsed.data.title) {
              console.log(`  专利名称: ${parsed.data.title}`);
            } else if (parsed.error) {
              console.log(`  错误信息: ${parsed.error}`);
            } else if (parsed.status) {
              console.log(`  状态: ${parsed.status}`);
            }
          } catch (e) {
            // 忽略解析错误
          }
          
          passed++;
        } else {
          console.log(`✗ ${test.name}`);
          console.log(`  状态码: ${res.statusCode} (期望: ${test.expectedStatus})`);
          failed++;
        }
        console.log('');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`✗ ${test.name}`);
      console.log(`  错误: ${e.message}`);
      console.log('');
      failed++;
      resolve();
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('开始测试...\n');
  
  for (const test of tests) {
    await makeRequest(test);
  }
  
  console.log('========================================');
  console.log('测试结果汇总');
  console.log('========================================');
  console.log(`✓ 通过: ${passed} 个`);
  console.log(`✗ 失败: ${failed} 个`);
  console.log(`总计: ${passed + failed} 个`);
  console.log(`成功率: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
  console.log('========================================\n');
  
  if (failed === 0) {
    console.log('🎉 所有测试通过！后端接口运行正常。\n');
  } else {
    console.log('⚠️  部分测试失败，请检查服务器状态。\n');
  }
}

// 等待一下再开始测试
setTimeout(() => {
  runTests().catch(err => {
    console.error('测试执行出错:', err);
  });
}, 1000);
