const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 测试配置
const BASE_URL = 'http://localhost:3001';
const tests = [];
let passedTests = 0;
let failedTests = 0;

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试1: 健康检查接口
async function testHealthCheck() {
  log('cyan', '\n[测试1] 健康检查接口');
  log('blue', `GET ${BASE_URL}/api/health`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'ok') {
      log('green', '✓ 健康检查接口正常');
      log('blue', `  响应: ${JSON.stringify(data)}`);
      passedTests++;
      return true;
    } else {
      log('red', '✗ 健康检查接口异常');
      failedTests++;
      return false;
    }
  } catch (error) {
    log('red', `✗ 健康检查失败: ${error.message}`);
    failedTests++;
    return false;
  }
}

// 测试2: 专利查询接口 - 成功案例
async function testPatentQuerySuccess() {
  log('cyan', '\n[测试2] 专利查询接口 - 成功案例');
  log('blue', `POST ${BASE_URL}/api/patent/query`);
  
  const testData = { patentNumber: 'CN123456789A' };
  log('blue', `  请求数据: ${JSON.stringify(testData)}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/patent/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success && data.data) {
      log('green', '✓ 专利查询成功');
      log('blue', `  专利号: ${data.data.patentNumber}`);
      log('blue', `  专利名称: ${data.data.title}`);
      log('blue', `  申请人: ${data.data.applicant}`);
      passedTests++;
      return true;
    } else {
      log('red', '✗ 专利查询失败');
      log('red', `  响应: ${JSON.stringify(data)}`);
      failedTests++;
      return false;
    }
  } catch (error) {
    log('red', `✗ 专利查询异常: ${error.message}`);
    failedTests++;
    return false;
  }
}

// 测试3: 专利查询接口 - 空专利号
async function testPatentQueryEmpty() {
  log('cyan', '\n[测试3] 专利查询接口 - 空专利号');
  log('blue', `POST ${BASE_URL}/api/patent/query`);
  
  const testData = { patentNumber: '' };
  log('blue', `  请求数据: ${JSON.stringify(testData)}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/patent/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error) {
      log('green', '✓ 空专利号验证正常');
      log('blue', `  错误信息: ${data.error}`);
      passedTests++;
      return true;
    } else {
      log('red', '✗ 空专利号验证失败');
      failedTests++;
      return false;
    }
  } catch (error) {
    log('red', `✗ 测试异常: ${error.message}`);
    failedTests++;
    return false;
  }
}

// 测试4: 专利查询接口 - 不存在的专利
async function testPatentQueryNotFound() {
  log('cyan', '\n[测试4] 专利查询接口 - 不存在的专利');
  log('blue', `POST ${BASE_URL}/api/patent/query`);
  
  const testData = { patentNumber: 'INVALID999999' };
  log('blue', `  请求数据: ${JSON.stringify(testData)}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/patent/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (response.status === 404 && data.error) {
      log('green', '✓ 不存在专利处理正常');
      log('blue', `  错误信息: ${data.error}`);
      passedTests++;
      return true;
    } else {
      log('red', '✗ 不存在专利处理失败');
      failedTests++;
      return false;
    }
  } catch (error) {
    log('red', `✗ 测试异常: ${error.message}`);
    failedTests++;
    return false;
  }
}

// 测试5: 测试第二个示例专利
async function testPatentQueryUS() {
  log('cyan', '\n[测试5] 专利查询接口 - 美国专利');
  log('blue', `POST ${BASE_URL}/api/patent/query`);
  
  const testData = { patentNumber: 'US2023000001A1' };
  log('blue', `  请求数据: ${JSON.stringify(testData)}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/patent/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success && data.data) {
      log('green', '✓ 美国专利查询成功');
      log('blue', `  专利号: ${data.data.patentNumber}`);
      log('blue', `  专利名称: ${data.data.title}`);
      passedTests++;
      return true;
    } else {
      log('red', '✗ 美国专利查询失败');
      failedTests++;
      return false;
    }
  } catch (error) {
    log('red', `✗ 测试异常: ${error.message}`);
    failedTests++;
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  log('yellow', '='.repeat(60));
  log('yellow', '专利分析系统 - 后端接口自动化测试');
  log('yellow', '='.repeat(60));
  
  // 等待服务器启动
  log('blue', '\n等待服务器启动...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 运行测试
  await testHealthCheck();
  await testPatentQuerySuccess();
  await testPatentQueryEmpty();
  await testPatentQueryNotFound();
  await testPatentQueryUS();
  
  // 输出测试报告
  log('yellow', '\n' + '='.repeat(60));
  log('yellow', '测试报告');
  log('yellow', '='.repeat(60));
  log('green', `✓ 通过: ${passedTests} 个测试`);
  if (failedTests > 0) {
    log('red', `✗ 失败: ${failedTests} 个测试`);
  }
  log('blue', `总计: ${passedTests + failedTests} 个测试`);
  
  const successRate = ((passedTests / (passedTests + failedTests)) * 100).toFixed(2);
  log('cyan', `成功率: ${successRate}%`);
  log('yellow', '='.repeat(60));
  
  // 退出码
  process.exit(failedTests > 0 ? 1 : 0);
}

// 启动测试
runAllTests().catch(error => {
  log('red', `\n测试运行失败: ${error.message}`);
  process.exit(1);
});
