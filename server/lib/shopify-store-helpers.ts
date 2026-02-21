export interface ShopifyStoreRow {
  id: string;
  user_id: string;
  name: string;
  url: string;
  logo: string | null;
  status: string;
  connected_at: string | null;
  last_synced_at: string | null;
  sync_status: string;
  api_key: string | null;
  access_token: string | null;
  shopify_store_id: string | null;
  products_count: number;
  monthly_revenue: number | null;
  monthly_traffic: number | null;
  niche: string | null;
  country: string | null;
  currency: string;
  plan: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    email: string;
    full_name: string | null;
  } | null;
}

export function mapShopifyStoreFromDB(data: ShopifyStoreRow): any {
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    url: data.url,
    logo: data.logo || undefined,
    status: data.status as "connected" | "disconnected" | "syncing" | "error",
    connected_at: data.connected_at || new Date().toISOString(),
    last_synced_at: data.last_synced_at,
    sync_status: data.sync_status as "success" | "failed" | "pending" | "never",
    api_key: data.api_key || "",
    access_token: data.access_token || "",
    products_count: data.products_count || 0,
    monthly_revenue: data.monthly_revenue ? Number(data.monthly_revenue) : null,
    monthly_traffic: data.monthly_traffic || null,
    niche: data.niche || null,
    country: data.country || null,
    currency: data.currency || "USD",
    plan: data.plan as "basic" | "shopify" | "advanced" | "plus",
    user: data.profiles
      ? {
          id: data.profiles.id,
          email: data.profiles.email,
          full_name: data.profiles.full_name,
        }
      : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    connectedAt: data.connected_at || undefined,
  };
}

export function normalizeShopifyStoreUrl(url: string): string {
  let normalized = url.trim().toLowerCase();

  normalized = normalized.replace(/^https?:\/\//, "");
  normalized = normalized.replace(/\/$/, "");

  if (!normalized.includes(".")) {
    normalized = `${normalized}.myshopify.com`;
  } else if (!normalized.includes(".myshopify.com")) {
    const match = normalized.match(/^([a-zA-Z0-9-]+)/);
    if (match) {
      normalized = `${match[1]}.myshopify.com`;
    }
  }

  return normalized;
}
