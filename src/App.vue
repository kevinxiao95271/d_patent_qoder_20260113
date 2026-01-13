<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🔬 专利深度分析系统</h1>
      <p class="subtitle">基于AI的专利智能挖掘与深度思考</p>
    </header>

    <div class="main-content">
      <!-- 会话列表侧边栏 -->
      <aside class="sessions-sidebar" :class="{ collapsed: !showSidebar }">
        <div class="sidebar-header">
          <h3>会话历史</h3>
          <button @click="createNewSession" class="new-session-btn">
            ➕ 新建会话
          </button>
        </div>
        <div class="sessions-list">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="session-item"
            :class="{ active: currentSessionId === session.id }"
            @click="switchSession(session.id)"
          >
            <div class="session-info">
              <div class="session-title">{{ session.title }}</div>
              <div class="session-time">{{ formatTime(session.createdAt) }}</div>
            </div>
            <button @click.stop="deleteSession(session.id)" class="delete-btn">🗑️</button>
          </div>
        </div>
        
        <!-- 左下角快速查询 -->
        <div class="quick-query-box">
          <h4>🔍 快速查询</h4>
          <input
            v-model="quickPatentId"
            @keyup.enter="quickQuery"
            type="text"
            placeholder="输入专利号"
            class="quick-input"
          />
          <button @click="quickQuery" class="quick-query-btn" :disabled="isQuickQuerying">
            {{ isQuickQuerying ? '查询...' : '查询' }}
          </button>
          <div v-if="quickResult" class="quick-result">
            <div class="result-title">✅ {{ quickResult.title }}</div>
            <div class="result-info">
              <span>🏢 {{ quickResult.applicant }}</span>
              <span>📅 {{ quickResult.publicationDate }}</span>
            </div>
            <button @click="useQuickResult" class="use-result-btn">
              → 使用此专利
            </button>
          </div>
          <div v-if="quickError" class="quick-error">
            ⚠️ {{ quickError }}
          </div>
        </div>
        
        <button @click="showSidebar = !showSidebar" class="toggle-sidebar-btn">
          {{ showSidebar ? '◀' : '▶' }}
        </button>
      </aside>

      <!-- 主工作区 -->
      <main class="work-area">
        <!-- 专利查询区域 -->
        <section class="query-section">
          <div class="input-group">
            <input
              v-model="patentNumber"
              @keyup.enter="queryPatent"
              type="text"
              placeholder="请输入专利号（如：CN123456789A、CN202310123456.7、CN112345678B、US2023000001A1）"
              class="patent-input"
              :disabled="isQuerying"
            />
            <button @click="queryPatent" class="query-btn" :disabled="isQuerying">
              {{ isQuerying ? '查询中...' : '🔍 查询专利' }}
            </button>
          </div>
          <div class="tips-message">
            <span>💡 示例专利号：</span>
            <button @click="patentNumber = 'CN123456789A'" class="tip-btn">CN123456789A</button>
            <button @click="patentNumber = 'CN202310123456.7'" class="tip-btn">CN202310123456.7</button>
            <button @click="patentNumber = 'CN112345678B'" class="tip-btn">CN112345678B</button>
            <button @click="patentNumber = 'US2023000001A1'" class="tip-btn">US2023000001A1</button>
          </div>
          <div v-if="error" class="error-message">⚠️ {{ error }}</div>
        </section>

        <!-- 专利信息摘要 -->
        <section v-if="patentData" class="patent-summary">
          <h2 class="section-title">📄 专利摘要</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <label>专利号：</label>
              <span>{{ patentData.patentNumber }}</span>
            </div>
            <div class="summary-item">
              <label>专利名称：</label>
              <span class="highlight">{{ patentData.title }}</span>
            </div>
            <div class="summary-item">
              <label>申请人：</label>
              <span>{{ patentData.applicant }}</span>
            </div>
            <div class="summary-item">
              <label>发明人：</label>
              <span>{{ patentData.inventor }}</span>
            </div>
            <div class="summary-item">
              <label>申请日期：</label>
              <span>{{ patentData.applicationDate }}</span>
            </div>
            <div class="summary-item">
              <label>公开日期：</label>
              <span>{{ patentData.publicationDate }}</span>
            </div>
            <div class="summary-item full-width">
              <label>摘要：</label>
              <p>{{ patentData.abstract }}</p>
            </div>
          </div>

          <!-- 分析类型选择 -->
          <div class="analysis-type-selector">
            <label>选择分析类型：</label>
            <div class="type-buttons">
              <button
                v-for="type in analysisTypes"
                :key="type.value"
                @click="selectedAnalysisType = type.value"
                :class="{ active: selectedAnalysisType === type.value }"
                class="type-btn"
              >
                {{ type.label }}
              </button>
            </div>
            <button @click="startAnalysis" class="analyze-btn" :disabled="isAnalyzing">
              {{ isAnalyzing ? '分析中...' : '🚀 开始深度分析' }}
            </button>
          </div>
        </section>

        <!-- 分析进度和结果 -->
        <section v-if="showAnalysis" class="analysis-section">
          <h2 class="section-title">🧠 AI深度分析</h2>
          
          <!-- 进度条 -->
          <div v-if="isAnalyzing" class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-info">
              <span class="progress-text">{{ progressMessage }}</span>
              <span class="progress-percent">{{ progress }}%</span>
            </div>
            <div class="loading-animation">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>

          <!-- 分析结果 -->
          <div v-if="analysisResult" class="analysis-result">
            <div class="result-content" v-html="formatAnalysisResult(analysisResult)"></div>
          </div>

          <!-- 流式输出中的内容 -->
          <div v-if="streamingContent" class="streaming-content">
            <div class="result-content" v-html="formatAnalysisResult(streamingContent)"></div>
            <div class="streaming-indicator">✍️ AI正在思考...</div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    // 状态管理
    const patentNumber = ref('')
    const patentData = ref(null)
    const isQuerying = ref(false)
    const error = ref('')
    
    const isAnalyzing = ref(false)
    const showAnalysis = ref(false)
    const progress = ref(0)
    const progressMessage = ref('')
    const analysisResult = ref('')
    const streamingContent = ref('')
    
    const selectedAnalysisType = ref('comprehensive')
    const analysisTypes = [
      { label: '🔬 全面分析', value: 'comprehensive' },
      { label: '⚙️ 技术分析', value: 'technical' },
      { label: '💼 商业分析', value: 'business' },
      { label: '⚖️ 法律分析', value: 'legal' }
    ]

    // 会话管理
    const sessions = ref([])
    const currentSessionId = ref(null)
    const showSidebar = ref(true)
    
    // 快速查询状态
    const quickPatentId = ref('')
    const quickResult = ref(null)
    const quickError = ref('')
    const isQuickQuerying = ref(false)

    // 查询专利
    const queryPatent = async () => {
      if (!patentNumber.value.trim()) {
        error.value = '请输入专利号'
        return
      }

      isQuerying.value = true
      error.value = ''
      patentData.value = null
      showAnalysis.value = false
      analysisResult.value = ''

      try {
        const response = await axios.post('/api/patent/query', {
          patentNumber: patentNumber.value.trim()
        })

        if (response.data.success) {
          patentData.value = response.data.data
          
          // 更新当前会话
          if (currentSessionId.value) {
            const session = sessions.value.find(s => s.id === currentSessionId.value)
            if (session) {
              session.title = `${patentData.value.patentNumber} - ${patentData.value.title.substring(0, 20)}...`
              session.patentData = patentData.value
            }
          }
        }
      } catch (err) {
        error.value = err.response?.data?.error || '查询失败，请检查网络连接'
      } finally {
        isQuerying.value = false
      }
    }

    // 开始分析
    const startAnalysis = async () => {
      if (!patentData.value) {
        error.value = '请先查询专利信息'
        return
      }

      isAnalyzing.value = true
      showAnalysis.value = true
      progress.value = 0
      progressMessage.value = '初始化...'
      analysisResult.value = ''
      streamingContent.value = ''

      try {
        const response = await fetch('/api/patent/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            patentData: patentData.value,
            analysisType: selectedAnalysisType.value
          })
        })

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = '' // 添加buffer处理不完整的消息

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log('流读取完成')
            // 处理buffer中剩余的数据
            if (buffer.trim()) {
              console.log('处理剩余buffer:', buffer.substring(0, 100))
              if (buffer.startsWith('data: ')) {
                try {
                  const data = JSON.parse(buffer.slice(6))
                  if (data.stage === 'done') {
                    console.log('收到完成信号, fullContent长度:', data.fullContent?.length)
                    analysisResult.value = data.fullContent || streamingContent.value
                    streamingContent.value = ''
                    isAnalyzing.value = false
                  }
                } catch (e) {
                  console.error('解析剩余buffer错误:', e)
                }
              }
            }
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || '' // 保留最后一个不完整的消息

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.stage === 'error') {
                  error.value = data.error
                  isAnalyzing.value = false
                  return
                }

                progress.value = data.progress || progress.value
                progressMessage.value = data.message || progressMessage.value

                if (data.content) {
                  streamingContent.value += data.content
                }

                if (data.stage === 'done') {
                  console.log('在循环中收到完成信号, fullContent长度:', data.fullContent?.length)
                  analysisResult.value = data.fullContent || streamingContent.value
                  streamingContent.value = ''
                  isAnalyzing.value = false
                  
                  // 保存到会话
                  if (currentSessionId.value) {
                    const session = sessions.value.find(s => s.id === currentSessionId.value)
                    if (session) {
                      session.analysisResult = analysisResult.value
                      session.analysisType = selectedAnalysisType.value
                    }
                  }
                }
              } catch (e) {
                console.error('解析JSON错误:', e, '原始数据:', line.substring(0, 100))
              }
            }
          }
        }
      } catch (err) {
        error.value = '分析失败: ' + err.message
        isAnalyzing.value = false
      }
    }

    // 格式化分析结果
    const formatAnalysisResult = (text) => {
      if (!text) return ''
      
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
        .replace(/(\d+\.)\s/g, '<br><strong>$1</strong> ')
    }

    // 会话管理
    const createNewSession = () => {
      const newSession = {
        id: Date.now().toString(),
        title: '新建会话 ' + (sessions.value.length + 1),
        createdAt: new Date(),
        patentData: null,
        analysisResult: '',
        analysisType: 'comprehensive'
      }
      sessions.value.unshift(newSession)
      currentSessionId.value = newSession.id
      
      // 重置界面
      patentNumber.value = ''
      patentData.value = null
      analysisResult.value = ''
      showAnalysis.value = false
      error.value = ''
    }

    const switchSession = (sessionId) => {
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        currentSessionId.value = sessionId
        patentData.value = session.patentData
        analysisResult.value = session.analysisResult
        selectedAnalysisType.value = session.analysisType || 'comprehensive'
        showAnalysis.value = !!session.analysisResult
        streamingContent.value = ''
        error.value = ''
      }
    }

    const deleteSession = (sessionId) => {
      if (confirm('确定要删除这个会话吗？')) {
        sessions.value = sessions.value.filter(s => s.id !== sessionId)
        if (currentSessionId.value === sessionId) {
          if (sessions.value.length > 0) {
            switchSession(sessions.value[0].id)
          } else {
            createNewSession()
          }
        }
      }
    }

    const formatTime = (date) => {
      const d = new Date(date)
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
    }
    
    // 快速查询功能
    const quickQuery = async () => {
      if (!quickPatentId.value.trim()) {
        quickError.value = '请输入专利号'
        return
      }
      
      isQuickQuerying.value = true
      quickError.value = ''
      quickResult.value = null
      
      try {
        const response = await axios.post('/api/patent/query', {
          patentNumber: quickPatentId.value.trim()
        })
        
        if (response.data.success) {
          quickResult.value = response.data.data
        }
      } catch (err) {
        quickError.value = err.response?.data?.error || '查询失败'
      } finally {
        isQuickQuerying.value = false
      }
    }
    
    // 使用快速查询结果
    const useQuickResult = () => {
      if (quickResult.value) {
        patentNumber.value = quickResult.value.patentNumber
        patentData.value = quickResult.value
        
        // 更新当前会话
        if (currentSessionId.value) {
          const session = sessions.value.find(s => s.id === currentSessionId.value)
          if (session) {
            session.title = `${quickResult.value.patentNumber} - ${quickResult.value.title.substring(0, 20)}...`
            session.patentData = quickResult.value
          }
        }
        
        // 清空快速查询
        quickPatentId.value = ''
        quickResult.value = null
        quickError.value = ''
      }
    }

    // 初始化
    onMounted(() => {
      createNewSession()
    })

    return {
      patentNumber,
      patentData,
      isQuerying,
      error,
      queryPatent,
      isAnalyzing,
      showAnalysis,
      progress,
      progressMessage,
      analysisResult,
      streamingContent,
      startAnalysis,
      selectedAnalysisType,
      analysisTypes,
      formatAnalysisResult,
      sessions,
      currentSessionId,
      showSidebar,
      createNewSession,
      switchSession,
      deleteSession,
      formatTime,
      quickPatentId,
      quickResult,
      quickError,
      isQuickQuerying,
      quickQuery,
      useQuickResult
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 2.5em;
  color: #667eea;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1em;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
}

