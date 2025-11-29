import { StoreProduct } from "@/app/shopify-stores/data/stores"

// Generate sample products for stores
export function generateStoreProducts(storeId: string, count: number = 10): StoreProduct[] {
  const productTitles = [
    "Premium Wireless Headphones", "Classic Leather Wallet", "Smart Watch Pro",
    "Organic Cotton T-Shirt", "Stainless Steel Water Bottle", "Yoga Mat Premium",
    "Wireless Charging Pad", "Minimalist Backpack", "Bluetooth Speaker",
    "Running Shoes Elite", "Designer Sunglasses", "Laptop Stand Adjustable",
    "Phone Case Protective", "Coffee Maker Automatic", "Fitness Tracker",
    "Desk Organizer Set", "LED Desk Lamp", "Mechanical Keyboard",
    "Gaming Mouse Pad", "USB-C Hub", "Portable Power Bank",
    "Noise Cancelling Earbuds", "Smart Home Hub", "Robot Vacuum Cleaner"
  ]
  
  const vendors = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E", null]
  const productTypes = ["Electronics", "Clothing", "Accessories", "Home", "Sports", "Beauty", null]
  const tags = ["new", "sale", "featured", "bestseller", "limited", "premium", "eco-friendly"]
  
  const statuses: Array<"active" | "draft" | "archived"> = ["active", "draft", "archived"]
  
  return Array.from({ length: count }, (_, index) => {
    const title = productTitles[index % productTitles.length] + (index > productTitles.length ? ` ${Math.floor(index / productTitles.length) + 1}` : "")
    const price = Math.round((Math.random() * 200 + 10) * 100) / 100
    const compareAtPrice = Math.random() > 0.5 ? Math.round((price * 1.3) * 100) / 100 : null
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const inventoryCount = randomInt(0, 500)
    const vendor = vendors[Math.floor(Math.random() * vendors.length)]
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)]
    const selectedTags = tags.slice(0, randomInt(1, 4))
    
    const now = new Date()
    const createdAt = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    const updatedAt = new Date(createdAt).toISOString()
    
    return {
      id: `product-${storeId}-${String(index + 1).padStart(3, "0")}`,
      store_id: storeId,
      shopify_product_id: `shopify_${Math.random().toString(36).substring(2, 15)}`,
      title,
      image: `https://picsum.photos/seed/${storeId}-${index}/400/400`,
      price,
      compare_at_price: compareAtPrice,
      status,
      inventory_count: inventoryCount,
      vendor,
      product_type: productType,
      tags: selectedTags,
      created_at: createdAt,
      updated_at: updatedAt
    }
  })
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate products for all stores (can be called on demand)
export function getAllStoreProducts(storeIds: string[]): Record<string, StoreProduct[]> {
  const products: Record<string, StoreProduct[]> = {}
  storeIds.forEach(storeId => {
    products[storeId] = generateStoreProducts(storeId, randomInt(5, 50))
  })
  return products
}

