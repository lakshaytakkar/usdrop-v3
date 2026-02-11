import { readFileSync } from 'fs'
import { join } from 'path'
import postgres from 'postgres'

async function migrate() {
  const connectionString = process.env.DATABASE_URL!
  const sql = postgres(connectionString)
  
  console.log('Running database migration...')
  
  const schemaPath = join(process.cwd(), 'src/lib/db/schema.sql')
  const schema = readFileSync(schemaPath, 'utf-8')
  
  await sql.unsafe(schema)
  
  console.log('Migration completed successfully!')
  await sql.end()
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
