/**
 * Update category images in database via API endpoint
 */

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function updateCategoryImages() {
  console.log('🔄 Updating category images in database...\n')
  console.log(`API URL: ${API_URL}/api/categories/update-images\n`)
  
  try {
    const response = await fetch(`${API_URL}/api/categories/update-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`✗ API Error: ${response.status} ${response.statusText}`)
      console.error(`  ${error}`)
      process.exit(1)
    }

    const data = await response.json()
    
    console.log(`✅ ${data.message}`)
    console.log(`\n📊 Summary:`)
    console.log(`   Total: ${data.summary.total}`)
    console.log(`   ✓ Success: ${data.summary.success}`)
    console.log(`   ✗ Errors: ${data.summary.errors}`)
    
    if (data.summary.errors > 0) {
      console.log(`\n❌ Failed categories:`)
      data.results
        .filter((r: any) => !r.success)
        .forEach((r: any) => {
          console.log(`   - ${r.slug}: ${r.error}`)
        })
    }
    
    if (data.summary.success > 0) {
      console.log(`\n✅ Successfully updated categories:`)
      data.results
        .filter((r: any) => r.success)
        .forEach((r: any) => {
          console.log(`   - ${r.slug}`)
        })
    }
  } catch (error) {
    console.error('✗ Error calling API:', error)
    console.error('\n💡 Make sure your Next.js dev server is running:')
    console.error('   npm run dev')
    process.exit(1)
  }
}

updateCategoryImages()