/* 侧边栏样式 */
.sessions-sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
}

.sessions-sidebar.collapsed {
  width: 50px;
  padding: 20px 10px;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar-header h3 {
  color: #667eea;
  margin-bottom: 15px;
}

.new-session-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: transform 0.2s;
}

.new-session-btn:hover {
  transform: translateY(-2px);
}

.sessions-list {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  flex: 1;
  margin-bottom: 15px;
}

.session-item {
  padding: 15px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.session-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.session-info {
  flex: 1;
  overflow: hidden;
}

.session-title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.session-time {
  font-size: 0.85em;
  opacity: 0.8;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

/* 快速查询框 */
.quick-query-box {
  margin-top: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  margin-bottom: 15px;
}

.quick-query-box h4 {
  color: #667eea;
  margin-bottom: 12px;
  font-size: 1em;
}

.quick-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9em;
  margin-bottom: 10px;
  transition: border-color 0.3s;
}

.quick-input:focus {
  outline: none;
  border-color: #667eea;
}

.quick-query-btn {
  width: 100%;
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95em;
  transition: all 0.2s;
}

.quick-query-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
}

.quick-query-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.quick-result {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.9em;
  line-height: 1.4;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.result-info span {
  font-size: 0.85em;
  color: #666;
}

.use-result-btn {
  width: 100%;
  padding: 8px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  transition: all 0.2s;
}

.use-result-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(240, 147, 251, 0.3);
}

