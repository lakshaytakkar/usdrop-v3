import { useLocation, Link } from "wouter";
import { Bell, UserPlus, LifeBuoy, Building2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminGlobalSearch } from "@/components/admin-search";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";

interface AdminNotification {
  id: string;
  type: "signup" | "ticket" | "llc";
  title: string;
  description: string;
  timestamp: string;
  link: string;
}

function formatRelativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const STORAGE_KEY = "admin_notifications_read_at";

function NotificationIcon({ type }: { type: AdminNotification["type"] }) {
  if (type === "signup") return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"><UserPlus className="h-4 w-4 text-blue-600" /></div>;
  if (type === "ticket") return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30"><LifeBuoy className="h-4 w-4 text-amber-600" /></div>;
  return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30"><Building2 className="h-4 w-4 text-purple-600" /></div>;
}

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readAt, setReadAt] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10); } catch { return 0; }
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const unreadCount = notifications.filter(n => new Date(n.timestamp).getTime() > readAt).length;

  const markAllRead = () => {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, String(now));
    setReadAt(now);
  };

  const handleClick = (n: AdminNotification) => {
    setOpen(false);
    window.location.href = n.link;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative" data-testid="button-notifications">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0" data-testid="popover-notifications">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={markAllRead} data-testid="button-mark-all-read">
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const isUnread = new Date(n.timestamp).getTime() > readAt;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                      isUnread && "bg-blue-50/50 dark:bg-blue-950/20"
                    )}
                    data-testid={`notification-item-${n.id}`}
                  >
                    <NotificationIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-muted-foreground">{n.title}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(n.timestamp)}</span>
                      </div>
                      <p className="mt-0.5 truncate text-sm font-medium">{n.description}</p>
                    </div>
                    {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2.5 text-center">
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => { setOpen(false); window.location.href = "/admin/users"; }}
            data-testid="button-view-all-notifications"
          >
            View all users →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
    title: "Communications",
    defaultUrl: "/admin/email/templates",
    items: [
      { title: "Email Templates", url: "/admin/email/templates" },
      { title: "Email Automations", url: "/admin/email/automations" },
      { title: "Email Logs", url: "/admin/email/logs" },
      { title: "SMS Templates", url: "/admin/sms/templates" },
      { title: "SMS Automations", url: "/admin/sms/automations" },
      { title: "SMS Logs", url: "/admin/sms/logs" },
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
  const [location, navigate] = useLocation();
  const { signOut } = useAuth();
  const { fullName, internalRole, avatarUrl } = useUserMetadata();
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
          <AdminGlobalSearch />

          <NotificationsBell />

          <Separator orientation="vertical" className="h-5" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                <Avatar className="size-8">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 px-2 py-2.5">
                <Avatar className="size-10">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{fullName || "Admin"}</span>
                  <span className="text-xs text-muted-foreground capitalize">{internalRole || "Admin"}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => navigate("/admin/profile")} data-testid="menu-item-profile">My Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => navigate("/admin/settings")} data-testid="menu-item-settings">Account Settings</DropdownMenuItem>
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
