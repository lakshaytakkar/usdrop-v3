import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  GraduationCap,
  FolderTree,
  Truck,
  CreditCard,
  Store,
  ShoppingBag,
  Target,
  Link2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion } from "motion/react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "Clients", url: "/admin/external-users", icon: UserCog },
      { title: "Team", url: "/admin/internal-users", icon: Users },
      { title: "Leads", url: "/admin/leads", icon: Target },
    ],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", url: "/admin/products", icon: Package },
      { title: "Categories", url: "/admin/categories", icon: FolderTree },
      { title: "Suppliers", url: "/admin/suppliers", icon: Truck },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Courses", url: "/admin/courses", icon: GraduationCap },
      { title: "Important Links", url: "/admin/important-links", icon: Link2 },
    ],
  },
  {
    label: "Sales",
    items: [
      { title: "Plans", url: "/admin/plans", icon: CreditCard },
      { title: "Competitor Stores", url: "/admin/competitor-stores", icon: Store },
      { title: "Shopify Stores", url: "/admin/shopify-stores", icon: ShoppingBag },
    ],
  },
];

function NavItem({ item, isActive, index }: { item: { title: string; url: string; icon: React.ElementType }; isActive: boolean; index: number }) {
  return (
    <SidebarMenuItem
      className="relative"
      style={{ animationDelay: `${100 + index * 30}ms` }}
    >
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
          <item.icon className="size-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </SidebarMenuItem>
  );
}

export function AdminSidebar() {
  const [location] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  let itemIndex = 0;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            U
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold font-heading tracking-tight" data-testid="text-brand-name">USDrop AI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.url === "/admin" ? location === "/admin" : location.startsWith(item.url);
                  const idx = itemIndex++;
                  return <NavItem key={item.title} item={item} isActive={isActive} index={idx} />;
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
