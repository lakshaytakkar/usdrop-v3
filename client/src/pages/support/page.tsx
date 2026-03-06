import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, ArrowLeft, Clock, CheckCircle2, AlertCircle, Loader2, MessageSquare, LifeBuoy } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface TicketMessage {
  id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    internal_role: string | null;
  } | null;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  open: { label: "Open", variant: "default", icon: AlertCircle },
  in_progress: { label: "In Progress", variant: "secondary", icon: Clock },
  escalated: { label: "Escalated", variant: "destructive", icon: AlertCircle },
  resolved: { label: "Resolved", variant: "outline", icon: CheckCircle2 },
  closed: { label: "Closed", variant: "outline", icon: CheckCircle2 },
};

const TYPE_LABELS: Record<string, string> = {
  technical: "Technical",
  billing: "Billing",
  account: "Account",
  content: "Content",
  other: "Other",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SupportPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("other");
  const [newDescription, setNewDescription] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const { data: tickets, isLoading: ticketsLoading } = useQuery<Ticket[]>({
    queryKey: ["/api/support/tickets"],
    queryFn: async () => {
      const res = await apiFetch("/api/support/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
  });

  const { data: ticketDetail, isLoading: detailLoading } = useQuery<{
    ticket: Ticket;
    messages: TicketMessage[];
  }>({
    queryKey: ["/api/support/tickets", selectedTicketId],
    queryFn: async () => {
      const res = await apiFetch(`/api/support/tickets/${selectedTicketId}`);
      if (!res.ok) throw new Error("Failed to fetch ticket");
      return res.json();
    },
    enabled: !!selectedTicketId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch("/api/support/tickets", {
        method: "POST",
        body: JSON.stringify({ title: newTitle, type: newType, description: newDescription }),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setShowNewTicket(false);
      setNewTitle("");
      setNewType("other");
      setNewDescription("");
      toast({ title: "Ticket submitted", description: "We'll get back to you as soon as possible." });
    },
    onError: () => {
      toast({ title: "Failed to create ticket", variant: "destructive" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/support/tickets/${selectedTicketId}/reply`, {
        method: "POST",
        body: JSON.stringify({ content: replyContent }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/support/tickets", selectedTicketId] });
      qc.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setReplyContent("");
      toast({ title: "Reply sent" });
    },
    onError: () => {
      toast({ title: "Failed to send reply", variant: "destructive" });
    },
  });

  if (selectedTicketId && detailLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (selectedTicketId && !ticketDetail && !detailLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <button
          onClick={() => setSelectedTicketId(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back-to-tickets-error"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <p className="font-medium">Failed to load ticket</p>
            <p className="text-sm text-muted-foreground mt-1">
              The ticket could not be found or an error occurred.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedTicketId && ticketDetail) {
    const { ticket, messages } = ticketDetail;
    const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
    const StatusIcon = statusConf.icon;
    const canReply = ticket.status !== "closed" && ticket.status !== "resolved";

    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <button
          onClick={() => setSelectedTicketId(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back-to-tickets"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </button>

        <div className="space-y-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-semibold" data-testid="text-ticket-title">{ticket.title}</h1>
            <Badge variant={statusConf.variant} className="shrink-0" data-testid="badge-ticket-status">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConf.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-ticket-meta">
            {TYPE_LABELS[ticket.type] || ticket.type} · Created {formatDate(ticket.created_at)}
          </p>
        </div>

        {ticket.resolution_notes && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Resolution</p>
              <p className="text-sm text-green-700 dark:text-green-300" data-testid="text-resolution-notes">{ticket.resolution_notes}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">Conversation</h2>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isStaff = msg.sender?.internal_role && msg.sender.internal_role !== "user";
                return (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-4 ${
                      isStaff
                        ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                        : "bg-muted"
                    }`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {isStaff ? "USDrop Support" : msg.sender?.full_name || "You"}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                );
              })}
            </div>
          )}

          {canReply && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
                data-testid="input-reply"
              />
              <Button
                size="icon"
                className="shrink-0 bg-blue-500 hover:bg-blue-600 self-end"
                disabled={!replyContent.trim() || replyMutation.isPending}
                onClick={() => replyMutation.mutate()}
                data-testid="button-send-reply"
              >
                {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-blue-500" />
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-support-title">Support</h1>
            <p className="text-sm text-muted-foreground">Submit and track your support requests</p>
          </div>
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => setShowNewTicket(true)}
          data-testid="button-new-ticket"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {ticketsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium" data-testid="text-empty-state">No tickets yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Have a question or issue? Create a new support ticket.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            const StatusIcon = statusConf.icon;
            return (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTicketId(ticket.id)}
                data-testid={`card-ticket-${ticket.id}`}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {TYPE_LABELS[ticket.type] || ticket.type} · {formatDate(ticket.created_at)}
                    </p>
                  </div>
                  <Badge variant={statusConf.variant} className="shrink-0 ml-3">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConf.label}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <Input
                placeholder="Brief summary of your issue"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                data-testid="input-ticket-title"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger data-testid="select-ticket-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder="Describe your issue in detail..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="min-h-[120px]"
                data-testid="input-ticket-description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewTicket(false)} data-testid="button-cancel-ticket">
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={!newTitle.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate()}
                data-testid="button-submit-ticket"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
