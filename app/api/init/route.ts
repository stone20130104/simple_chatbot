import { initDB } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await initDB()
    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
  }
} 