const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000'
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@usdrop.ai'
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Admin123!'

interface TestResult {
  endpoint: string
  method: string
  status: number
  ok: boolean
  error?: string
  dataPreview?: string
}

const results: TestResult[] = []

async function getAdminSession(): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to sign in: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const accessToken = data.access_token
  const refreshToken = data.refresh_token

  const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0]
  const cookieName = `sb-${projectRef}-auth-token`
  const cookieValue = encodeURIComponent(JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'bearer',
    expires_in: data.expires_in,
    expires_at: data.expires_at,
  }))

  return `${cookieName}=${cookieValue}`
}

async function testEndpoint(
  cookie: string,
  method: string,
  path: string,
  label?: string
): Promise<TestResult> {
  const url = `${BASE_URL}${path}`
  const displayLabel = label || `${method} ${path}`
  
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
      },
      redirect: 'manual',
    })

    const contentType = res.headers.get('content-type') || ''
    let body: any = null
    let bodyText = ''

    if (contentType.includes('application/json')) {
      bodyText = await res.text()
      try {
        body = JSON.parse(bodyText)
      } catch {
        body = bodyText
      }
    } else {
      bodyText = await res.text()
      body = bodyText.substring(0, 200)
    }

    const result: TestResult = {
      endpoint: displayLabel,
      method,
      status: res.status,
      ok: res.status >= 200 && res.status < 300,
      error: res.status >= 400 ? (body?.error || body?.message || `HTTP ${res.status}`) : undefined,
      dataPreview: res.status < 300 ? summarizeData(body) : bodyText.substring(0, 300),
    }

    return result
  } catch (err: any) {
    return {
      endpoint: displayLabel,
      method,
      status: 0,
      ok: false,
      error: err.message,
    }
  }
}

function summarizeData(data: any): string {
  if (!data) return 'null'
  if (typeof data === 'string') return data.substring(0, 100)
  if (Array.isArray(data)) return `Array[${data.length}]`
  
  const keys = Object.keys(data)
  const summary: string[] = []
  for (const key of keys.slice(0, 5)) {
    const val = data[key]
    if (Array.isArray(val)) summary.push(`${key}: Array[${val.length}]`)
    else if (typeof val === 'object' && val !== null) summary.push(`${key}: {...}`)
    else summary.push(`${key}: ${JSON.stringify(val)}`)
  }
  return `{${summary.join(', ')}}`
}

async function runAllTests() {
  console.log('=== Admin API Endpoint Tests ===\n')
  console.log(`Signing in as ${TEST_ADMIN_EMAIL}...`)
  
  let cookie: string
  try {
    cookie = await getAdminSession()
    console.log('Signed in successfully.\n')
  } catch (err: any) {
    console.error('FATAL: Could not sign in:', err.message)
    process.exit(1)
  }

  const endpoints: [string, string, string?][] = [
    ['GET', '/api/admin/products?page=1&pageSize=5&sortBy=created_at&sortOrder=desc', 'Products list'],
    ['GET', '/api/admin/categories', 'Categories list'],
    ['GET', '/api/admin/internal-users', 'Internal users list'],
    ['GET', '/api/admin/external-users', 'External users list'],
    ['GET', '/api/admin/courses', 'Courses list'],
    ['GET', '/api/admin/competitor-stores', 'Competitor stores list'],
    ['GET', '/api/admin/suppliers', 'Suppliers list'],
    ['GET', '/api/admin/orders', 'Orders list'],
    ['GET', '/api/admin/plans', 'Plans list'],
    ['GET', '/api/admin/shopify-stores', 'Shopify stores list'],
    ['GET', '/api/products?page=1&pageSize=5', 'Public products list'],
    ['GET', '/api/courses', 'Public courses list'],
    ['GET', '/api/auth/user', 'Auth user info'],
  ]

  for (const [method, path, label] of endpoints) {
    const result = await testEndpoint(cookie, method, path, label)
    results.push(result)
    
    const icon = result.ok ? '✅' : '❌'
    const statusStr = result.status > 0 ? `${result.status}` : 'ERR'
    console.log(`${icon} [${statusStr}] ${result.endpoint}`)
    if (!result.ok && result.error) {
      console.log(`   Error: ${result.error.substring(0, 200)}`)
    }
    if (result.ok && result.dataPreview) {
      console.log(`   Data: ${result.dataPreview.substring(0, 150)}`)
    }
  }

  console.log('\n=== SUMMARY ===')
  const passed = results.filter(r => r.ok)
  const failed = results.filter(r => !r.ok)
  console.log(`Total: ${results.length} | Passed: ${passed.length} | Failed: ${failed.length}`)
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED ENDPOINTS:')
    for (const f of failed) {
      console.log(`  - ${f.endpoint} [${f.status}]: ${f.error}`)
    }
  }

  console.log('\n✅ PASSED ENDPOINTS:')
  for (const p of passed) {
    console.log(`  - ${p.endpoint} [${p.status}]`)
  }
}

runAllTests().catch(console.error)
