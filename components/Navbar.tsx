export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI Chat
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              登录
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90">
              注册
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 