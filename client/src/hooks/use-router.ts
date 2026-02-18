import { useLocation, useParams as useWouterParams, useSearch } from 'wouter';

export function useRouter() {
  const [location, setLocation] = useLocation();
  return {
    push: (path: string) => setLocation(path),
    replace: (path: string) => setLocation(path, { replace: true }),
    back: () => window.history.back(),
    refresh: () => window.location.reload(),
    pathname: location,
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useWouterParams() as T;
}

export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const setParams = (newParams: URLSearchParams) => {
    const newSearch = newParams.toString();
    window.history.replaceState(null, '', newSearch ? `?${newSearch}` : window.location.pathname);
  };
  return [params, setParams];
}

export function usePathname(): string {
  const [location] = useLocation();
  return location;
}
