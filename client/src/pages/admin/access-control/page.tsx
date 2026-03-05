import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Plus, Trash2, Pencil } from "lucide-react";
import { PageShell, PageHeader, StatGrid, StatCard, SectionCard } from "@/components/admin-shared";
import { StatusBadge } from "@/components/admin-shared";
import { FormDialog } from "@/components/admin-shared";
import { EmptyState } from "@/components/admin-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AccessRule {
  id: string;
  plan_slug: string;
  resource_type: string;
  resource_key: string;
  access_level: string;
  teaser_limit: number | null;
  created_at: string;
  updated_at: string;
}

const PLAN_TABS = [
  { slug: "free", label: "Free" },
  { slug: "pro", label: "Pro" },
  { slug: "mentorship", label: "Mentorship" },
] as const;

const KNOWN_PAGES = [
  "/winning-products",
  "/competitor-stores",
  "/categories",
  "/suppliers",
  "/tools/profit-calculator",
  "/tools/description-generator",
  "/tools/email-templates",
  "/tools/policy-generator",
  "/tools/invoice-generator",
  "/tools/cro-checklist",
  "/studio/model-studio",
  "/studio/whitelabelling",
  "/mentorship",
  "/meta-ads",
  "/videos",
  "/selling-channels",
  "/seasonal-collections",
  "/store-research",
  "/intelligence-hub",
  "/shipping-calculator",
  "/shopify-stores",
  "/fulfillment",
  "/resources",
  "/my-products",
  "/my-store",
  "/my-roadmap",
  "/my-rnd",
  "/my-sessions",
  "/my-credentials",
  "/my-plan",
];

const RESOURCE_TYPES = ["page", "feature", "content"];
const ACCESS_LEVELS = ["hidden", "locked", "teaser", "full"];

const accessLevelVariantMap: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = {
  full: "success",
  teaser: "warning",
  locked: "error",
  hidden: "neutral",
};

