import { useLocation } from "wouter";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

const routeTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/external-users": "Clients",
  "/admin/internal-users": "Team",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/suppliers": "Suppliers",
  "/admin/courses": "Courses",
  "/admin/leads": "Leads",
  "/admin/plans": "Plans",
  "/admin/competitor-stores": "Competitor Stores",
  "/admin/shopify-stores": "Shopify Stores",
};

function getPageTitle(location: string): string {
  if (routeTitles[location]) return routeTitles[location];
  for (const [path, title] of Object.entries(routeTitles)) {
    if (location.startsWith(path + "/")) return title;
  }
  if (location.startsWith("/admin/courses/")) return "Course Builder";
  return "Admin";
}

function AdminTopbar() {
  const [location] = useLocation();
  const { signOut } = useAuth();
  const { fullName, internalRole } = useUserMetadata();
  const initials = (fullName || "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const pageTitle = getPageTitle(location);

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-2 border-b px-4"
      data-testid="topbar-main"
    >
      <SidebarTrigger className="-ml-1" data-testid="button-sidebar-trigger" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <span className="text-sm font-semibold font-heading" data-testid="text-page-title">{pageTitle}</span>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-8 w-56 pl-8 text-sm bg-muted/30"
            data-testid="input-global-search"
          />
        </div>

        <Button size="icon" variant="ghost" className="relative" data-testid="button-notifications">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive animate-pulse" />
        </Button>

        <Separator orientation="vertical" className="!h-5" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 px-2 py-2.5">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{fullName || "Admin"}</span>
                <span className="text-xs text-muted-foreground capitalize">{internalRole || "Admin"}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm" data-testid="menu-item-profile">My Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-sm" data-testid="menu-item-settings">Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm" onClick={() => signOut()} data-testid="menu-item-logout">Log Out</DropdownMenuItem>
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
