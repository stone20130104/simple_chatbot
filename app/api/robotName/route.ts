import { NextResponse } from 'next/server'
import postgres from 'postgres'
import { initDB } from '@/lib/db'

const sql = postgres(process.env.DATABASE_URL || '', {
  ssl: 'require',
  max: 1
})

let isInitialized = false

export async function GET() {
  try {
    // 第一次访问时自动初始化数据库
    if (!isInitialized) {
      await initDB()
      isInitialized = true
    }

    const result = await sql`
      SELECT value FROM settings WHERE key = 'robotName';
    `
    return NextResponse.json({ name: result[0]?.value || 'AI助手' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ name: 'AI助手' })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    await sql`
      INSERT INTO settings (key, value)
      VALUES ('robotName', ${name})
      ON CONFLICT (key) DO UPDATE SET value = ${name};
    `
    
    return NextResponse.json({ name })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update name' }, 
      { status: 500 }
    )
  }
} 