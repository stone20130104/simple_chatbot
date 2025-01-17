import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL || '', {
  ssl: 'require',
  max: 1
})

export async function initDB() {
  try {
    console.log('Connecting to database...')
    
    // 创建表
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `
    console.log('Settings table created or already exists')
    
    // 插入默认机器人名字
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('robotName', 'AI助手')
      ON CONFLICT (key) DO NOTHING;
    `
    console.log('Default robot name initialized')
    
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
} 