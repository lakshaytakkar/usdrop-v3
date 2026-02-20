import { pgTable, uuid, text, boolean, integer, numeric, timestamp, jsonb, date, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price_monthly: integer("price_monthly").default(0),
  price_annual: integer("price_annual").default(0),
  price_yearly: integer("price_yearly").default(0),
  features: jsonb("features").default(sql`'[]'::jsonb`),
  key_pointers: text("key_pointers"),
  popular: boolean("popular").default(false),
  trial_days: integer("trial_days").default(0),
  active: boolean("active").default(true),
  is_public: boolean("is_public").default(true),
  display_order: integer("display_order").default(0),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  username: text("username"),
  avatar_url: text("avatar_url"),
  password_hash: text("password_hash"),
  account_type: text("account_type").default("free"),
  internal_role: text("internal_role"),
  status: text("status").default("active"),
  onboarding_completed: boolean("onboarding_completed").default(false),
  onboarding_completed_at: timestamp("onboarding_completed_at", { withTimezone: true }),
  onboarding_progress: integer("onboarding_progress").default(0),
  subscription_plan_id: uuid("subscription_plan_id").references(() => subscriptionPlans.id),
  subscription_status: text("subscription_status"),
  is_trial: boolean("is_trial").default(false),
  phone_number: text("phone_number"),
  ecommerce_experience: text("ecommerce_experience"),
  preferred_niche: text("preferred_niche"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  thumbnail: text("thumbnail"),
  parent_category_id: uuid("parent_category_id"),
  trending: boolean("trending").default(false),
  product_count: integer("product_count").default(0),
  avg_profit_margin: numeric("avg_profit_margin"),
  growth_percentage: numeric("growth_percentage"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  website: text("website"),
  country: text("country"),
  rating: numeric("rating"),
  verified: boolean("verified").default(false),
  shipping_time: text("shipping_time"),
  min_order_quantity: integer("min_order_quantity"),
  contact_email: text("contact_email"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  image: text("image"),
  description: text("description"),
  category_id: uuid("category_id").references(() => categories.id),
  buy_price: numeric("buy_price").default("0"),
  sell_price: numeric("sell_price").default("0"),
  profit_per_order: numeric("profit_per_order").default("0"),
  additional_images: jsonb("additional_images").default(sql`'[]'::jsonb`),
  specifications: jsonb("specifications"),
  rating: numeric("rating"),
  reviews_count: integer("reviews_count").default(0),
  trend_data: jsonb("trend_data").default(sql`'[]'::jsonb`),
  supplier_id: uuid("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productMetadata = pgTable("product_metadata", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  product_id: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }).unique(),
  is_winning: boolean("is_winning").default(false),
  is_locked: boolean("is_locked").default(false),
  unlock_price: numeric("unlock_price"),
  profit_margin: numeric("profit_margin"),
  pot_revenue: numeric("pot_revenue"),
  revenue_growth_rate: numeric("revenue_growth_rate"),
  items_sold: integer("items_sold"),
  avg_unit_price: numeric("avg_unit_price"),
  revenue_trend: jsonb("revenue_trend").default(sql`'[]'::jsonb`),
  found_date: text("found_date"),
  detailed_analysis: text("detailed_analysis"),
  filters: jsonb("filters").default(sql`'[]'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productSource = pgTable("product_source", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  product_id: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }).unique(),
  source_type: text("source_type"),
  source_id: text("source_id"),
  standardized_at: timestamp("standardized_at", { withTimezone: true }),
  standardized_by: text("standardized_by"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productResearch = pgTable("product_research", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  product_id: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }).unique(),
  competitor_pricing: jsonb("competitor_pricing"),
  seasonal_demand: text("seasonal_demand"),
  audience_targeting: jsonb("audience_targeting"),
  supplier_notes: text("supplier_notes"),
  social_proof: jsonb("social_proof"),
  research_date: timestamp("research_date", { withTimezone: true }).defaultNow(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const competitorStores = pgTable("competitor_stores", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  logo: text("logo"),
  category_id: uuid("category_id").references(() => categories.id),
  country: text("country"),
  monthly_traffic: integer("monthly_traffic").default(0),
  monthly_revenue: numeric("monthly_revenue"),
  growth: numeric("growth").default("0"),
  products_count: integer("products_count"),
  rating: numeric("rating"),
  verified: boolean("verified").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const competitorStoreProducts = pgTable("competitor_store_products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  competitor_store_id: uuid("competitor_store_id").notNull().references(() => competitorStores.id, { onDelete: "cascade" }),
  product_id: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  discovered_at: timestamp("discovered_at", { withTimezone: true }).defaultNow(),
  last_seen_at: timestamp("last_seen_at", { withTimezone: true }).defaultNow(),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  instructor_id: uuid("instructor_id").references(() => profiles.id),
  thumbnail: text("thumbnail"),
  duration_minutes: integer("duration_minutes").default(0),
  lessons_count: integer("lessons_count").default(0),
  students_count: integer("students_count").default(0),
  rating: numeric("rating"),
  price: numeric("price").default("0"),
  category: text("category"),
  level: text("level"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  published_at: timestamp("published_at", { withTimezone: true }),
  tags: jsonb("tags").default(sql`'[]'::jsonb`),
  learning_objectives: jsonb("learning_objectives").default(sql`'[]'::jsonb`),
  prerequisites: jsonb("prerequisites").default(sql`'[]'::jsonb`),
  is_onboarding: boolean("is_onboarding").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const courseModules = pgTable("course_modules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  course_id: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  order_index: integer("order_index").default(0),
  duration_minutes: integer("duration_minutes").default(0),
  is_preview: boolean("is_preview").default(false),
  content_type: text("content_type").default("video"),
  content: jsonb("content").default(sql`'{}'::jsonb`),
  video_url: text("video_url"),
  video_storage_path: text("video_storage_path"),
  video_source: text("video_source").default("upload"),
  video_duration: integer("video_duration"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const courseChapters = pgTable("course_chapters", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  module_id: uuid("module_id").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  content_type: text("content_type").default("video"),
  content: jsonb("content").default(sql`'{}'::jsonb`),
  order_index: integer("order_index").default(0),
  duration_minutes: integer("duration_minutes").default(0),
  is_preview: boolean("is_preview").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  course_id: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  enrolled_at: timestamp("enrolled_at", { withTimezone: true }).defaultNow(),
  completed_at: timestamp("completed_at", { withTimezone: true }),
  progress_percentage: numeric("progress_percentage").default("0"),
  last_accessed_at: timestamp("last_accessed_at", { withTimezone: true }),
  last_accessed_chapter_id: uuid("last_accessed_chapter_id"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const chapterCompletions = pgTable("chapter_completions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollment_id: uuid("enrollment_id").notNull().references(() => courseEnrollments.id, { onDelete: "cascade" }),
  chapter_id: uuid("chapter_id").notNull().references(() => courseChapters.id, { onDelete: "cascade" }),
  completed_at: timestamp("completed_at", { withTimezone: true }).defaultNow(),
  time_spent_minutes: integer("time_spent_minutes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const moduleCompletions = pgTable("module_completions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollment_id: uuid("enrollment_id").notNull().references(() => courseEnrollments.id, { onDelete: "cascade" }),
  module_id: uuid("module_id").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  completed_at: timestamp("completed_at", { withTimezone: true }).defaultNow(),
  time_spent_minutes: integer("time_spent_minutes").default(0),
  watch_duration: integer("watch_duration").default(0),
  last_position: integer("last_position").default(0),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const courseNotes = pgTable("course_notes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  module_id: uuid("module_id").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  timestamp_seconds: integer("timestamp_seconds").default(0),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollment_id: uuid("enrollment_id").notNull().references(() => courseEnrollments.id, { onDelete: "cascade" }),
  chapter_id: uuid("chapter_id").notNull().references(() => courseChapters.id, { onDelete: "cascade" }),
  answers: jsonb("answers"),
  score: numeric("score"),
  passed: boolean("passed").default(false),
  attempted_at: timestamp("attempted_at", { withTimezone: true }),
  completed_at: timestamp("completed_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const onboardingModules = pgTable("onboarding_modules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  order_index: integer("order_index").default(0),
  thumbnail: text("thumbnail"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const onboardingVideos = pgTable("onboarding_videos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  module_id: uuid("module_id").notNull().references(() => onboardingModules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  video_url: text("video_url").notNull(),
  video_duration: integer("video_duration"),
  thumbnail: text("thumbnail"),
  order_index: integer("order_index").default(0),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const onboardingProgress = pgTable("onboarding_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  video_id: uuid("video_id").notNull().references(() => onboardingVideos.id, { onDelete: "cascade" }),
  module_id: uuid("module_id").references(() => onboardingModules.id, { onDelete: "set null" }),
  completed: boolean("completed").default(false),
  completed_at: timestamp("completed_at", { withTimezone: true }),
  watch_duration: integer("watch_duration").default(0),
  watch_time: integer("watch_time").default(0),
  last_position: integer("last_position").default(0),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const devTasks = pgTable("dev_tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("not-started").notNull(),
  priority: text("priority").default("medium").notNull(),
  assigned_to: uuid("assigned_to").references(() => profiles.id, { onDelete: "set null" }),
  created_by: uuid("created_by").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  parent_task_id: uuid("parent_task_id"),
  project_id: uuid("project_id"),
  phase: integer("phase"),
  estimated_hours: numeric("estimated_hours"),
  actual_hours: numeric("actual_hours"),
  due_date: timestamp("due_date", { withTimezone: true }),
  figma_link: text("figma_link"),
  doc_links: jsonb("doc_links").default(sql`'[]'::jsonb`),
  related_files: jsonb("related_files").default(sql`'[]'::jsonb`),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const devTaskAttachments = pgTable("dev_task_attachments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  task_id: uuid("task_id").notNull().references(() => devTasks.id, { onDelete: "cascade" }),
  file_name: text("file_name").notNull(),
  file_path: text("file_path").notNull(),
  file_size: integer("file_size").notNull(),
  file_type: text("file_type").notNull(),
  uploaded_by: uuid("uploaded_by").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const devTaskComments = pgTable("dev_task_comments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  task_id: uuid("task_id").notNull().references(() => devTasks.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  comment_text: text("comment_text").notNull(),
  is_system_log: boolean("is_system_log").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const devTaskHistory = pgTable("dev_task_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  task_id: uuid("task_id").notNull().references(() => devTasks.id, { onDelete: "cascade" }),
  field_name: text("field_name").notNull(),
  old_value: text("old_value"),
  new_value: text("new_value"),
  changed_by: uuid("changed_by").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const userPicklist = pgTable("user_picklist", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  product_id: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  source: text("source").default("product-hunt"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userCredentials = pgTable("user_credentials", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  service_name: text("service_name").notNull(),
  service_url: text("service_url"),
  username: text("username"),
  password: text("password"),
  notes: text("notes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userDetails = pgTable("user_details", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().unique().references(() => profiles.id, { onDelete: "cascade" }),
  first_name: text("first_name"),
  last_name: text("last_name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zip_code: text("zip_code"),
  bio: text("bio"),
  website: text("website"),
  social_links: jsonb("social_links").default(sql`'{}'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const shopifyStores = pgTable("shopify_stores", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name"),
  store_name: text("store_name"),
  url: text("url"),
  shop_domain: text("shop_domain"),
  shopify_store_id: text("shopify_store_id"),
  logo: text("logo"),
  status: text("status").default("disconnected"),
  is_active: boolean("is_active").default(false),
  connected_at: timestamp("connected_at", { withTimezone: true }),
  last_synced_at: timestamp("last_synced_at", { withTimezone: true }),
  sync_status: text("sync_status").default("never"),
  access_token: text("access_token"),
  products_count: integer("products_count").default(0),
  monthly_revenue: numeric("monthly_revenue"),
  monthly_traffic: integer("monthly_traffic"),
  niche: text("niche"),
  country: text("country"),
  currency: text("currency").default("USD"),
  plan: text("plan"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  full_name: text("full_name"),
  source: text("source"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const roadmapProgress = pgTable("roadmap_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  task_id: text("task_id").notNull(),
  status: text("status").default("not_started"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const intelligenceArticles = pgTable("intelligence_articles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author_name: text("author_name").notNull(),
  author_avatar: text("author_avatar"),
  featured_image: text("featured_image").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").default(sql`'[]'::jsonb`),
  published_date: date("published_date").notNull(),
  read_time: integer("read_time").notNull(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  featured: boolean("featured").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, created_at: true, updated_at: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export const insertProductSchema = createInsertSchema(products).omit({ id: true, created_at: true, updated_at: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, created_at: true, updated_at: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({ id: true, created_at: true, updated_at: true });
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
