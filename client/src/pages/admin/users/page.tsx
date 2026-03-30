import { apiFetch } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/hooks/use-router";
import { Button } from "@/components/ui/button";
import { Download, Users, UserCheck, Shield, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  type Column,
  type RowAction,
} from "@/components/admin-shared";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  account_type: string;
  internal_role: string | null;
  status: string;
  phone_number: string | null;
  onboarding_completed: boolean;
  subscription_plan_id: string | null;
  plan_name: string | null;
  plan_slug: string | null;
  created_at: string;
  updated_at: string;
}

interface PlanOption {
  id: string;
  name: string;
  slug: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRoleLabel(user: UserRow): string {
  if (user.internal_role) {
    return user.internal_role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "External User";
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ pro: 0, free: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlanOption[]>([]);

  const [editRoleDialog, setEditRoleDialog] = useState<{ open: boolean; user: UserRow | null }>({ open: false, user: null });
  const [changePlanDialog, setChangePlanDialog] = useState<{ open: boolean; user: UserRow | null }>({ open: false, user: null });
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/admin/users?pageSize=200");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/plans");
      if (!response.ok) return;
      const data = await response.json();
      setPlans((data.plans || []).map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })));
    } catch {
      // plans are optional
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, [fetchUsers, fetchPlans]);

  const handleUpdateUser = useCallback(
    async (userId: string, updates: Record<string, any>, successMsg: string) => {
      try {
        setIsSubmitting(true);
        const res = await apiFetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update user");
        showSuccess(successMsg);
        fetchUsers();
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to update user");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, showSuccess, showError]
  );

  const handleSuspendToggle = useCallback(
    async (user: UserRow) => {
      const newStatus = user.status === "suspended" ? "active" : "suspended";
      await handleUpdateUser(
        user.id,
        { status: newStatus },
        `User ${newStatus === "suspended" ? "suspended" : "reactivated"}`
      );
    },
    [handleUpdateUser]
  );

  const handleExportCSV = useCallback(() => {
    const headers = ["Name", "Email", "Account Type", "Role", "Plan", "Status", "Created"];
    const rows = users.map((u) => [
      u.full_name,
      u.email,
      u.account_type,
      getRoleLabel(u),
      u.plan_name || "No Plan",
      u.status,
      new Date(u.created_at).toLocaleDateString(),
    ]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("CSV exported successfully");
  }, [users, showSuccess]);

  const suspendedCount = stats.suspended;

  const columns: Column<UserRow>[] = [
    {
      key: "full_name",
      header: "User",
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={u.avatar_url || undefined} alt={u.full_name} />
            <AvatarFallback className="text-xs">{getInitials(u.full_name || u.email)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium" data-testid={`text-user-name-${u.id}`}>{u.full_name || "Unnamed"}</p>
            <p className="text-xs text-muted-foreground" data-testid={`text-user-email-${u.id}`}>{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "account_type",
      header: "Type",
      sortable: true,
      render: (u) => <StatusBadge status={u.plan_slug === "pro" ? "Pro" : "Free"} />,
    },
    {
      key: "internal_role",
      header: "Role",
      render: (u) => (
        <span className="text-sm text-muted-foreground">{getRoleLabel(u)}</span>
      ),
    },
    {
      key: "plan_name",
      header: "Plan",
      render: (u) => (
        <span className="text-sm" data-testid={`text-plan-${u.id}`}>{u.plan_name || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (u) => <StatusBadge status={u.status || "active"} />,
    },
    {
      key: "onboarding_completed",
      header: "Onboarding",
      render: (u) => (
        <StatusBadge status={u.onboarding_completed ? "Completed" : "Pending"} />
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      sortable: true,
      render: (u) => (
        <span className="text-sm text-muted-foreground">
          {new Date(u.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const rowActions: RowAction<UserRow>[] = [
    {
      label: "View",
      onClick: (u) => router.push(`/admin/users/${u.id}`),
    },
    {
      label: "Edit Role",
      onClick: (u) => {
        setSelectedRole(u.internal_role || "external");
        setEditRoleDialog({ open: true, user: u });
      },
    },
    {
      label: "Change Plan",
      onClick: (u) => {
        setSelectedPlan(u.subscription_plan_id || "none");
        setChangePlanDialog({ open: true, user: u });
      },
    },
    {
      label: "Suspend",
      onClick: handleSuspendToggle,
      variant: "destructive",
      separator: true,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Users"
        subtitle="All platform users — clients, team members, and leads"
        actions={
          <Button size="sm" variant="outline" onClick={handleExportCSV} data-testid="button-export-csv">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Users" value={total} icon={Users} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" />
        <StatCard label="Free Users" value={stats.free} icon={UserCheck} iconBg="rgba(34,197,94,0.1)" iconColor="#22c55e" />
        <StatCard label="Pro Users" value={stats.pro} icon={Shield} iconBg="rgba(168,85,247,0.1)" iconColor="#a855f7" />
        <StatCard label="Suspended" value={suspendedCount} icon={UserX} iconBg="rgba(239,68,68,0.1)" iconColor="#ef4444" />
      </StatGrid>

      <DataTable
        data={users}
        columns={columns}
        rowActions={rowActions}
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
        searchPlaceholder="Search by name or email..."
        isLoading={loading}
        emptyTitle="No users found"
        emptyDescription="No users match your search criteria."
        filters={[
          { label: "Type", key: "account_type", options: ["free", "pro"] },
          { label: "Status", key: "status", options: ["active", "suspended", "inactive"] },
        ]}
        pageSize={20}
      />

      <Dialog open={editRoleDialog.open} onOpenChange={(open) => setEditRoleDialog({ open, user: open ? editRoleDialog.user : null })}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Change role for {editRoleDialog.user?.full_name || editRoleDialog.user?.email}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-1.5" data-testid="select-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="external">External User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditRoleDialog({ open: false, user: null })} data-testid="button-cancel-role">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={async () => {
                if (!editRoleDialog.user) return;
                await handleUpdateUser(
                  editRoleDialog.user.id,
                  { internal_role: selectedRole === "external" ? null : selectedRole },
                  "Role updated successfully"
                );
                setEditRoleDialog({ open: false, user: null });
              }}
              data-testid="button-save-role"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={changePlanDialog.open} onOpenChange={(open) => setChangePlanDialog({ open, user: open ? changePlanDialog.user : null })}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>Update subscription plan for {changePlanDialog.user?.full_name || changePlanDialog.user?.email}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="mt-1.5" data-testid="select-plan">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Plan</SelectItem>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="outline" onClick={() => setChangePlanDialog({ open: false, user: null })} data-testid="button-cancel-plan">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={async () => {
                if (!changePlanDialog.user) return;
                await handleUpdateUser(
                  changePlanDialog.user.id,
                  { subscription_plan_id: selectedPlan === "none" ? null : selectedPlan },
                  "Plan updated successfully"
                );
                setChangePlanDialog({ open: false, user: null });
              }}
              data-testid="button-save-plan"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
