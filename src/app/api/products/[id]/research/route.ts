import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { productResearchService } from '@/lib/services/product-research-service'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string | undefined): boolean {
  return !!id && UUID_REGEX.test(id)
}

// GET /api/products/[id]/research - Get research data for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Fetch research data from database
    const { data, error } = await supabaseAdmin
      .from('product_research')
      .select('*')
      .eq('product_id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No research data found
        return NextResponse.json(
          { research: null },
          { status: 200 }
        )
      }
      console.error('Error fetching research:', error)
      return NextResponse.json(
        { error: 'Failed to fetch research data' },
        { status: 500 }
      )
    }

    return NextResponse.json({ research: data })
  } catch (error) {
    console.error('Error in GET /api/products/[id]/research:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/research - Trigger research for a product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Fetch product data
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select(`
        id,
        title,
        description,
        buy_price,
        sell_price,
        category:categories(name, slug)
      `)
      .eq('id', id)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Research the product
    const researchDataRaw = await productResearchService.researchProduct({
      title: product.title,
      description: product.description,
      buyPrice: product.buy_price,
      sellPrice: product.sell_price,
      category: product.category?.[0]?.name || product.category?.[0]?.slug || undefined,
    })

    // Extract optional category suggestion from research result
    const anyResearch = researchDataRaw as any
    const categorySuggestion = anyResearch?.category_suggestion as
      | { slug?: string; name?: string; confidence?: number }
      | undefined

    // Remove category_suggestion before saving to product_research (no such column)
    if (anyResearch && "category_suggestion" in anyResearch) {
      delete anyResearch.category_suggestion
    }

    const researchData = anyResearch

    // Optionally map suggested category to existing categories and update product.category_id
    if (categorySuggestion && (categorySuggestion.slug || categorySuggestion.name)) {
      try {
        const slug = categorySuggestion.slug?.toLowerCase().trim()
        const name = categorySuggestion.name?.trim()

        let categoryQuery = supabaseAdmin.from("categories").select("id, slug, name")

        if (slug) {
          categoryQuery = categoryQuery.ilike("slug", slug)
        } else if (name) {
          categoryQuery = categoryQuery.ilike("name", name)
        }

        const { data: matchedCategory, error: categoryError } = await categoryQuery.limit(1).maybeSingle()

        if (!categoryError && matchedCategory) {
          const { error: updateError } = await supabaseAdmin
            .from("products")
            .update({ category_id: matchedCategory.id })
            .eq("id", id)

          if (updateError) {
            console.error("Error updating product category from research:", updateError)
          }
        } else if (categoryError) {
          console.error("Error looking up suggested category:", categoryError)
        }
      } catch (err) {
        console.error("Unexpected error applying category suggestion:", err)
      }
    }

    // Save research data to database
    const { data: savedResearch, error: saveError } = await supabaseAdmin
      .from('product_research')
      .upsert({
        product_id: id,
        ...researchData,
        research_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'product_id',
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving research:', saveError)
      return NextResponse.json(
        { error: 'Failed to save research data', details: saveError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Research completed successfully',
      research: savedResearch,
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/products/[id]/research:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

