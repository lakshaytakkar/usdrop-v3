import { useLocation } from "wouter";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const routeTitles: Record<string, { title: string; subtitle?: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Platform overview and key metrics" },
  "/admin/external-users": { title: "Clients", subtitle: "Manage external users" },
  "/admin/internal-users": { title: "Team", subtitle: "Manage internal team members" },
  "/admin/products": { title: "Products", subtitle: "Manage product catalog" },
  "/admin/categories": { title: "Categories", subtitle: "Manage product categories" },
  "/admin/suppliers": { title: "Suppliers", subtitle: "Manage suppliers" },
  "/admin/courses": { title: "Courses", subtitle: "Manage learning content" },
  "/admin/leads": { title: "Leads", subtitle: "Manage mentorship leads" },
  "/admin/plans": { title: "Plans", subtitle: "Manage subscription plans" },
  "/admin/competitor-stores": { title: "Competitor Stores", subtitle: "Track competitor stores" },
  "/admin/shopify-stores": { title: "Shopify Stores", subtitle: "Manage connected stores" },
};

function getRouteInfo(pathname: string) {
  if (routeTitles[pathname]) return routeTitles[pathname];
  for (const [route, info] of Object.entries(routeTitles)) {
    if (pathname.startsWith(route + "/")) return info;
  }
  return { title: "Admin", subtitle: undefined };
}

function AdminTopbar() {
  const [location] = useLocation();
  const { signOut } = useAuth();
  const { fullName, internalRole } = useUserMetadata();
  const routeInfo = getRouteInfo(location);
  const initials = (fullName || "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex flex-col">
          <h1 className="text-base font-semibold font-heading leading-tight" data-testid="text-topbar-title">{routeInfo.title}</h1>
          {routeInfo.subtitle && (
            <p className="text-xs text-muted-foreground" data-testid="text-topbar-subtitle">{routeInfo.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-8 w-56 pl-8 text-sm"
            data-testid="input-global-search"
          />
        </div>

        <Button size="icon" variant="ghost" className="relative" data-testid="button-notifications">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive animate-pulse" />
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-user-menu">
              <Avatar className="size-7">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">{fullName || "Admin"}</span>
                <span className="text-xs text-muted-foreground capitalize">{internalRole || "Admin"}</span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem data-testid="menu-item-profile">My Profile</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-item-settings">Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} data-testid="menu-item-logout">
              <LogOut className="mr-2 size-3.5" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
