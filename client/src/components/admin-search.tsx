import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { apiFetch } from "@/lib/supabase";
import { Search, Users, Package, Ticket, Loader2, ArrowRight, Shield, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchUser {
  id: string;
  full_name: string;
  email: string;
  plan_slug: string;
  plan_name: string;
  internal_role: string | null;
  phone_number: string | null;
}
interface SearchProduct { id: string; name: string; status: string; }
interface SearchTicket { id: string; subject: string; status: string; user_name: string; }
interface SearchResults {
  users: SearchUser[];
  products: SearchProduct[];
  tickets: SearchTicket[];
  totalUsers: number;
  isPlanQuery?: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const PLAN_TIPS = ["pro", "free"];

export function AdminGlobalSearch() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    apiFetch(`/api/admin/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data);
        setOpen(true);
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const go = useCallback((path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  }, [navigate]);

  const hasResults = results && (results.users.length + results.products.length + results.tickets.length) > 0;
  const showMoreUsers = results && results.totalUsers > results.users.length;

  return (
    <div ref={containerRef} className="relative hidden md:block" data-testid="admin-global-search">
      <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
      {loading && (
        <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground animate-spin z-10" />
      )}
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search users, products... (⌘K)"
        className="h-8 w-64 pl-8 pr-8 text-sm bg-muted/30"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (hasResults) setOpen(true); }}
        data-testid="input-global-search"
      />

      {open && (
        <div className="absolute top-full mt-1.5 right-0 w-96 rounded-xl border bg-popover shadow-xl z-50 overflow-hidden">
          {!hasResults && !loading && debouncedQuery.length >= 2 ? (
            <div className="px-4 py-8 text-center space-y-1">
              <p className="text-sm font-medium">No results for &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-xs text-muted-foreground">
                Try searching by name, email, or type &ldquo;pro&rdquo; / &ldquo;free&rdquo; to filter by plan
              </p>
            </div>
          ) : (
            <div className="max-h-[480px] overflow-y-auto divide-y divide-border/50">

              {results && results.users.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <Users className="h-3 w-3" />
                      {results.isPlanQuery ? `${debouncedQuery.charAt(0).toUpperCase() + debouncedQuery.slice(1)} Users` : "Users"}
                    </div>
                    <span className="text-xs text-muted-foreground">{results.totalUsers} found</span>
                  </div>

                  {results.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => go(`/admin/users/${u.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
                      data-testid={`search-result-user-${u.id}`}
                    >
                      <div className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        u.internal_role
                          ? "bg-orange-100 dark:bg-orange-950 text-orange-600"
                          : u.plan_slug === "pro"
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-600"
                          : "bg-blue-100 dark:bg-blue-950 text-blue-600"
                      )}>
                        {(u.full_name[0] || "?").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate leading-tight">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <span className={cn(
                        "shrink-0 text-xs px-1.5 py-0.5 rounded font-medium",
                        u.internal_role
                          ? "bg-orange-100 dark:bg-orange-950 text-orange-600"
                          : u.plan_slug === "pro"
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-600"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {u.internal_role
                          ? u.internal_role.replace(/_/g, " ")
                          : u.plan_slug === "pro" ? "Pro" : "Free"}
                      </span>
                    </button>
                  ))}

                  {showMoreUsers && (
                    <button
                      onClick={() => go(`/admin/users?search=${encodeURIComponent(debouncedQuery)}`)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-primary hover:bg-accent transition-colors font-medium"
                      data-testid="search-view-all-users"
                    >
                      View all {results.totalUsers} results
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {results && results.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Package className="h-3 w-3" /> Products
                  </div>
                  {results.products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/admin/products/${p.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
                      data-testid={`search-result-product-${p.id}`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 text-green-600">
                        <Package className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{p.name}</p>
                      </div>
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                        {p.status || "active"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results && results.tickets.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Ticket className="h-3 w-3" /> Support Tickets
                  </div>
                  {results.tickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => go(`/admin/tickets/${t.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
                      data-testid={`search-result-ticket-${t.id}`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600">
                        <Ticket className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{t.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.user_name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {PLAN_TIPS.includes(debouncedQuery.toLowerCase()) && results?.users && results.users.length > 0 && (
                <div className="px-3 py-2 bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    Tip: Showing {debouncedQuery.toLowerCase()} plan users. Showing {results.users.length} of {results.totalUsers}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
