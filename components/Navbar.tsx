export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-lg border-b border-primary/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              AI Chat
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 rounded-xl text-primary hover:bg-primary/10 transition-all duration-200">
              登录
            </button>
            <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-200 hover:scale-105">
              注册
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 