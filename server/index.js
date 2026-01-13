import express from 'express';
import cors from 'cors';
import { fetch } from 'undici';

const app = express();
const PORT = 3001;

// DeepSeek API配置（腾讯云）
const DEEPSEEK_API_KEY = 'sk-RgBdvxShdSohrZ6fSQCHvogvx73GISS7vtNhlWgTOGNETRI6';
const DEEPSEEK_API_URL = 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';

app.use(cors());
app.use(express.json());

// 模拟专利数据库（实际应对接真实专利API）
const mockPatentData = {
  'CN123456789A': {
    patentNumber: 'CN123456789A',
    title: '一种基于人工智能的图像识别系统及方法',
    abstract: '本发明公开了一种基于人工智能的图像识别系统及方法，包括图像采集模块、预处理模块、特征提取模块、深度学习模块和识别结果输出模块。该系统通过卷积神经网络对图像进行深度学习和特征提取，实现高精度的图像识别。本发明可广泛应用于安防监控、自动驾驶、医疗影像分析等领域。',
    applicant: '某某科技有限公司',
    inventor: '张三;李四;王五',
    applicationDate: '2023-01-15',
    publicationDate: '2023-06-20',
    ipcClassification: 'G06K9/62',
    claims: [
      '1. 一种基于人工智能的图像识别系统，其特征在于，包括：图像采集模块、预处理模块、特征提取模块、深度学习模块和识别结果输出模块。',
      '2. 根据权利要求1所述的图像识别系统，其特征在于，所述深度学习模块采用卷积神经网络架构。',
      '3. 根据权利要求2所述的图像识别系统，其特征在于，所述卷积神经网络包括多个卷积层、池化层和全连接层。'
    ],
    description: '本发明涉及人工智能技术领域，特别涉及一种基于深度学习的图像识别系统。随着人工智能技术的快速发展，图像识别技术在各个领域得到广泛应用...'
  },
  'US2023000001A1': {
    patentNumber: 'US2023000001A1',
    title: 'Method and System for Blockchain-based Data Security',
    abstract: 'The present invention discloses a blockchain-based data security method and system, comprising distributed ledger, encryption module, consensus mechanism, and verification module.',
    applicant: 'Tech Innovation Inc.',
    inventor: 'John Smith; Jane Doe',
    applicationDate: '2022-08-10',
    publicationDate: '2023-02-15',
    ipcClassification: 'G06F21/60',
    claims: [
      '1. A blockchain-based data security system comprising: a distributed ledger, an encryption module, a consensus mechanism, and a verification module.',
      '2. The system of claim 1, wherein the encryption module uses advanced encryption standard (AES).'
    ],
    description: 'The present invention relates to the field of data security...'
  },
  'CN202310123456.7': {
    patentNumber: 'CN202310123456.7',
    title: '一种智能家居控制系统',
    abstract: '本发明提供了一种智能家居控制系统，包括中央控制器、智能设备、传感器网络和人机交互界面。该系统能够实现家庭设备的智能化管理和控制，提高生活质量和能源利用效率。',
    applicant: '智能科技股份有限公司',
    inventor: '王五;赵六;孙七',
    applicationDate: '2023-03-15',
    publicationDate: '2023-09-20',
    ipcClassification: 'G05B15/02',
    claims: [
      '1. 一种智能家居控制系统，其特征在于，包括：中央控制器、多个智能设备和传感器网络。',
      '2. 根据权利要求1所述的智能家居控制系统，其特征在于，所述中央控制器支持语音和APP控制。'
    ],
    description: '本发明涉及智能家居领域，特别是一种集成多种控制方式的智能家居系统...'
  },
  'CN112345678B': {
    patentNumber: 'CN112345678B',
    title: '一种新能源汽车电池管理系统',
    abstract: '本发明公开了一种新能源汽车电池管理系统，包括电池组、电池管理单元BMS、热管理系统和充电控制系统。该系统能够实现电池的精准监控、智能充电和安全防护，延长电池使用寿命。',
    applicant: '电动汽车有限公司',
    inventor: '周八;吴九;郑十',
    applicationDate: '2020-11-20',
    publicationDate: '2021-05-25',
    ipcClassification: 'H01M10/42',
    claims: [
      '1. 一种新能源汽车电池管理系统，其特征在于，包括电池组、BMS、热管理系统和充电控制系统。',
      '2. 根据权利要求1所述的电池管理系统，其特征在于，BMS采用分布式架构。'
    ],
    description: '本发明涉及新能源汽车技术，特别是一种高效安全的电池管理方案...'
  }
};

// 专利查询接口
app.post('/api/patent/query', async (req, res) => {
  try {
    const { patentNumber } = req.body;
    
    console.log('收到专利查询请求:', patentNumber);
    
    if (!patentNumber) {
      return res.status(400).json({ error: '专利号不能为空' });
    }

    // 模拟查询延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 查询专利数据（不区分大小写）
    const normalizedPatentNumber = patentNumber.toUpperCase().trim();
    const patentData = mockPatentData[patentNumber] || mockPatentData[normalizedPatentNumber];
    
    if (!patentData) {
      console.log('未找到专利:', patentNumber, '(规范化:', normalizedPatentNumber, ')');
      console.log('可用的专利号:', Object.keys(mockPatentData).join(', '));
      return res.status(404).json({ 
        error: '未找到该专利信息，请检查专利号是否正确',
        availablePatents: ['CN123456789A', 'US2023000001A1', 'CN202310123456.7', 'CN112345678B']
      });
    }
    
    console.log('查询成功:', patentData.patentNumber);

    res.json({
      success: true,
      data: patentData
    });
  } catch (error) {
    console.error('专利查询错误:', error);
    res.status(500).json({ error: '查询失败，请稍后重试' });
  }
});

