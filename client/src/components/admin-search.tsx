import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { apiFetch } from "@/lib/supabase";
import { Search, Users, Package, Ticket, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchUser { id: string; full_name: string; email: string; plan_slug: string; }
interface SearchProduct { id: string; name: string; status: string; }
interface SearchTicket { id: string; subject: string; status: string; user_name: string; }
interface SearchResults { users: SearchUser[]; products: SearchProduct[]; tickets: SearchTicket[]; }

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function AdminGlobalSearch() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

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

  return (
    <div ref={containerRef} className="relative hidden md:block" data-testid="admin-global-search">
      <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
      {loading && (
        <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground animate-spin z-10" />
      )}
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search... (⌘K)"
        className="h-8 w-56 pl-8 pr-8 text-sm bg-muted/30"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (hasResults) setOpen(true); }}
        data-testid="input-global-search"
      />

      {open && (
        <div className="absolute top-full mt-1.5 left-0 w-80 rounded-xl border bg-popover shadow-lg z-50 overflow-hidden">
          {!hasResults && !loading && debouncedQuery.length >= 2 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1">
              {results && results.users.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Users className="h-3 w-3" /> Users
                  </div>
                  {results.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => go(`/admin/users/${u.id}`)}
                      className="w-full flex items-start gap-2.5 px-3 py-2 hover:bg-accent text-left transition-colors"
                      data-testid={`search-result-user-${u.id}`}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 text-xs font-medium mt-0.5">
                        {(u.full_name[0] || "?").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <span className={cn(
                        "ml-auto shrink-0 self-center text-xs px-1.5 py-0.5 rounded font-medium",
                        u.plan_slug === "pro" ? "bg-purple-100 dark:bg-purple-950 text-purple-600" : "bg-muted text-muted-foreground"
                      )}>
                        {u.plan_slug === "pro" ? "Pro" : "Free"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results && results.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Package className="h-3 w-3" /> Products
                  </div>
                  {results.products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/admin/products/${p.id}`)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent text-left transition-colors"
                      data-testid={`search-result-product-${p.id}`}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 text-green-600 text-xs">
                        <Package className="h-3 w-3" />
                      </div>
                      <p className="text-sm truncate">{p.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {results && results.tickets.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Ticket className="h-3 w-3" /> Tickets
                  </div>
                  {results.tickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => go(`/admin/tickets/${t.id}`)}
                      className="w-full flex items-start gap-2.5 px-3 py-2 hover:bg-accent text-left transition-colors"
                      data-testid={`search-result-ticket-${t.id}`}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs">
                        <Ticket className="h-3 w-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.user_name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
