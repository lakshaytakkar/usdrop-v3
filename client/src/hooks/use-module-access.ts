import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { apiFetch } from "@/lib/supabase"

type AccessLevel = "full_access" | "limited_access" | "locked" | "hidden"

interface ModuleOverride {
  moduleId: string
  accessLevel: AccessLevel
}

interface ModuleOverridesResponse {
  overrides: ModuleOverride[]
}

export function useModuleAccess() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery<ModuleOverridesResponse>({
    queryKey: ["/api/user/module-overrides"],
    queryFn: async () => {
      const res = await apiFetch("/api/user/module-overrides");
      if (!res.ok) return { overrides: [] };
      return res.json();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const overridesMap = new Map<string, AccessLevel>()
  if (data?.overrides) {
    for (const o of data.overrides) {
      overridesMap.set(o.moduleId, o.accessLevel)
    }
  }

  function getModuleAccess(moduleId: string | undefined): AccessLevel | null {
    if (!moduleId) return null
    return overridesMap.get(moduleId) || null
  }

  return {
    getModuleAccess,
    isLoading,
    overrides: data?.overrides || [],
  }
}
