import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/hooks/use-router";
import { format } from "date-fns";
import {
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowUpCircle,
  RefreshCw,
} from "lucide-react";
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
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TicketUser {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  account_type?: string;
}

interface TicketRow {
  id: string;
  user_id: string | null;
  title: string;
  type: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  escalated_to: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  user: TicketUser | null;
  assigned: TicketUser | null;
  escalated: TicketUser | null;
}

const TICKET_TYPES = ["general", "technical", "billing", "account", "shipping", "other"];
const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"];
const TICKET_STATUSES = ["open", "in_progress", "escalated", "resolved", "closed"];

export default function AdminTickets() {
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("general");
  const [formPriority, setFormPriority] = useState("medium");
  const [formUserId, setFormUserId] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [users, setUsers] = useState<{ id: string; full_name: string | null; email: string }[]>([]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/admin/tickets?pageSize=500");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch {
      showError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/external-users");
      if (res.ok) {
        const data = await res.json();
        setUsers(
          (data.users || data || []).map((u: any) => ({
            id: u.id,
            full_name: u.full_name,
            email: u.email,
          }))
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, [fetchTickets, fetchUsers]);

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const escalatedCount = tickets.filter((t) => t.status === "escalated").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  const handleCreate = async () => {
    if (!formTitle.trim()) {
      showError("Title is required");
      return;
    }
    try {
      setSubmitting(true);
      const res = await apiFetch("/api/admin/tickets", {
        method: "POST",
        body: JSON.stringify({
          title: formTitle.trim(),
          type: formType,
          priority: formPriority,
          user_id: formUserId || null,
        }),
      });
      if (res.ok) {
        showSuccess("Ticket created");
        setDialogOpen(false);
        resetForm();
        fetchTickets();
      } else {
        showError("Failed to create ticket");
      }
    } catch {
      showError("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await apiFetch(`/api/admin/tickets/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        showSuccess("Ticket deleted");
        fetchTickets();
      } else {
        showError("Failed to delete ticket");
      }
    } catch {
      showError("Failed to delete ticket");
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const endpoint =
        newStatus === "resolved"
          ? `/api/admin/tickets/${ticketId}/resolve`
          : `/api/admin/tickets/${ticketId}`;
      const body =
        newStatus === "resolved"
          ? {}
          : { status: newStatus };
      const res = await apiFetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showSuccess(`Ticket ${newStatus.replace("_", " ")}`);
        fetchTickets();
      } else {
        showError("Failed to update ticket");
      }
    } catch {
      showError("Failed to update ticket");
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormType("general");
    setFormPriority("medium");
    setFormUserId("");
    setFormDescription("");
  };

  const columns: Column<TicketRow>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (t) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground" data-testid={`text-ticket-title-${t.id}`}>
            {t.title}
          </span>
          <span className="text-xs text-muted-foreground">#{t.id.slice(0, 8)}</span>
        </div>
      ),
    },
    {
      key: "user",
      header: "Client",
      render: (t) => (
        <span className="text-sm" data-testid={`text-ticket-client-${t.id}`}>
          {t.user?.full_name || t.user?.email || "Unassigned"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (t) => (
        <StatusBadge status={t.type.charAt(0).toUpperCase() + t.type.slice(1)} variant="info" />
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (t) => {
        const v =
          t.priority === "urgent" || t.priority === "high"
            ? "error"
            : t.priority === "medium"
            ? "warning"
            : "neutral";
        return (
          <StatusBadge
            status={t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
            variant={v as any}
          />
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (t) => {
        const label = t.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const v =
          t.status === "open"
            ? "warning"
            : t.status === "in_progress"
            ? "info"
            : t.status === "escalated"
            ? "error"
            : t.status === "resolved"
            ? "success"
            : "neutral";
        return <StatusBadge status={label} variant={v as any} />;
      },
    },
    {
      key: "assigned",
      header: "Assigned To",
      render: (t) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-ticket-assigned-${t.id}`}>
          {t.assigned?.full_name || t.assigned?.email || "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      sortable: true,
      render: (t) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(t.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  const rowActions: RowAction<TicketRow>[] = [
    {
      label: "Open",
      onClick: (t) => router.push(`/admin/tickets/${t.id}`),
    },
    {
      label: "Assign to Me",
      onClick: async (t) => {
        try {
          const meRes = await apiFetch("/api/auth/user");
          if (meRes.ok) {
            const me = await meRes.json();
            const res = await apiFetch(`/api/admin/tickets/${t.id}/assign`, {
              method: "PATCH",
              body: JSON.stringify({ assigned_to: me.user?.id || me.id }),
            });
            if (res.ok) {
              showSuccess("Ticket assigned to you");
              fetchTickets();
            }
          }
        } catch {
          showError("Failed to assign ticket");
        }
      },
    },
    {
      label: "Resolve",
      onClick: (t) => handleStatusChange(t.id, "resolved"),
    },
    {
      label: "Escalate",
      onClick: async (t) => {
        try {
          const meRes = await apiFetch("/api/auth/user");
          if (meRes.ok) {
            const me = await meRes.json();
            const res = await apiFetch(`/api/admin/tickets/${t.id}/escalate`, {
              method: "PATCH",
              body: JSON.stringify({ escalated_to: me.user?.id || me.id }),
            });
            if (res.ok) {
              showSuccess("Ticket escalated");
              fetchTickets();
            }
          }
        } catch {
          showError("Failed to escalate ticket");
        }
      },
    },
    {
      label: "Close",
      onClick: (t) => handleStatusChange(t.id, "closed"),
    },
    {
      label: "Delete",
      variant: "destructive",
      separator: true,
      onClick: (t) => setDeleteId(t.id),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Support Tickets"
        subtitle="Manage support tickets and customer issues"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchTickets}
              data-testid="button-refresh-tickets"
            >
              <RefreshCw className="size-3.5 mr-1.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              data-testid="button-create-ticket"
            >
              <Plus className="size-3.5 mr-1.5" />
              Create Ticket
            </Button>
          </div>
        }
      />

      <StatGrid>
        <StatCard
          label="Open"
          value={openCount}
          icon={AlertCircle}
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={Clock}
          iconBg="rgba(59, 130, 246, 0.1)"
          iconColor="#3b82f6"
        />
        <StatCard
          label="Escalated"
          value={escalatedCount}
          icon={ArrowUpCircle}
          iconBg="rgba(239, 68, 68, 0.1)"
          iconColor="#ef4444"
        />
        <StatCard
          label="Resolved / Closed"
          value={resolvedCount}
          icon={CheckCircle2}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
      </StatGrid>

      <DataTable
        data={tickets}
        columns={columns}
        searchPlaceholder="Search tickets..."
        rowActions={rowActions}
        onRowClick={(t) => router.push(`/admin/tickets/${t.id}`)}
        isLoading={loading}
        emptyTitle="No tickets yet"
        emptyDescription="Create a support ticket to get started."
        filters={[
          {
            label: "Status",
            key: "status",
            options: TICKET_STATUSES.map((s) => s),
          },
          {
            label: "Type",
            key: "type",
            options: TICKET_TYPES,
          },
          {
            label: "Priority",
            key: "priority",
            options: TICKET_PRIORITIES,
          },
        ]}
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Create Ticket"
        onSubmit={handleCreate}
        submitLabel="Create"
        isSubmitting={submitting}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ticket-title">Title</Label>
          <Input
            id="ticket-title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Brief description of the issue"
            data-testid="input-ticket-title"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ticket-client">Client (optional)</Label>
          <Select value={formUserId} onValueChange={setFormUserId}>
            <SelectTrigger data-testid="select-ticket-client">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No client</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.full_name || u.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-type">Type</Label>
            <Select value={formType} onValueChange={setFormType}>
              <SelectTrigger data-testid="select-ticket-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TICKET_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-priority">Priority</Label>
            <Select value={formPriority} onValueChange={setFormPriority}>
              <SelectTrigger data-testid="select-ticket-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TICKET_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <Dialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              This will permanently delete this ticket and all its messages. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(null)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
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
