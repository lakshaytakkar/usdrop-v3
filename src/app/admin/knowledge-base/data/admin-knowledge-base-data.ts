import {
  Users,
  Shield,
  Package,
  Database,
  BarChart3,
  Settings,
  FileText,
  Lock,
  ShoppingCart,
  BookOpen,
  Zap,
  Globe,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface CategoryCard {
  id: string
  title: string
  description: string
  icon: LucideIcon
  category: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export const categoryCards: CategoryCard[] = [
  {
    id: "user-management",
    title: "User Management",
    description: "Manage internal and external users, roles, permissions, and access control.",
    icon: Users,
    category: "User Management",
  },
  {
    id: "permissions-roles",
    title: "Permissions & Roles",
    description: "Configure role-based permissions for internal users and plan-based access for external users.",
    icon: Shield,
    category: "Permissions & Roles",
  },
  {
    id: "content-management",
    title: "Content Management",
    description: "Manage products, categories, suppliers, courses, and intelligence articles.",
    icon: Package,
    category: "Content Management",
  },
  {
    id: "orders-transactions",
    title: "Orders & Transactions",
    description: "View and manage orders, track transactions, and handle fulfillment processes.",
    icon: ShoppingCart,
    category: "Orders & Transactions",
  },
  {
    id: "data-management",
    title: "Data Management",
    description: "Import, export, and manage data across the platform including products, users, and analytics.",
    icon: Database,
    category: "Data Management",
  },
  {
    id: "analytics-reporting",
    title: "Analytics & Reporting",
    description: "Access platform analytics, generate reports, and track key performance metrics.",
    icon: BarChart3,
    category: "Analytics & Reporting",
  },
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure platform settings, integrations, email automation, and system preferences.",
    icon: Settings,
    category: "System Settings",
  },
  {
    id: "security-access",
    title: "Security & Access",
    description: "Manage security policies, access control, audit logs, and compliance requirements.",
    icon: Lock,
    category: "Security & Access",
  },
]

export const faqs: FAQ[] = [
  // User Management FAQs
  {
    id: "admin-faq-1",
    question: "How do I create a new internal user?",
    answer: "Navigate to Admin > Internal Users and click the 'Add User' button. Fill in the required fields including name, email, password, and role (superadmin, admin, manager, or executive). Internal users will automatically have access to the admin panel and will be redirected to /admin upon login.",
    category: "User Management",
    tags: ["users", "internal", "create", "roles"],
  },
  {
    id: "admin-faq-2",
    question: "What's the difference between internal and external users?",
    answer: "Internal users have an internal_role assigned (superadmin, admin, manager, executive) and access the admin panel. External users have subscription plans (free, pro) and access the customer-facing platform. Internal users are automatically blocked from accessing normal user routes, and external users cannot access admin routes.",
    category: "User Management",
    tags: ["users", "internal", "external", "access"],
  },
  {
    id: "admin-faq-3",
    question: "How do I assign or change a user's role?",
    answer: "For internal users, go to Admin > Internal Users, select the user, and click 'Edit'. You can change their role from the dropdown. Role changes take effect immediately and affect what permissions the user has. For external users, go to Admin > External Users and update their subscription plan.",
    category: "User Management",
    tags: ["roles", "permissions", "edit", "assign"],
  },
  {
    id: "admin-faq-4",
    question: "Can I suspend or reactivate a user account?",
    answer: "Yes, you can suspend or reactivate user accounts from their user detail page. Suspended users cannot log in and will be redirected to an account suspended page. To reactivate, change their status back to 'active' from the user management interface.",
    category: "User Management",
    tags: ["suspend", "reactivate", "status", "access"],
  },
  // Permissions & Roles FAQs
  {
    id: "admin-faq-5",
    question: "How do permissions work for internal users?",
    answer: "Internal users have role-based permissions that control what actions they can perform. Permissions are granular and action-specific (e.g., 'users.view', 'users.edit', 'users.delete'). Each role (superadmin, admin, manager, executive) has a predefined set of permissions. Superadmins have full access and can modify permission settings for all roles.",
    category: "Permissions & Roles",
    tags: ["permissions", "roles", "access", "control"],
  },
  {
    id: "admin-faq-6",
    question: "How do I modify role permissions?",
    answer: "Navigate to Admin > Permissions and select the 'Internal Roles' tab. Only superadmin users can modify permissions. Select a role and toggle the permissions as needed. Changes are saved immediately and affect all users with that role.",
    category: "Permissions & Roles",
    tags: ["permissions", "roles", "modify", "superadmin"],
  },
  {
    id: "admin-faq-7",
    question: "What permissions do different roles have?",
    answer: "Superadmin has full access to all features including permission management. Admin has broad access but cannot modify permissions. Manager has access to content management, orders, and reporting. Executive has limited access focused on viewing data and basic operations. You can view detailed permission matrices in Admin > Permissions.",
    category: "Permissions & Roles",
    tags: ["roles", "permissions", "access", "levels"],
  },
  {
    id: "admin-faq-8",
    question: "How do plan permissions work for external users?",
    answer: "External users have plan-based permissions that control module access. Free plans have limited access to most modules, while Pro plans have full access. You can configure module-level permissions (full_access, limited_access, locked, hidden) for each plan in Admin > Permissions under the 'External Plans' tab.",
    category: "Permissions & Roles",
    tags: ["plans", "external", "permissions", "modules"],
  },
  // Content Management FAQs
  {
    id: "admin-faq-9",
    question: "How do I add a new product to the platform?",
    answer: "Navigate to Admin > Products and click 'Add Product'. Fill in product details including name, description, price, category, supplier information, and images. Products can be assigned to categories and linked to suppliers. Once added, products become available for external users to discover and add to their stores.",
    category: "Content Management",
    tags: ["products", "add", "create", "content"],
  },
  {
    id: "admin-faq-10",
    question: "How do I manage product categories?",
    answer: "Go to Admin > Categories to view, create, edit, or delete categories. Categories help organize products and make them easier for users to discover. You can set category thumbnails, descriptions, and hierarchical relationships. Changes to categories affect product organization across the platform.",
    category: "Content Management",
    tags: ["categories", "products", "organization", "manage"],
  },
  {
    id: "admin-faq-11",
    question: "How do I add or verify a supplier?",
    answer: "Navigate to Admin > Suppliers and click 'Add Supplier'. Enter supplier details including name, contact information, shipping locations, and verification status. Verified suppliers are marked with a badge and are trusted by the platform. You can verify suppliers after reviewing their credentials and product quality.",
    category: "Content Management",
    tags: ["suppliers", "verify", "add", "management"],
  },
  {
    id: "admin-faq-12",
    question: "How do I create and manage courses?",
    answer: "Go to Admin > Courses and click 'Create Course'. Use the course builder to add chapters, videos, quizzes, and resources. Courses can be published or saved as drafts. Published courses appear in the Academy section for external users. You can track course completion and engagement from the course management interface.",
    category: "Content Management",
    tags: ["courses", "education", "academy", "content"],
  },
  // Orders & Transactions FAQs
  {
    id: "admin-faq-13",
    question: "How do I view all orders in the system?",
    answer: "Navigate to Admin > Orders to see a comprehensive list of all orders placed through the platform. You can filter by status, date range, user, product, or supplier. Order details include customer information, items, shipping details, payment status, and fulfillment tracking.",
    category: "Orders & Transactions",
    tags: ["orders", "view", "track", "transactions"],
  },
  {
    id: "admin-faq-14",
    question: "How do I handle order disputes or refunds?",
    answer: "Go to the specific order detail page from Admin > Orders. You can update order status, issue refunds, add notes, and communicate with customers. Refunds are processed through the payment gateway and tracked in the transaction history. Document all communications and actions for audit purposes.",
    category: "Orders & Transactions",
    tags: ["orders", "refunds", "disputes", "customer service"],
  },
  // System Settings FAQs
  {
    id: "admin-faq-15",
    question: "How do I configure email automation templates?",
    answer: "Navigate to Admin > Email Automation > Templates to create and manage email templates. Templates can be used for transactional emails, marketing campaigns, and drip sequences. Use the template editor to design emails with dynamic variables that personalize content for each recipient.",
    category: "System Settings",
    tags: ["email", "automation", "templates", "campaigns"],
  },
  {
    id: "admin-faq-16",
    question: "How do I manage subscription plans?",
    answer: "Go to Admin > Plans to view and manage subscription plans (Free, Pro, etc.). You can edit plan features, pricing, trial periods, and access levels. Plan changes affect new subscriptions immediately and can be configured to apply to existing subscriptions based on your policy.",
    category: "System Settings",
    tags: ["plans", "subscription", "pricing", "features"],
  },
  // Security & Access FAQs
  {
    id: "admin-faq-17",
    question: "How are admin routes protected?",
    answer: "Admin routes (paths starting with /admin) are automatically blocked for external users through middleware. External users attempting to access admin routes are redirected to their appropriate route (/home for Pro, /onboarding for Free). Similarly, internal users are blocked from accessing normal user routes and redirected to /admin.",
    category: "Security & Access",
    tags: ["security", "routes", "access", "middleware"],
  },
  {
    id: "admin-faq-18",
    question: "How do I view audit logs or user activity?",
    answer: "Audit logs track user actions, permission changes, and system events for security and compliance. Navigate to the Security section to access logs. Logs include timestamps, user information, action types, and affected resources. Logs are retained according to your data retention policy.",
    category: "Security & Access",
    tags: ["logs", "audit", "security", "compliance"],
  },
  // General Admin FAQs
  {
    id: "admin-faq-19",
    question: "What should I do if I can't access a feature?",
    answer: "Check your role and permissions in Admin > Permissions. Some features require specific role levels (e.g., only superadmin can modify permissions). If you believe you should have access, contact a superadmin user or check the permission matrix to understand role capabilities.",
    category: "General",
    tags: ["access", "permissions", "troubleshooting", "help"],
  },
  {
    id: "admin-faq-20",
    question: "How do I export data from the platform?",
    answer: "Most admin sections include export functionality. Look for 'Export' buttons or download icons in data tables. You can export users, products, orders, and other data in CSV or JSON formats. Bulk exports may take time for large datasets and will be available for download once complete.",
    category: "Data Management",
    tags: ["export", "data", "download", "reports"],
  },
]