.quick-error {
  margin-top: 10px;
  padding: 8px;
  background: #fff3cd;
  color: #856404;
  border-radius: 5px;
  font-size: 0.85em;
  border-left: 3px solid #ffc107;
}

.toggle-sidebar-btn {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 60px;
  background: white;
  border: 2px solid #667eea;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 1.2em;
  color: #667eea;
}

/* 工作区样式 */
.work-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.query-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  gap: 15px;
}

.patent-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1em;
  transition: border-color 0.3s;
}

.patent-input:focus {
  outline: none;
  border-color: #667eea;
}

.query-btn {
  padding: 15px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  cursor: pointer;
  transition: transform 0.2s;
  white-space: nowrap;
}

.query-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.query-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 15px;
  background: #fff3cd;
  color: #856404;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.tips-message {
  margin-top: 15px;
  padding: 15px;
  background: #e7f3ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tips-message span {
  color: #0066cc;
  font-weight: 500;
}

.tip-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid #667eea;
  border-radius: 5px;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.tip-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

/* 专利摘要样式 */
.patent-summary {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #667eea;
  font-size: 1.8em;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.summary-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item.full-width {
  grid-column: 1 / -1;
}

.summary-item label {
  font-weight: 600;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.summary-item span,
.summary-item p {
  color: #333;
  line-height: 1.6;
}

.summary-item .highlight {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1em;
}

/* 分析类型选择 */
.analysis-type-selector {
  margin-top: 30px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
}

.analysis-type-selector label {
  font-weight: 600;
  color: #666;
  display: block;
  margin-bottom: 15px;
}

.type-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.type-btn {
  padding: 12px 24px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1em;
}

.type-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.type-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.analyze-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 分析区域样式 */
.analysis-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.progress-container {
  margin-bottom: 30px;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.progress-text {
  color: #666;
  font-weight: 500;
}

.progress-percent {
  color: #667eea;
  font-weight: 600;
  font-size: 1.2em;
}

.loading-animation {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
}

.dot {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.analysis-result,
.streaming-content {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
  line-height: 1.8;
}

.result-content {
  color: #333;
  font-size: 1.05em;
}

.result-content :deep(strong) {
  color: #667eea;
  font-size: 1.1em;
}

.result-content :deep(p) {
  margin-bottom: 15px;
}

.streaming-indicator {
  margin-top: 20px;
  text-align: center;
  color: #667eea;
  font-style: italic;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sessions-sidebar {
    width: 100%;
  }

  .input-group {
    flex-direction: column;
  }

  .type-buttons {
    flex-direction: column;
  }
}
</style>
