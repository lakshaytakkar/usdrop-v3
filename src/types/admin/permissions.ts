// Admin Permission Types

export type PermissionKey =
  | "users.view"
  | "users.view_all"
  | "users.view_assigned"
  | "users.edit"
  | "users.reset_password"
  | "users.create"
  | "users.delete"
  | "roles.view"
  | "roles.edit"
  | "roles.create"
  | "roles.delete"
  | "plans.view"
  | "plans.edit"
  | "plans.create"
  | "plans.delete"
  | "plans.manage_permissions"
  | "external_users.view"
  | "external_users.view_all"
  | "external_users.view_assigned"
  | "external_users.edit"
  | "external_users.suspend"
  | "external_users.activate"
  | "external_users.delete"
  | "external_users.upsell"
  | "internal_users.view"
  | "internal_users.view_all"
  | "internal_users.view_assigned"
  | "internal_users.edit"
  | "internal_users.create"
  | "internal_users.delete"
  | "internal_users.manage_permissions"
  | "internal_users.suspend"
  | "internal_users.activate"
  | "reports.view_all_cash"
  | "reports.view_sales"
  | "reports.export"
  | "orders.view"
  | "orders.view_all"
  | "orders.view_assigned"
  | "orders.edit"
  | "orders.delete"
  | "orders.refund"
  | "orders.cancel"
  | "hand-picked-winners.view"
  | "hand-picked-winners.view_all"
  | "hand-picked-winners.view_assigned"
  | "hand-picked-winners.edit"
  | "hand-picked-winners.create"
  | "hand-picked-winners.delete"
  | "meta-ads-research.view"
  | "meta-ads-research.edit"
  | "meta-ads-research.create"
  | "meta-ads-research.delete"
  | "shopify-stores.view"
  | "shopify-stores.edit"
  | "shopify-stores.create"
  | "shopify-stores.delete"
  | "store-research.view"
  | "store-research.edit"
  | "store-research.create"
  | "store-research.delete"
  | "top-competitor-stores.view"
  | "top-competitor-stores.edit"
  | "top-competitor-stores.create"
  | "top-competitor-stores.delete"
  | "top-categories.view"
  | "top-categories.edit"
  | "top-categories.create"
  | "top-categories.delete"
  | "private-suppliers.view"
  | "private-suppliers.edit"
  | "private-suppliers.create"
  | "private-suppliers.delete"
  | "suppliers.view"
  | "suppliers.edit"
  | "suppliers.create"
  | "suppliers.delete"
  | "suppliers.verify"
  | "usdrop-academy.view"
  | "usdrop-academy.edit"
  | "usdrop-academy.create"
  | "usdrop-academy.delete"
  | "usdropintelligence.view"
  | "usdropintelligence.edit"
  | "usdropintelligence.create"
  | "usdropintelligence.delete"
  | "other-recommended-apps.view"
  | "other-recommended-apps.edit"
  | "other-recommended-apps.create"
  | "other-recommended-apps.delete"
  | "categories.view"
  | "categories.edit"
  | "categories.create"
  | "categories.delete"
  | "competitor_stores.view"
  | "competitor_stores.edit"
  | "competitor_stores.create"
  | "competitor_stores.delete"
  | "competitor_stores.verify"
  | "products.view"
  | "products.view_hand_picked"
  | "products.view_product_picks"
  | "products.edit"
  | "products.create"
  | "products.delete"
  | "products.lock_unlock"

export type ViewScope = 'all' | 'assigned' | null

export interface PermissionDefinition {
  key: string
  label: string
  description?: string
  category?: string
  supportsScope?: boolean
}

export interface ModulePermissionGroup {
  moduleId: string
  moduleName: string
  permissions: PermissionDefinition[]
}

export type RolePermissions = Record<string, boolean>

export interface InternalRolePermission {
  id: string
  role: "superadmin" | "admin" | "manager" | "executive"
  moduleId: string
  permissionKey: string
  allowed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlanPermission {
  id: string
  planId: string
  moduleId: string
  permissionLevel: "hidden" | "locked" | "limited_access" | "full_access"
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  name: string
  description?: string
  icon?: string
  href?: string
}

export interface ExternalPlanPermission {
  moduleId: string
  /**
   * Access level for the module:
   * - "full_access": Full access to all features
   * - "limited_access": Limited access with count restrictions
   * - "locked": Module visible in sidebar but blocked with overlay (lockPage = true)
   * - "hidden": Module hidden from sidebar and routes blocked
   */
  accessLevel: "full_access" | "limited_access" | "locked" | "hidden"
  view: boolean
  viewDetails: boolean
  limitedView: boolean
  limitCount: number | null
  lockPage: boolean
}

export type ExternalPlanPermissions = Record<string, ExternalPlanPermission>

export interface ExternalPlanPermissionDefinition extends PermissionDefinition {
  type?: "checkbox" | "select" | "number"
  dependsOn?: string // For conditional fields (e.g., limit_count depends on limited_view)
}

export interface ExternalUserModulePermissionGroup {
  moduleId: string
  moduleName: string
  permissions: ExternalPlanPermissionDefinition[]
}

