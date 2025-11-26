// Admin Permission Types

export type PermissionKey =
  | "users.view"
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
  | "external_users.edit"
  | "external_users.suspend"
  | "external_users.activate"
  | "external_users.delete"
  | "external_users.upsell"
  | "internal_users.view"
  | "internal_users.edit"
  | "internal_users.create"
  | "internal_users.delete"
  | "internal_users.manage_permissions"
  | "reports.view_all_cash"
  | "reports.view_sales"
  | "reports.export"
  | "orders.view"
  | "orders.view_all"
  | "orders.refund"
  | "orders.cancel"
  | "hand-picked-winners.view"
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

export interface PermissionDefinition {
  key: string
  label: string
  description?: string
  category?: string
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
  permissionLevel: "trial" | "hidden" | "locked" | "limited_access" | "full_access"
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

