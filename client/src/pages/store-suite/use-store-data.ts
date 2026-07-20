import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"

export interface SuiteProduct {
  id: string
  shopify_product_id: string
  title: string
  vendor: string | null
  product_type: string | null
  status: string | null
  image_url: string | null
  images: any[]
  variants: any[]
  price: number | null
  compare_at_price: number | null
  inventory_quantity: number | null
}

export interface SuiteOrder {
  id: string
  shopify_order_id: string
  order_number: string
  email: string | null
  financial_status: string | null
  fulfillment_status: string | null
  total_price: number | null
  currency: string
  line_items: any[]
  customer: any | null
  shopify_created_at: string | null
}

export function useStoreProducts(storeId: string | null) {
  const { data, isLoading } = useQuery<{ products: SuiteProduct[] }>({
    queryKey: ["suite-products", storeId],
    queryFn: () => apiFetch(`/api/shopify-stores/${storeId}/products`).then((r) => (r.ok ? r.json() : { products: [] })),
    enabled: !!storeId,
  })
  return { products: data?.products || [], isLoading }
}

export function useStoreOrders(storeId: string | null) {
  const { data, isLoading } = useQuery<{ orders: SuiteOrder[] }>({
    queryKey: ["suite-orders", storeId],
    queryFn: () => apiFetch(`/api/shopify-stores/${storeId}/orders`).then((r) => (r.ok ? r.json() : { orders: [] })),
    enabled: !!storeId,
  })
  return { orders: data?.orders || [], isLoading }
}