// DeepSeek分析接口
app.post('/api/patent/analyze', async (req, res) => {
  try {
    const { patentData, analysisType } = req.body;

    if (!patentData) {
      return res.status(400).json({ error: '专利数据不能为空' });
    }

    // 设置响应头以支持流式输出
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 构建分析提示词
    const prompt = buildAnalysisPrompt(patentData, analysisType);

    // 发送进度更新
    const sendProgress = (stage, progress, message) => {
      res.write(`data: ${JSON.stringify({ stage, progress, message })}\n\n`);
    };

    sendProgress('preparing', 10, '准备分析...');
    await new Promise(resolve => setTimeout(resolve, 500));

    sendProgress('calling_ai', 30, '调用DeepSeek AI...');
    
    console.log('DeepSeek API URL:', DEEPSEEK_API_URL);
    console.log('API Key 前6位:', DEEPSEEK_API_KEY.substring(0, 6) + '...');

    // 调用DeepSeek API（增加超时配置）
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 120秒超时
    
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-r1',
          messages: [
            {
              role: 'system',
              content: '你是一位资深的专利分析专家，擅长从技术、商业和法律角度深度分析专利。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          stream: true
        }),
        signal: controller.signal,
        // undici 特定配置
        headersTimeout: 60000, // 等待响应头的超时时间（60秒）
        bodyTimeout: 120000    // 等待响应体的超时时间（120秒）
      });
      
      clearTimeout(timeout);
      
      sendProgress('analyzing', 50, '正在分析专利内容...');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API错误:', response.status, errorText);
        throw new Error(`DeepSeek API错误: ${response.status} - ${errorText}`);
      }

      let fullContent = '';
      
      if (!response.body) {
        console.error('无响应体');
        res.write(`data: ${JSON.stringify({ stage: 'error', error: '无响应数据' })}\n\n`);
        res.end();
        return;
      }
      
      console.log('DeepSeek API响应成功，开始流式读取...');
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      try {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('流读取完成');
            break;
          }
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个不完整的行
          
          for (const line of lines) {
            if (line.trim() && line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                console.log('收到 [DONE] 信号');
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  fullContent += content;
                  res.write(`data: ${JSON.stringify({ 
                    stage: 'streaming', 
                    progress: 70, 
                    content: content,
                    fullContent: fullContent 
                  })}\n\n`);
                }
              } catch (e) {
                // 忽略无效JSON
              }
            }
          }
        }
      } catch (streamError) {
        console.error('流读取错误:', streamError);
        res.write(`data: ${JSON.stringify({ stage: 'error', error: '流中断: ' + streamError.message })}\n\n`);
      }

      sendProgress('completing', 95, '分析完成');
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('准备发送完成消息, fullContent 长度:', fullContent.length);
      res.write(`data: ${JSON.stringify({ 
        stage: 'done', 
        progress: 100, 
        message: '分析完成',
        fullContent: fullContent
      })}\n\n`);
      console.log('完成消息已发送');
      
      res.end();
      console.log('响应已结束');
      
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error('Fetch错误:', fetchError);
      if (fetchError.name === 'AbortError') {
        res.write(`data: ${JSON.stringify({ stage: 'error', error: '请求超时，请稍后重试' })}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify({ stage: 'error', error: fetchError.message || 'API调用失败' })}\n\n`);
      }
      res.end();
    }
  } catch (error) {
    console.error('DeepSeek分析错误:', error);
    res.write(`data: ${JSON.stringify({ 
      stage: 'error', 
      error: error.message || '分析失败，请稍后重试' 
    })}\n\n`);
    res.end();
  }
});

// 构建分析提示词
function buildAnalysisPrompt(patentData, analysisType = 'comprehensive') {
  const baseInfo = `
专利号：${patentData.patentNumber}
专利名称：${patentData.title}
申请人：${patentData.applicant}
发明人：${patentData.inventor}
申请日期：${patentData.applicationDate}
公开日期：${patentData.publicationDate}
IPC分类：${patentData.ipcClassification}

摘要：
${patentData.abstract}

权利要求：
${patentData.claims.join('\n')}
`;

  const prompts = {
    comprehensive: `请对以下专利进行全面深度分析：

${baseInfo}

请从以下维度进行详细分析：
1. **技术创新点分析**：识别核心技术创新，分析技术优势和突破点
2. **技术实现路径**：分析技术方案的实现方式和关键技术环节
3. **应用场景分析**：探讨可能的应用领域和商业价值
4. **技术发展趋势**：分析该技术在行业中的地位和未来发展方向
5. **潜在改进方向**：提出可能的技术改进和优化建议
6. **专利保护范围**：分析权利要求的保护强度和范围
7. **竞争态势分析**：分析可能的竞争专利和技术壁垒
8. **风险评估**：识别潜在的技术风险和法律风险

请提供专业、深入、结构化的分析报告。`,

    technical: `请对以下专利进行技术深度分析：

${baseInfo}

重点分析：
1. 核心技术原理和创新点
2. 技术实现的关键步骤
3. 技术方案的优缺点
4. 与现有技术的对比
5. 技术改进和优化建议`,

    business: `请对以下专利进行商业价值分析：

${baseInfo}

重点分析：
1. 市场应用前景
2. 商业化可行性
3. 目标客户群体
4. 盈利模式分析
5. 市场竞争态势`,

    legal: `请对以下专利进行法律保护分析：

${baseInfo}

重点分析：
1. 权利要求的保护范围
2. 专利的稳定性评估
3. 潜在的侵权风险
4. 规避设计的可能性
5. 专利布局建议`
  };

  return prompts[analysisType] || prompts.comprehensive;
}

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ 服务器启动成功！`);
  console.log(`🚀 API服务运行在: http://localhost:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
});
