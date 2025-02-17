import { useState, KeyboardEvent, ComponentPropsWithoutRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

type CodeProps = ComponentPropsWithoutRef<'code'> & { inline?: boolean }
type LinkProps = ComponentPropsWithoutRef<'a'>

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [robotName, setRobotName] = useState('AI助手')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 初始化时从数据库获取名字
  useEffect(() => {
    fetch('/api/robotName')
      .then(res => res.json())
      .then(data => setRobotName(data.name))
      .catch(console.error)
  }, [])

  // 更新数据库中的名字
  const updateRobotName = async (newName: string) => {
    try {
      const res = await fetch('/api/robotName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      })
      if (res.ok) {
        setRobotName(newName)
      }
    } catch (error) {
      console.error('Failed to update robot name:', error)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const newMessages = [...messages, { role: 'user' as const, content: input }]

    // 检查是否是设置名字的命令
    if (input.startsWith('/name ')) {
      const newName = input.slice(6).trim()
      if (newName) {
        await updateRobotName(newName)
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `好的，从现在开始叫我${newName}。`
          }
        ])
        setInput('')
        return
      }
    }

    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-dfbd4efff46b4f40b1678b72c4adc2d8' // 替换为你的 API key
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',  // 使用 deepseek-re 模型
          messages: [
            { role: 'system', content: `你是一个名叫${robotName}的AI助手。` },
            ...newMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
          ],
          temperature: 0.7,  // 添加温度参数
          max_tokens: 2000   // 设置最大 token 数
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.choices && data.choices[0]?.message) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: data.choices[0].message.content
        }])
      } else {
        console.error('Unexpected API response:', data)
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error:', error)
      let errorMessage = '抱歉，我遇到了一些问题，请稍后再试。'
      
      if (error instanceof Error) {
        if (error.message.includes('API request failed')) {
          errorMessage = '抱歉，API 请求失败。请检查网络连接或稍后重试。'
        } else if (error.message.includes('Invalid API response format')) {
          errorMessage = '抱歉，收到了无效的 API 响应。请联系技术支持。'
        } else {
          errorMessage = `发生错误：${error.message}`
        }
      }
      
      setMessages([...newMessages, {
        role: 'assistant',
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 处理按键事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 阻止默认的换行行为
      handleSubmit()
    }
  }

  return (
    <div className="flex-1 mt-16 mb-16">
      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] p-4 flex flex-col">
        {/* 聊天记录区域 */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-white">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg transition-all duration-200 ${
                message.role === 'user' 
                  ? 'bg-primary text-white font-medium'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.role === 'user' ? (
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-800 prose-p:text-gray-800">
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children, ...props }: CodeProps) {
                          return (
                            <code
                              className={`${className || ''} ${
                                inline 
                                  ? 'bg-gray-200 rounded px-1' 
                                  : 'block bg-gray-800 text-gray-100 p-2 rounded-lg overflow-x-auto'
                              }`}
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        },
                        a({ children, ...props }: LinkProps) {
                          return (
                            <a
                              className="text-blue-500 hover:text-blue-600 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            >
                              {children}
                            </a>
                          )
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3">
                正在思考...
              </div>
            </div>
          )}
        </div>
        
        {/* 输入框区域 */}
        <div className="mt-4 relative">
          <textarea 
            className="w-full p-4 pr-12 rounded-2xl border-2 border-primary/20 
            focus:outline-none focus:border-primary/50 focus:ring-2 
            focus:ring-primary/30 resize-none bg-white text-gray-900 
            placeholder:text-gray-500"
            placeholder="发送消息..."
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="absolute right-4 bottom-4 p-3 rounded-xl bg-primary 
            text-white hover:bg-primary/90 disabled:opacity-50 
            transition-all duration-200 hover:scale-105"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 