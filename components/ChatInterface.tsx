import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return

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

  return (
    <div className="flex-1 mt-16 mb-16">
      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] p-4 flex flex-col">
        {/* 聊天记录区域 */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'
              }`}>
                {message.content}
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
            className="w-full p-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="输入您的问题..."
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <button 
            className="absolute right-4 bottom-4 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 