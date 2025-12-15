import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Test endpoint to debug Supabase connection
export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    console.log('Key prefix:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
    
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, internal_role')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        details: error,
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      data,
      message: 'Supabase connection working!'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

