import { useState, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { CodeProps } from 'react-markdown/lib/ast-to-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    // 添加用户消息
    const newMessages = [...messages, { role: 'user' as const, content: input }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-dfbd4efff46b4f40b1678b72c4adc2d8'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: newMessages
        })
      })

      const data = await response.json()
      
      // 添加AI回复
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.choices[0].message.content
      }])
    } catch (error) {
      console.error('Error:', error)
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
                        // 自定义代码块样式
                        code({ inline, className, children, ...props }: CodeProps) {
                          return (
                            <code
                              className={`${className} ${
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
                        // 自定义链接样式
                        a({ node, className, children, ...props }) {
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