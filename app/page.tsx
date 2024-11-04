'use client'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import ChatInterface from '@/components/ChatInterface'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`min-h-screen flex flex-col ${inter.className}`}>
      <Navbar />
      <ChatInterface />
      <Footer />
    </main>
  )
}
