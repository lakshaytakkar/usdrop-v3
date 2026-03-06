import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "wouter";
import { apiFetch } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/hooks/use-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Send,
  Copy,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpCircle,
  Lock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageShell, StatusBadge } from "@/components/admin-shared";
import { cn } from "@/lib/utils";

interface TicketUser {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  account_type?: string;
  phone_number?: string;
}

interface Ticket {
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

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  sender: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    internal_role?: string;
  } | null;
}

interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
}

const TICKET_STATUSES = ["open", "in_progress", "escalated", "resolved", "closed"];
const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"];

export default function AdminTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketRes, messagesRes] = await Promise.all([
        apiFetch(`/api/admin/tickets/${id}`),
        apiFetch(`/api/admin/tickets/${id}/messages`),
      ]);
      if (ticketRes.ok) {
        const tData = await ticketRes.json();
        setTicket(tData.ticket);
        setResolutionNotes(tData.ticket?.resolution_notes || "");
      }
      if (messagesRes.ok) {
        const mData = await messagesRes.json();
        setMessages(mData.messages || []);
      }
    } catch {
      showError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  const fetchAdminUsers = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/internal-users");
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(
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
    fetchTicket();
    fetchAdminUsers();
  }, [fetchTicket, fetchAdminUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    try {
      setSending(true);
      const res = await apiFetch(`/api/admin/tickets/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({
          content: replyContent.trim(),
          is_internal: isInternal,
        }),
      });
      if (res.ok) {
        setReplyContent("");
        fetchTicket();
      } else {
        showError("Failed to send message");
      }
    } catch {
      showError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      const endpoint =
        newStatus === "resolved"
          ? `/api/admin/tickets/${ticket.id}/resolve`
          : `/api/admin/tickets/${ticket.id}`;
      const body =
        newStatus === "resolved"
          ? { resolution_notes: resolutionNotes }
          : { status: newStatus };
      const res = await apiFetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showSuccess(`Ticket ${newStatus.replace("_", " ")}`);
        fetchTicket();
      } else {
        showError("Failed to update status");
      }
    } catch {
      showError("Failed to update status");
    }
  };

  const handleAssign = async (assignedTo: string) => {
    if (!ticket) return;
    try {
      const res = await apiFetch(`/api/admin/tickets/${ticket.id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ assigned_to: assignedTo }),
      });
      if (res.ok) {
        showSuccess("Ticket assigned");
        fetchTicket();
      } else {
        showError("Failed to assign ticket");
      }
    } catch {
      showError("Failed to assign ticket");
    }
  };

  const handleEscalate = async (escalatedTo: string) => {
    if (!ticket) return;
    try {
      const res = await apiFetch(`/api/admin/tickets/${ticket.id}/escalate`, {
        method: "PATCH",
        body: JSON.stringify({ escalated_to: escalatedTo }),
      });
      if (res.ok) {
        showSuccess("Ticket escalated");
        fetchTicket();
      } else {
        showError("Failed to escalate ticket");
      }
    } catch {
      showError("Failed to escalate ticket");
    }
  };

  const handleSaveResolution = async () => {
    if (!ticket) return;
    try {
      const res = await apiFetch(`/api/admin/tickets/${ticket.id}`, {
        method: "PATCH",
        body: JSON.stringify({ resolution_notes: resolutionNotes }),
      });
      if (res.ok) {
        showSuccess("Resolution notes saved");
        fetchTicket();
      } else {
        showError("Failed to save notes");
      }
    } catch {
      showError("Failed to save notes");
    }
  };

  const copyWhatsApp = () => {
    if (!ticket?.user?.phone_number) {
      showError("No phone number available for this client");
      return;
    }
    const phone = ticket.user.phone_number.replace(/\D/g, "");
    const msg = `Hi ${ticket.user.full_name || "there"}, regarding your support ticket "${ticket.title}" (#${ticket.id.slice(0, 8)}), `;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    navigator.clipboard.writeText(url);
    showSuccess("WhatsApp link copied");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="size-4 text-amber-500" />;
      case "in_progress":
        return <Clock className="size-4 text-blue-500" />;
      case "escalated":
        return <ArrowUpCircle className="size-4 text-red-500" />;
      case "resolved":
        return <CheckCircle2 className="size-4 text-emerald-500" />;
      case "closed":
        return <Lock className="size-4 text-slate-500" />;
      default:
        return <AlertCircle className="size-4" />;
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-96 bg-muted/50 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-muted/50 rounded-xl animate-pulse" />
              <div className="h-48 bg-muted/50 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!ticket) {
    return (
      <PageShell>
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground" data-testid="text-ticket-not-found">
            Ticket not found
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/admin/tickets")}
            data-testid="button-back-to-tickets"
          >
            Back to Tickets
          </Button>
        </div>
      </PageShell>
    );
  }

  const statusLabel = ticket.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const statusVariant =
    ticket.status === "open"
      ? "warning"
      : ticket.status === "in_progress"
      ? "info"
      : ticket.status === "escalated"
      ? "error"
      : ticket.status === "resolved"
      ? "success"
      : "neutral";

  return (
    <PageShell>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.push("/admin/tickets")}
          data-testid="button-back"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusIcon(ticket.status)}
            <h1
              className="text-xl font-bold font-heading text-foreground truncate"
              data-testid="text-ticket-title"
            >
              {ticket.title}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-ticket-id">
            Ticket #{ticket.id.slice(0, 8)} &middot; Created{" "}
            {format(new Date(ticket.created_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={copyWhatsApp}
            data-testid="button-copy-whatsapp"
          >
            <Copy className="size-3.5 mr-1.5" />
            Copy WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="flex flex-col overflow-visible">
            <div className="flex items-center justify-between gap-2 border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold font-heading">Messages</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[500px] min-h-[200px]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="size-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground" data-testid="text-no-messages">
                    No messages yet. Start the conversation below.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = !!msg.sender?.internal_role;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3",
                        isAdmin ? "flex-row-reverse" : "flex-row"
                      )}
                      data-testid={`message-${msg.id}`}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={msg.sender?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(msg.sender?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-lg px-4 py-2.5",
                          msg.is_internal
                            ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                            : isAdmin
                            ? "bg-primary/10 dark:bg-primary/20"
                            : "bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {msg.sender?.full_name || msg.sender?.email || "Unknown"}
                          </span>
                          {msg.is_internal && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap" data-testid={`text-message-content-${msg.id}`}>
                          {msg.content}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {format(new Date(msg.created_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  variant={!isInternal ? "default" : "outline"}
                  onClick={() => setIsInternal(false)}
                  data-testid="button-reply-client"
                >
                  <User className="size-3.5 mr-1" />
                  Client Reply
                </Button>
                <Button
                  size="sm"
                  variant={isInternal ? "default" : "outline"}
                  onClick={() => setIsInternal(true)}
                  data-testid="button-reply-internal"
                >
                  <Lock className="size-3.5 mr-1" />
                  Internal Note
                </Button>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={
                    isInternal
                      ? "Add an internal note (not visible to client)..."
                      : "Type your reply to the client..."
                  }
                  className="resize-none text-sm flex-1"
                  rows={3}
                  data-testid="input-reply"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSendReply();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSendReply}
                  disabled={!replyContent.trim() || sending}
                  data-testid="button-send-reply"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {ticket.user && (
            <Card className="overflow-visible">
              <div className="border-b px-5 py-3.5">
                <h3 className="text-sm font-semibold font-heading">Client</h3>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="size-10">
                    <AvatarImage src={ticket.user.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(ticket.user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      data-testid="text-client-name"
                    >
                      {ticket.user.full_name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ticket.user.email}
                    </p>
                  </div>
                </div>
                {ticket.user.account_type && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-muted-foreground">Account</span>
                    <StatusBadge status={ticket.user.account_type} />
                  </div>
                )}
                {ticket.user.phone_number && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <span className="text-xs font-medium">{ticket.user.phone_number}</span>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => router.push(`/admin/users/${ticket.user!.id}`)}
                  data-testid="button-view-client-profile"
                >
                  View Full Profile
                </Button>
              </div>
            </Card>
          )}

          <Card className="overflow-visible">
            <div className="border-b px-5 py-3.5">
              <h3 className="text-sm font-semibold font-heading">Ticket Details</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-auto h-7 text-xs" data-testid="select-ticket-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Priority</span>
                <Select
                  value={ticket.priority}
                  onValueChange={async (val) => {
                    try {
                      const res = await apiFetch(`/api/admin/tickets/${ticket.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ priority: val }),
                      });
                      if (res.ok) {
                        showSuccess("Priority updated");
                        fetchTicket();
                      }
                    } catch {
                      showError("Failed to update priority");
                    }
                  }}
                >
                  <SelectTrigger className="w-auto h-7 text-xs" data-testid="select-ticket-priority">
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
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs font-medium">
                  {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Created</span>
                <span className="text-xs">
                  {format(new Date(ticket.created_at), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Updated</span>
                <span className="text-xs">
                  {format(new Date(ticket.updated_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </Card>

          <Card className="overflow-visible">
            <div className="border-b px-5 py-3.5">
              <h3 className="text-sm font-semibold font-heading">Assignment</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Assigned To</Label>
                <Select
                  value={ticket.assigned_to || "unassigned"}
                  onValueChange={(val) => {
                    if (val !== "unassigned") handleAssign(val);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs" data-testid="select-assigned-to">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {adminUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.full_name || u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {ticket.escalated && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Escalated To</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={ticket.escalated.avatar_url || undefined} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(ticket.escalated.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {ticket.escalated.full_name || ticket.escalated.email}
                    </span>
                  </div>
                </div>
              )}

              {!ticket.escalated && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Escalate To</Label>
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val) handleEscalate(val);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs" data-testid="select-escalate-to">
                      <SelectValue placeholder="Select admin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {adminUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.full_name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-visible">
            <div className="border-b px-5 py-3.5">
              <h3 className="text-sm font-semibold font-heading">Resolution Notes</h3>
            </div>
            <div className="p-5">
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add resolution notes..."
                className="resize-none text-sm"
                rows={4}
                data-testid="input-resolution-notes"
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full"
                onClick={handleSaveResolution}
                data-testid="button-save-resolution"
              >
                Save Notes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