export default function AdminAccessControlPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState("free");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AccessRule | null>(null);

  const [formResourceType, setFormResourceType] = useState("page");
  const [formResourceKey, setFormResourceKey] = useState("");
  const [formCustomKey, setFormCustomKey] = useState("");
  const [formAccessLevel, setFormAccessLevel] = useState("locked");
  const [formTeaserLimit, setFormTeaserLimit] = useState("");

  const { data: rules = [], isLoading } = useQuery<AccessRule[]>({
    queryKey: ["/api/admin/access-rules"],
    queryFn: async () => {
      const res = await apiFetch("/api/admin/access-rules");
      if (!res.ok) throw new Error("Failed to fetch access rules");
      return res.json();
    },
  });

  const rulesForTab = rules.filter((r) => r.plan_slug === activeTab);

  const pageRules = rulesForTab.filter((r) => r.resource_type === "page");
  const featureRules = rulesForTab.filter((r) => r.resource_type === "feature");
  const contentRules = rulesForTab.filter((r) => r.resource_type === "content");

  const totalRules = rules.length;
  const hiddenCount = rules.filter((r) => r.access_level === "hidden").length;
  const lockedCount = rules.filter((r) => r.access_level === "locked").length;
  const teaserCount = rules.filter((r) => r.access_level === "teaser").length;

  const upsertMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await apiFetch("/api/admin/access-rules", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save rule");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/access-rules"] });
      showSuccess(editingRule ? "Rule updated" : "Rule created");
      closeDialog();
    },
    onError: (err: Error) => {
      showError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/admin/access-rules/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete rule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/access-rules"] });
      showSuccess("Rule deleted");
      setDeleteConfirm(null);
    },
    onError: (err: Error) => {
      showError(err.message);
    },
  });

  function openAddDialog() {
    setEditingRule(null);
    setFormResourceType("page");
    setFormResourceKey("");
    setFormCustomKey("");
    setFormAccessLevel("locked");
    setFormTeaserLimit("");
    setDialogOpen(true);
  }

  function openEditDialog(rule: AccessRule) {
    setEditingRule(rule);
    setFormResourceType(rule.resource_type);
    const isKnown = KNOWN_PAGES.includes(rule.resource_key);
    setFormResourceKey(isKnown ? rule.resource_key : "__custom__");
    setFormCustomKey(isKnown ? "" : rule.resource_key);
    setFormAccessLevel(rule.access_level);
    setFormTeaserLimit(rule.teaser_limit ? String(rule.teaser_limit) : "");
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingRule(null);
  }

  function handleSubmit() {
    const resourceKey = formResourceKey === "__custom__" ? formCustomKey : formResourceKey;
    if (!resourceKey) {
      showError("Resource key is required");
      return;
    }
    upsertMutation.mutate({
      plan_slug: activeTab,
      resource_type: formResourceType,
      resource_key: resourceKey,
      access_level: formAccessLevel,
      teaser_limit: formAccessLevel === "teaser" && formTeaserLimit ? parseInt(formTeaserLimit) : null,
    });
  }

  function handleInlineAccessChange(rule: AccessRule, newLevel: string) {
    upsertMutation.mutate({
      plan_slug: rule.plan_slug,
      resource_type: rule.resource_type,
      resource_key: rule.resource_key,
      access_level: newLevel,
      teaser_limit: newLevel === "teaser" ? rule.teaser_limit : null,
    });
  }

  function renderRulesList(rulesList: AccessRule[], typeLabel: string) {
    if (rulesList.length === 0) {
      return (
        <EmptyState
          title={`No ${typeLabel} rules`}
          description={`No ${typeLabel} access rules configured for this plan.`}
        />
      );
    }

    return (
      <div className="divide-y">
        {rulesList.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between gap-4 py-3 px-1"
            data-testid={`rule-row-${rule.id}`}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium truncate" data-testid={`text-rule-key-${rule.id}`}>
                {rule.resource_key}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {rule.resource_type}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {rule.teaser_limit && (
                <span className="text-xs text-muted-foreground" data-testid={`text-teaser-limit-${rule.id}`}>
                  Limit: {rule.teaser_limit}
                </span>
              )}
              <Select
                value={rule.access_level}
                onValueChange={(val) => handleInlineAccessChange(rule, val)}
              >
                <SelectTrigger className="h-7 w-24 text-xs" data-testid={`select-access-level-${rule.id}`}>
                  <StatusBadge
                    status={rule.access_level}
                    variant={accessLevelVariantMap[rule.access_level]}
                    className="text-[10px] px-1.5 py-0"
                  />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      <span className="capitalize">{level}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => openEditDialog(rule)}
                data-testid={`button-edit-rule-${rule.id}`}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setDeleteConfirm(rule)}
                data-testid={`button-delete-rule-${rule.id}`}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Access Control"
        subtitle="Configure per-plan access rules for pages, features, and content"
        actions={
          <Button size="sm" onClick={openAddDialog} data-testid="button-add-rule">
            <Plus className="size-4 mr-1.5" />
            Add Rule
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Rules" value={totalRules} icon={Shield} iconBg="rgba(59, 130, 246, 0.1)" iconColor="#3b82f6" />
        <StatCard label="Hidden" value={hiddenCount} icon={Shield} iconBg="rgba(100, 116, 139, 0.1)" iconColor="#64748b" />
        <StatCard label="Locked" value={lockedCount} icon={Shield} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#ef4444" />
        <StatCard label="Teaser" value={teaserCount} icon={Shield} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#f59e0b" />
      </StatGrid>

      <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1" data-testid="tabs-plan">
        {PLAN_TABS.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.slug
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            data-testid={`tab-${tab.slug}`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({rules.filter((r) => r.plan_slug === tab.slug).length})
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <SectionCard title="Page Rules" actions={
            <span className="text-xs text-muted-foreground">{pageRules.length} rules</span>
          }>
            {renderRulesList(pageRules, "page")}
          </SectionCard>

          <SectionCard title="Feature Rules" actions={
            <span className="text-xs text-muted-foreground">{featureRules.length} rules</span>
          }>
            {renderRulesList(featureRules, "feature")}
          </SectionCard>

          <SectionCard title="Content Rules" actions={
            <span className="text-xs text-muted-foreground">{contentRules.length} rules</span>
          }>
            {renderRulesList(contentRules, "content")}
          </SectionCard>
        </div>
      )}

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRule ? "Edit Access Rule" : "Add Access Rule"}
        onSubmit={handleSubmit}
        submitLabel={editingRule ? "Update" : "Create"}
        isSubmitting={upsertMutation.isPending}
      >
        <div className="space-y-1.5">
          <Label>Resource Type</Label>
          <Select value={formResourceType} onValueChange={setFormResourceType}>
            <SelectTrigger data-testid="select-resource-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  <span className="capitalize">{t}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Resource Key</Label>
          {formResourceType === "page" ? (
            <Select value={formResourceKey} onValueChange={setFormResourceKey}>
              <SelectTrigger data-testid="select-resource-key">
                <SelectValue placeholder="Select a page..." />
              </SelectTrigger>
              <SelectContent>
                {KNOWN_PAGES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
                <SelectItem value="__custom__">Custom path...</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={formCustomKey}
              onChange={(e) => setFormCustomKey(e.target.value)}
              placeholder="e.g. ai-studio-export"
              data-testid="input-resource-key"
            />
          )}
          {formResourceType === "page" && formResourceKey === "__custom__" && (
            <Input
              value={formCustomKey}
              onChange={(e) => setFormCustomKey(e.target.value)}
              placeholder="Enter custom path..."
              className="mt-1.5"
              data-testid="input-custom-resource-key"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Access Level</Label>
          <Select value={formAccessLevel} onValueChange={setFormAccessLevel}>
            <SelectTrigger data-testid="select-access-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCESS_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  <span className="capitalize">{l}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formAccessLevel === "teaser" && (
          <div className="space-y-1.5">
            <Label>Teaser Limit</Label>
            <Input
              type="number"
              value={formTeaserLimit}
              onChange={(e) => setFormTeaserLimit(e.target.value)}
              placeholder="Number of items to show"
              min={1}
              data-testid="input-teaser-limit"
            />
          </div>
        )}
      </FormDialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete Access Rule</DialogTitle>
            <DialogDescription>
              Remove the rule for <strong>{deleteConfirm?.resource_key}</strong> on the{" "}
              <strong>{deleteConfirm?.plan_slug}</strong> plan? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              data-testid="button-confirm-delete"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
