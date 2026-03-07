import { useLocation, Link } from "wouter";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface NavCategory {
  title: string;
  defaultUrl: string;
  items: { title: string; url: string }[];
}

const navCategories: NavCategory[] = [
  {
    title: "Dashboard",
    defaultUrl: "/admin",
    items: [],
  },
  {
    title: "Pipeline",
    defaultUrl: "/admin/pipeline",
    items: [],
  },
  {
    title: "Clients",
    defaultUrl: "/admin/clients",
    items: [],
  },
  {
    title: "LLC Tracker",
    defaultUrl: "/admin/llc",
    items: [],
  },
  {
    title: "Tickets",
    defaultUrl: "/admin/tickets",
    items: [],
  },
  {
    title: "Users",
    defaultUrl: "/admin/users",
    items: [],
  },
  {
    title: "Content",
    defaultUrl: "/admin/content/free-learning",
    items: [
      { title: "Free Learning", url: "/admin/content/free-learning" },
      { title: "Roadmap", url: "/admin/content/roadmap" },
      { title: "CRO Checklist", url: "/admin/content/cro-checklist" },
      { title: "Courses", url: "/admin/courses" },
      { title: "Sessions", url: "/admin/sessions" },
      { title: "Ad Videos", url: "/admin/videos" },
      { title: "Products", url: "/admin/products" },
      { title: "Categories", url: "/admin/categories" },
    ],
  },
  {
    title: "Settings",
    defaultUrl: "/admin/access-control",
    items: [
      { title: "Access Control", url: "/admin/access-control" },
      { title: "Plans", url: "/admin/plans" },
    ],
  },
];

function getActiveCategory(location: string): NavCategory | null {
  if (location.startsWith("/admin/courses/")) {
    return navCategories.find(c => c.title === "Content") || null;
  }
  if (location.startsWith("/admin/batches/")) {
    return navCategories.find(c => c.title === "Clients") || null;
  }
  for (const cat of navCategories) {
    if (cat.items.length === 0) {
      if (cat.defaultUrl === "/admin") {
        if (location === "/admin") return cat;
      } else if (location === cat.defaultUrl || location.startsWith(cat.defaultUrl + "/")) {
        return cat;
      }
      continue;
    }
    for (const item of cat.items) {
      if (location === item.url || location.startsWith(item.url + "/")) return cat;
    }
  }
  return null;
}

function isItemActive(location: string, itemUrl: string): boolean {
  return location === itemUrl || location.startsWith(itemUrl + "/");
}

function AdminTopNavigation() {
  const [location] = useLocation();
  const { signOut } = useAuth();
  const { fullName, internalRole } = useUserMetadata();
  const initials = (fullName || "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const activeCategory = getActiveCategory(location);
  const showSubNav = activeCategory && activeCategory.items.length > 1;

  return (
    <div className="shrink-0 overflow-y-hidden px-4 sm:px-8 lg:px-16 xl:px-24 pt-3 space-y-2">
      <header
        className="flex h-14 items-center justify-between gap-2 rounded-xl border bg-background px-5 overflow-hidden"
        data-testid="topbar-main"
      >
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/admin" data-testid="link-brand">
            <div className="flex items-baseline gap-1 cursor-pointer">
              <span className="text-xl font-semibold tracking-tight text-foreground" data-testid="text-brand-name">USDrop</span>
              <span className="text-xl font-bold text-blue-600">AI</span>
            </div>
          </Link>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <nav className="flex items-center gap-0.5 overflow-x-auto overflow-y-hidden scrollbar-hide" data-testid="nav-level-1">
            {navCategories.map((cat) => {
              const isActive = activeCategory?.title === cat.title;
              return (
                <Link
                  key={cat.title}
                  href={cat.defaultUrl}
                  data-testid={`nav-l1-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className={cn(
                    "relative whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.title}
                  {isActive && (
                    <motion.div
                      layoutId="nav-l1-indicator"
                      className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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

          <Separator orientation="vertical" className="h-5" />

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

      {showSubNav && (
        <div
          className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2 overflow-x-auto overflow-y-hidden scrollbar-hide"
          data-testid="nav-level-2"
        >
          {activeCategory.items.map((item, index) => {
            const active = isItemActive(location, item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                data-testid={`nav-l2-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "relative whitespace-nowrap px-4 py-1.5 text-sm rounded-lg transition-all",
                  active
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/70 font-medium hover:text-white hover:bg-white/10"
                )}
              >
                <span className="text-white/50 mr-1.5">{index + 1})</span>
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNavigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
