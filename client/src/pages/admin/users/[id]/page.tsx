import { apiFetch } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import { useRouter } from "@/hooks/use-router";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  SectionCard,
  InfoRow,
  StatusBadge,
} from "@/components/admin-shared";
import {
  ArrowLeft,
  Copy,
  MessageSquare,
  CreditCard,
  Edit,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  GraduationCap,
  BookOpen,
  Store,
  FileText,
  Activity,
  StickyNote,
  ShoppingBag,
  Package,
  Layers,
  Timer,
  Map,
  Zap,
  Globe,
  LifeBuoy,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Video,
  Bookmark,
  Circle,
  Loader2,
} from "lucide-react";
import { journeyStages } from "@/data/journey-stages";

interface UserProfile {
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
  onboarding_progress: number;
  subscription_plan_id: string | null;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
  plan: { id: string; name: string; slug: string; price_monthly: number } | null;
  batches: Array<{
    id: string;
    batch_id: string;
    current_week: number;
    status: string;
    joined_at: string;
    batch: { id: string; name: string; start_date: string; end_date: string; status: string } | null;
  }>;
  llc_applications: Array<{
    id: string;
    llc_name: string;
    state: string;
    package_type: string;
    status: string;
    amount_paid: number;
    created_at: string;
  }>;
  lead_score: {
    score: number;
    engagement_level: string;
    auto_stage: string;
    manual_stage_override: string | null;
    effective_stage: string;
    last_activity_at: string;
  } | null;
  shopify_stores: Array<{
    id: string;
    store_name: string;
    store_url: string;
    status: string;
    created_at: string;
  }>;
  user_details: Record<string, any> | null;
  courses: {
    total: number;
    completed: number;
    enrollments: Array<{
      id: string;
      course_id: string;
      course_title: string;
      enrolled_at: string;
      completed_at: string | null;
      progress_percentage: number;
    }>;
  };
  notes_count: number;
}

interface AdminNote {
  id: string;
  user_id: string;
  admin_id: string;
  admin_name: string;
  admin_email: string | null;
  admin_avatar_url: string | null;
  note: string;
  created_at: string;
  updated_at: string;
}

interface PaymentLink {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  payment_url: string;
  expires_at: string | null;
  paid_at: string | null;
  created_by: string;
  creator_name: string | null;
  created_at: string;
}

interface SupportTicket {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  assigned_to: string;
  assigned_name: string | null;
  created_at: string;
  updated_at: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
}

interface AccessRule {
  id: string;
  plan_slug: string;
  resource_type: string;
  resource_key: string;
  access_level: string;
  teaser_limit: number | null;
}

interface PlanOption {
  id: string;
  name: string;
  slug: string;
}

interface PicklistItem {
  id: string;
  product_id: string;
  source: string;
  added_at: string;
  products: {
    id: string;
    title: string;
    image_url: string | null;
    category: string | null;
    buy_price: number | null;
    sell_price: number | null;
    in_stock: boolean;
  } | null;
}

interface UserApp {
  id: string;
  app_name: string;
  app_url: string | null;
  app_icon: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

interface RndEntry {
  id: string;
  date: string;
  category: string;
  hours: number;
  description: string | null;
  created_at: string;
}

interface SessionItem {
  id: string;
  title: string;
  category: string;
  duration: string | null;
  session_date: string | null;
  is_published: boolean;
  is_unlocked: boolean;
}

interface FreeLearningData {
  completedLessons: string[];
  totalCompleted: number;
  totalLessons: number;
  isComplete: boolean;
  lastCompletedAt: string | null;
}

interface RoadmapData {
  items: Array<{ id: string; task_id: string; status: string; updated_at: string }>;
  stats: { total: number; notStarted: number; inProgress: number; completed: number; percentage: number };
}

interface RndData {
  items: RndEntry[];
  totalHours: number;
  categoryBreakdown: Record<string, number>;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

const LLC_STAGES = ["pending", "filed", "ein_received", "boi_filed", "bank_opened", "stripe_connected", "complete"];
const LLC_STAGE_LABELS: Record<string, string> = {
  pending: "Pending", filed: "Filed", ein_received: "EIN Received", boi_filed: "BOI Filed",
  bank_opened: "Bank Opened", stripe_connected: "Stripe Connected", complete: "Complete",
};
const LLC_DATE_FIELDS: Record<string, string> = {
  filed: "filed_at", ein_received: "ein_at", boi_filed: "boi_at",
  bank_opened: "bank_at", stripe_connected: "stripe_at", complete: "completed_at",
};

function StatCard({ label, value, icon: Icon, color = "text-muted-foreground" }: {
  label: string; value: string | number; icon: any; color?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-center gap-4" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className={`rounded-lg bg-muted p-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);

  const [picklist, setPicklist] = useState<PicklistItem[]>([]);
  const [userApps, setUserApps] = useState<UserApp[]>([]);
  const [rndData, setRndData] = useState<RndData>({ items: [], totalHours: 0, categoryBreakdown: {} });
  const [roadmapData, setRoadmapData] = useState<RoadmapData>({ items: [], stats: { total: 0, notStarted: 0, inProgress: 0, completed: 0, percentage: 0 } });
  const [sessionsData, setSessionsData] = useState<{ sessions: SessionItem[]; totalSessions: number; unlockedCount: number }>({ sessions: [], totalSessions: 0, unlockedCount: 0 });
  const [freeLearning, setFreeLearning] = useState<FreeLearningData>({ completedLessons: [], totalCompleted: 0, totalLessons: 25, isComplete: false, lastCompletedAt: null });

  const [newNote, setNewNote] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone_number: "", account_type: "" });
  const [businessForm, setBusinessForm] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/admin/users/${id}`);
      if (!response.ok) throw new Error("User not found");
      const data = await response.json();
      setUser(data);
      setEditForm({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
        account_type: data.account_type || "free",
      });
      setSelectedPlan(data.subscription_plan_id || "none");
      if (data.user_details) setBusinessForm(data.user_details);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/plans");
      if (!response.ok) return;
      const data = await response.json();
      setPlans((data.plans || []).map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })));
    } catch { /* optional */ }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchPlans();
  }, [fetchUser, fetchPlans]);

  const fetchTabData = useCallback(async (tab: string) => {
    try {
      if (tab === "summary") {
        const [picklistRes, freeLearningRes, ticketsRes, activitiesRes] = await Promise.all([
          apiFetch(`/api/admin/users/${id}/picklist`),
          apiFetch(`/api/admin/users/${id}/free-learning`),
          apiFetch(`/api/admin/users/${id}/tickets`),
          apiFetch(`/api/admin/external-users/${id}/activity`),
        ]);
        if (picklistRes.ok) { const d = await picklistRes.json(); setPicklist(d.items || []); }
        if (freeLearningRes.ok) { const d = await freeLearningRes.json(); setFreeLearning(d); }
        if (ticketsRes.ok) { const d = await ticketsRes.json(); setTickets(d.tickets || []); }
        if (activitiesRes.ok) { const d = await activitiesRes.json(); setActivities(d.activities || []); }
      } else if (tab === "products") {
        const res = await apiFetch(`/api/admin/users/${id}/picklist`);
        if (res.ok) { const d = await res.json(); setPicklist(d.items || []); }
      } else if (tab === "learning") {
        const [flRes, sessionsRes] = await Promise.all([
          apiFetch(`/api/admin/users/${id}/free-learning`),
          apiFetch(`/api/admin/users/${id}/unlocked-sessions`),
        ]);
        if (flRes.ok) { const d = await flRes.json(); setFreeLearning(d); }
        if (sessionsRes.ok) { const d = await sessionsRes.json(); setSessionsData(d); }
      } else if (tab === "sessions") {
        const res = await apiFetch(`/api/admin/users/${id}/unlocked-sessions`);
        if (res.ok) { const d = await res.json(); setSessionsData(d); }
      } else if (tab === "workspace") {
        const [appsRes, rndRes, roadmapRes] = await Promise.all([
          apiFetch(`/api/admin/users/${id}/apps`),
          apiFetch(`/api/admin/users/${id}/rnd`),
          apiFetch(`/api/admin/users/${id}/roadmap`),
        ]);
        if (appsRes.ok) { const d = await appsRes.json(); setUserApps(d.items || []); }
        if (rndRes.ok) { const d = await rndRes.json(); setRndData(d); }
        if (roadmapRes.ok) { const d = await roadmapRes.json(); setRoadmapData(d); }
      } else if (tab === "activity") {
        const res = await apiFetch(`/api/admin/external-users/${id}/activity`);
        if (res.ok) { const d = await res.json(); setActivities(d.activities || []); }
      } else if (tab === "support") {
        const res = await apiFetch(`/api/admin/users/${id}/tickets`);
        if (res.ok) { const d = await res.json(); setTickets(d.tickets || []); }
      } else if (tab === "notes") {
        const [notesRes, paymentsRes, ticketsRes] = await Promise.all([
          apiFetch(`/api/admin/users/${id}/notes`),
          apiFetch(`/api/admin/users/${id}/payment-links`),
          apiFetch(`/api/admin/users/${id}/tickets`),
        ]);
        if (notesRes.ok) { const d = await notesRes.json(); setNotes(d.notes || []); }
        if (paymentsRes.ok) { const d = await paymentsRes.json(); setPaymentLinks(d.payment_links || []); }
        if (ticketsRes.ok) { const d = await ticketsRes.json(); setTickets(d.tickets || []); }
      } else if (tab === "access") {
        const planSlug = user?.plan?.slug || user?.account_type || "free";
        const res = await apiFetch(`/api/admin/access-rules?plan_slug=${planSlug}`);
        if (res.ok) { const d = await res.json(); setAccessRules(d || []); }
      }
    } catch { showError("Failed to load tab data"); }
  }, [id, user, showError]);

  useEffect(() => {
    if (user) fetchTabData(activeTab);
  }, [activeTab, user, fetchTabData]);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}`, { method: "PATCH", body: JSON.stringify(editForm) });
      if (!res.ok) throw new Error("Failed to update profile");
      showSuccess("Profile updated successfully");
      setIsEditingProfile(false);
      fetchUser();
    } catch (err) { showError(err instanceof Error ? err.message : "Failed to update profile"); }
    finally { setIsSubmitting(false); }
  }, [user, editForm, fetchUser, showSuccess, showError]);

  const handleChangePlan = useCallback(async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ subscription_plan_id: selectedPlan === "none" ? null : selectedPlan }),
      });
      if (!res.ok) throw new Error("Failed to change plan");
      showSuccess("Plan updated successfully");
      fetchUser();
    } catch (err) { showError(err instanceof Error ? err.message : "Failed to change plan"); }
    finally { setIsSubmitting(false); }
  }, [user, selectedPlan, fetchUser, showSuccess, showError]);

  const handleAddNote = useCallback(async () => {
    if (!user || !newNote.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}/notes`, { method: "POST", body: JSON.stringify({ note: newNote.trim() }) });
      if (!res.ok) throw new Error("Failed to add note");
      showSuccess("Note added");
      setNewNote("");
      fetchTabData("notes");
    } catch (err) { showError(err instanceof Error ? err.message : "Failed to add note"); }
    finally { setIsSubmitting(false); }
  }, [user, newNote, fetchTabData, showSuccess, showError]);

  const handleSaveBusinessInfo = useCallback(async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}/details`, { method: "PUT", body: JSON.stringify(businessForm) });
      if (!res.ok) throw new Error("Failed to save business info");
      showSuccess("Business info saved");
      fetchUser();
    } catch (err) { showError(err instanceof Error ? err.message : "Failed to save business info"); }
    finally { setIsSubmitting(false); }
  }, [user, businessForm, fetchUser, showSuccess, showError]);

  const handleCopyWhatsApp = useCallback(() => {
    if (!user?.phone_number) { showError("No phone number available"); return; }
    const phone = user.phone_number.replace(/\D/g, "");
    navigator.clipboard.writeText(`https://wa.me/${phone}`);
    showSuccess("WhatsApp link copied");
  }, [user, showSuccess, showError]);

  const handleExportActivityCSV = useCallback(() => {
    const headers = ["Date", "Type", "Description"];
    const rows = activities.map((a) => [formatDateTime(a.timestamp), a.type, a.description]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-activity-${id}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Activity log exported");
  }, [activities, id, showSuccess]);

  const handleAdvanceLLC = useCallback(async (llcId: string, currentStatus: string) => {
    const currentIdx = LLC_STAGES.indexOf(currentStatus);
    if (currentIdx < 0 || currentIdx >= LLC_STAGES.length - 1) return;
    const nextStage = LLC_STAGES[currentIdx + 1];
    try {
      setIsSubmitting(true);
      const updateData: Record<string, any> = { status: nextStage };
      const dateField = LLC_DATE_FIELDS[nextStage];
      if (dateField) updateData[dateField] = new Date().toISOString();
      const res = await apiFetch(`/api/admin/llc/${llcId}`, { method: "PATCH", body: JSON.stringify(updateData) });
      if (!res.ok) throw new Error("Failed to advance LLC stage");
      showSuccess(`LLC advanced to ${LLC_STAGE_LABELS[nextStage]}`);
      fetchUser();
    } catch (err) { showError(err instanceof Error ? err.message : "Failed to advance stage"); }
    finally { setIsSubmitting(false); }
  }, [fetchUser, showSuccess, showError]);

  const handleToggleSession = useCallback(async (sessionId: string, currentlyUnlocked: boolean) => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      let res;
      if (currentlyUnlocked) {
        res = await apiFetch(`/api/admin/users/${user.id}/content-access/bulk`, {
          method: "POST",
          body: JSON.stringify({ items: [{ content_type: "session", content_id: sessionId }], action: "lock" }),
        });
      } else {
        res = await apiFetch(`/api/admin/users/${user.id}/content-access`, {
          method: "POST",
          body: JSON.stringify({ content_type: "session", content_id: sessionId }),
        });
      }
      if (!res.ok) throw new Error("Failed to toggle session access");
      showSuccess(currentlyUnlocked ? "Session locked" : "Session unlocked");
      fetchTabData("sessions");
    } catch {
      showError("Failed to toggle session");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, fetchTabData, showSuccess, showError]);

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="h-32 bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-64 bg-muted/50 rounded-xl animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <PageHeader title="User Not Found" subtitle="This user does not exist" />
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/users")} data-testid="button-back-users">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Users
        </Button>
      </PageShell>
    );
  }

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress");
  const engagementColor = user.lead_score?.engagement_level === "hot" ? "text-red-500" : user.lead_score?.engagement_level === "warm" ? "text-amber-500" : "text-blue-400";

  return (
    <PageShell>
      {/* Back button */}
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/users")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Back to Users</span>
      </div>

      {/* User Header */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-border">
              <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
              <AvatarFallback className="text-2xl font-semibold">{getInitials(user.full_name || user.email)}</AvatarFallback>
            </Avatar>
            {user.lead_score?.engagement_level === "hot" && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold truncate" data-testid="text-user-name">{user.full_name || "Unnamed User"}</h1>
              <Badge variant={user.account_type === "pro" ? "default" : "secondary"} data-testid="badge-account-type">
                {user.plan?.name || (user.account_type === "pro" ? "Pro" : "Free")}
              </Badge>
              <Badge variant={user.status === "active" ? "outline" : "destructive"} data-testid="badge-status">
                {user.status || "active"}
              </Badge>
              {user.lead_score && (
                <Badge variant="outline" className={engagementColor} data-testid="badge-engagement">
                  {user.lead_score.engagement_level}
                </Badge>
              )}
              {user.is_trial && <Badge variant="secondary">Trial</Badge>}
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user.email}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              {user.phone_number && <span>Phone: {user.phone_number}</span>}
              <span>Joined {formatDate(user.created_at)}</span>
              {user.lead_score?.last_activity_at && <span>Last active {formatDate(user.lead_score.last_activity_at)}</span>}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t">
          <Button size="sm" variant="outline" onClick={handleCopyWhatsApp} data-testid="button-copy-whatsapp">
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            WhatsApp
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push(`/admin/tickets?create=true&userId=${user.id}`)} data-testid="button-create-ticket">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Ticket
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push(`/admin/pipeline?paymentLink=true&userId=${user.id}`)} data-testid="button-send-payment">
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            Payment
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)} data-testid="button-edit-profile">
            <Edit className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Select value={selectedPlan} onValueChange={(val) => setSelectedPlan(val)}>
              <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm" data-testid="select-change-plan">
                <SelectValue placeholder="Change Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Plan</SelectItem>
                {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selectedPlan !== (user.subscription_plan_id || "none") && (
              <Button size="sm" onClick={handleChangePlan} disabled={isSubmitting} className="h-9 bg-blue-500 hover:bg-blue-600" data-testid="button-apply-plan">
                Apply
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto w-full gap-0.5 mb-6" data-testid="tabs-user-detail">
          <TabsTrigger value="summary" data-testid="tab-summary">Summary</TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
          <TabsTrigger value="learning" data-testid="tab-learning">Learning</TabsTrigger>
          <TabsTrigger value="sessions" data-testid="tab-sessions">Sessions</TabsTrigger>
          <TabsTrigger value="workspace" data-testid="tab-workspace">Workspace</TabsTrigger>
          <TabsTrigger value="llc" data-testid="tab-llc">LLC</TabsTrigger>
          <TabsTrigger value="pipeline" data-testid="tab-pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
          <TabsTrigger value="support" data-testid="tab-support">Support</TabsTrigger>
          <TabsTrigger value="access" data-testid="tab-access">Access</TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 mt-0">
          <SummaryTab user={user} picklist={picklist} freeLearning={freeLearning} tickets={tickets} activities={activities} openTickets={openTickets} />
        </TabsContent>
        <TabsContent value="products" className="space-y-6 mt-0">
          <ProductsTab items={picklist} userId={user.id} onRefresh={() => fetchTabData("products")} />
        </TabsContent>
        <TabsContent value="learning" className="space-y-6 mt-0">
          <LearningTab user={user} freeLearning={freeLearning} sessionsData={sessionsData} />
        </TabsContent>
        <TabsContent value="sessions" className="space-y-6 mt-0">
          <SessionsTab sessionsData={sessionsData} onToggle={handleToggleSession} isSubmitting={isSubmitting} />
        </TabsContent>
        <TabsContent value="workspace" className="space-y-6 mt-0">
          <WorkspaceTab shopifyStores={user.shopify_stores} apps={userApps} rndData={rndData} roadmapData={roadmapData} userId={user.id} onRefresh={() => fetchTabData("workspace")} />
        </TabsContent>
        <TabsContent value="llc" className="space-y-6 mt-0">
          <LLCTab applications={user.llc_applications} onAdvance={handleAdvanceLLC} isSubmitting={isSubmitting} />
        </TabsContent>
        <TabsContent value="pipeline" className="space-y-6 mt-0">
          <PipelineTab user={user} isEditing={isEditingProfile} editForm={editForm} setEditForm={setEditForm} onSave={handleSaveProfile} onCancel={() => setIsEditingProfile(false)} isSubmitting={isSubmitting} />
        </TabsContent>
        <TabsContent value="activity" className="space-y-6 mt-0">
          <ActivityTab activities={activities} onExport={handleExportActivityCSV} />
        </TabsContent>
        <TabsContent value="support" className="space-y-6 mt-0">
          <SupportTab tickets={tickets} router={router} />
        </TabsContent>
        <TabsContent value="access" className="space-y-6 mt-0">
          <AccessTab rules={accessRules} userId={user.id} planSlug={user.plan?.slug || user.account_type || "free"} onRefresh={() => fetchTabData("access")} />
        </TabsContent>
        <TabsContent value="notes" className="space-y-6 mt-0">
          <NotesTab notes={notes} paymentLinks={paymentLinks} tickets={tickets} newNote={newNote} setNewNote={setNewNote} onAddNote={handleAddNote} isSubmitting={isSubmitting} router={router} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

// ================================================================
// SUMMARY TAB
// ================================================================
function SummaryTab({ user, picklist, freeLearning, tickets, activities, openTickets }: {
  user: UserProfile; picklist: PicklistItem[]; freeLearning: FreeLearningData;
  tickets: SupportTicket[]; activities: ActivityItem[]; openTickets: SupportTicket[];
}) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Products Saved" value={picklist.length} icon={Bookmark} color="text-blue-500" />
        <StatCard label="Courses Enrolled" value={user.courses.total} icon={GraduationCap} color="text-purple-500" />
        <StatCard label="Free Learning" value={`${freeLearning.totalCompleted}/${freeLearning.totalLessons}`} icon={BookOpen} color="text-emerald-500" />
        <StatCard label="Lead Score" value={user.lead_score?.score ?? 0} icon={Zap} color="text-amber-500" />
        <StatCard label="Open Tickets" value={openTickets.length} icon={LifeBuoy} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile & Business Snapshot */}
        <SectionCard title="Profile Overview">
          <div className="space-y-1">
            <InfoRow label="Account Type"><StatusBadge status={user.account_type === "pro" ? "Pro" : "Free"} /></InfoRow>
            <InfoRow label="Plan" value={user.plan?.name || "No Plan"} />
            <InfoRow label="Role" value={user.internal_role ? user.internal_role.replace(/_/g, " ") : "External User"} />
            <InfoRow label="Onboarding">
              <div className="flex items-center gap-2">
                <StatusBadge status={user.onboarding_completed ? "Completed" : "Pending"} />
                <span className="text-sm text-muted-foreground">{user.onboarding_progress}%</span>
              </div>
            </InfoRow>
            <InfoRow label="Shopify Stores" value={user.shopify_stores.length} />
            <InfoRow label="LLC Applications" value={user.llc_applications.length} />
            {user.batches.length > 0 && (
              <InfoRow label="Batch">
                <span className="text-sm">{user.batches[0]?.batch?.name || "—"} · Week {user.batches[0]?.current_week}</span>
              </InfoRow>
            )}
          </div>
        </SectionCard>

        {/* Free Learning Progress */}
        <SectionCard title="Free Learning Progress">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {freeLearning.totalCompleted} of {freeLearning.totalLessons} lessons completed
              </span>
              {freeLearning.isComplete && <Badge variant="default" className="bg-emerald-500">Complete</Badge>}
            </div>
            <Progress value={(freeLearning.totalCompleted / freeLearning.totalLessons) * 100} className="h-2.5" data-testid="progress-free-learning" />
            {freeLearning.lastCompletedAt && (
              <p className="text-sm text-muted-foreground">Last completed: {formatDate(freeLearning.lastCompletedAt)}</p>
            )}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Course Enrollments</span>
              <span className="text-sm font-medium">{user.courses.completed}/{user.courses.total} completed</span>
            </div>
          </div>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {activities.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-start gap-2.5 py-1.5" data-testid={`recent-activity-${a.id}`}>
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{a.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(a.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Active Tickets */}
        <SectionCard title={`Support Tickets (${openTickets.length} open)`}>
          {tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No support tickets</p>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {tickets.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-2.5" data-testid={`summary-ticket-${t.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(t.created_at)}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}

// ================================================================
// PRODUCTS TAB
// ================================================================
function ProductsTab({ items, userId, onRefresh }: { items: PicklistItem[]; userId: string; onRefresh: () => void }) {
  const { showSuccess, showError } = useToast();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemove = async (picklistId: string) => {
    try {
      setIsRemoving(picklistId);
      const res = await apiFetch(`/api/picklist/${picklistId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      showSuccess("Product removed from picklist");
      onRefresh();
    } catch { showError("Failed to remove product"); }
    finally { setIsRemoving(null); }
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Bookmark className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium" data-testid="text-no-products">No Saved Products</p>
        <p className="text-sm text-muted-foreground mt-1">This user hasn't saved any products yet.</p>
      </Card>
    );
  }

  return (
    <SectionCard title={`Saved Products (${items.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="px-3 py-3 text-right text-sm font-medium text-muted-foreground">Buy</th>
              <th className="px-3 py-3 text-right text-sm font-medium text-muted-foreground">Sell</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-muted-foreground">Stock</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Source</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Added</th>
              <th className="px-3 py-3 text-right text-sm font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => {
              const p = item.products;
              return (
                <tr key={item.id} data-testid={`row-product-${item.id}`}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {p?.image_url ? (
                        <img src={p.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center"><Package className="h-3.5 w-3.5 text-muted-foreground" /></div>
                      )}
                      <span className="font-medium truncate max-w-[200px]">{p?.title || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p?.category || "—"}</td>
                  <td className="px-3 py-2.5 text-right">{p?.buy_price ? `$${p.buy_price}` : "—"}</td>
                  <td className="px-3 py-2.5 text-right">{p?.sell_price ? `$${p.sell_price}` : "—"}</td>
                  <td className="px-3 py-2.5 text-center">
                    <StatusBadge status={p?.in_stock ? "In Stock" : "Out"} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge variant="secondary" className="text-xs">{item.source || "—"}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted-foreground">{formatDate(item.added_at)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 h-8 px-3 text-sm"
                      onClick={() => handleRemove(item.id)}
                      disabled={isRemoving === item.id}
                      data-testid={`button-remove-product-${item.id}`}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ================================================================
// LEARNING TAB
// ================================================================
function LearningTab({ user, freeLearning, sessionsData }: {
  user: UserProfile; freeLearning: FreeLearningData;
  sessionsData: { sessions: SessionItem[]; totalSessions: number; unlockedCount: number };
}) {
  const flPercent = (freeLearning.totalCompleted / freeLearning.totalLessons) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Free Lessons" value={`${freeLearning.totalCompleted}/${freeLearning.totalLessons}`} icon={BookOpen} color="text-emerald-500" />
        <StatCard label="Courses Enrolled" value={user.courses.total} icon={GraduationCap} color="text-purple-500" />
        <StatCard label="Courses Completed" value={user.courses.completed} icon={CheckCircle2} color="text-blue-500" />
        <StatCard label="Sessions Unlocked" value={sessionsData.unlockedCount} icon={Video} color="text-amber-500" />
      </div>

      <SectionCard title="Free Learning Progress">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">{freeLearning.totalCompleted} of {freeLearning.totalLessons} lessons</span>
            <span className="text-sm font-semibold">{Math.round(flPercent)}%</span>
          </div>
          <Progress value={flPercent} className="h-2.5" data-testid="progress-free-learning-detail" />
          {freeLearning.isComplete ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Completed {freeLearning.lastCompletedAt ? `on ${formatDate(freeLearning.lastCompletedAt)}` : ""}
            </div>
          ) : freeLearning.lastCompletedAt ? (
            <p className="text-sm text-muted-foreground">Last lesson: {formatDate(freeLearning.lastCompletedAt)}</p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Onboarding Progress">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-medium">{user.onboarding_progress}%</span>
          </div>
          <Progress value={user.onboarding_progress} className="h-2" data-testid="progress-onboarding" />
          <InfoRow label="Status"><StatusBadge status={user.onboarding_completed ? "Completed" : "In Progress"} /></InfoRow>
        </div>
      </SectionCard>

      <SectionCard title="Enrolled Courses">
        {user.courses.enrollments.length === 0 ? (
          <div className="py-6 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-courses">No course enrollments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.courses.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="rounded-lg border p-4" data-testid={`course-enrollment-${enrollment.id}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{enrollment.course_title}</span>
                  </div>
                  <StatusBadge status={enrollment.completed_at ? "Completed" : "In Progress"} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{Math.round(enrollment.progress_percentage)}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage} className="h-1.5" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Enrolled {formatDate(enrollment.enrolled_at)}</span>
                    {enrollment.completed_at && <span>Completed {formatDate(enrollment.completed_at)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ================================================================
// SESSIONS TAB
// ================================================================
function SessionsTab({ sessionsData, onToggle, isSubmitting }: {
  sessionsData: { sessions: SessionItem[]; totalSessions: number; unlockedCount: number };
  onToggle: (id: string, unlocked: boolean) => void;
  isSubmitting: boolean;
}) {
  const categories = Array.from(new Set(sessionsData.sessions.map((s) => s.category))).sort();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Sessions" value={sessionsData.totalSessions} icon={Video} color="text-blue-500" />
        <StatCard label="Unlocked" value={sessionsData.unlockedCount} icon={Unlock} color="text-emerald-500" />
        <StatCard label="Locked" value={sessionsData.totalSessions - sessionsData.unlockedCount} icon={Lock} color="text-muted-foreground" />
      </div>

      {categories.map((cat) => {
        const catSessions = sessionsData.sessions.filter((s) => s.category === cat);
        const catUnlocked = catSessions.filter((s) => s.is_unlocked).length;
        return (
          <SectionCard key={cat} title={`${cat} (${catUnlocked}/${catSessions.length} unlocked)`}>
            <div className="space-y-2">
              {catSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`session-${session.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{session.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      {session.duration && <span>{session.duration}</span>}
                      {session.session_date && <span>· {formatDate(session.session_date)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-sm text-muted-foreground">{session.is_unlocked ? "Unlocked" : "Locked"}</span>
                    <Switch
                      checked={session.is_unlocked}
                      onCheckedChange={() => onToggle(session.id, session.is_unlocked)}
                      disabled={isSubmitting}
                      data-testid={`switch-session-${session.id}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        );
      })}

      {sessionsData.sessions.length === 0 && (
        <Card className="p-8 text-center">
          <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No Sessions Available</p>
        </Card>
      )}
    </div>
  );
}

// ================================================================
// WORKSPACE TAB
// ================================================================
function WorkspaceTab({ shopifyStores, apps, rndData, roadmapData, userId, onRefresh }: {
  shopifyStores: UserProfile["shopify_stores"]; apps: UserApp[];
  rndData: RndData; roadmapData: RoadmapData;
  userId: string; onRefresh: () => void;
}) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const { toast } = useToast();

  const statusMap = new Map<string, string>();
  for (const item of roadmapData.items) {
    statusMap.set(item.task_id, item.status);
  }

  const allTaskIds = journeyStages.flatMap((s) => s.tasks.map((t) => t.id));
  const totalTasks = allTaskIds.length;
  const completedTasks = allTaskIds.filter((id) => statusMap.get(id) === "completed").length;
  const inProgressTasks = allTaskIds.filter((id) => statusMap.get(id) === "in_progress").length;
  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const expandAll = () => setExpandedStages(new Set(journeyStages.map((s) => s.id)));
  const collapseAll = () => setExpandedStages(new Set());

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setUpdatingTask(taskId);
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/roadmap`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast({ title: "Task updated", description: `Status changed to ${newStatus.replace(/_/g, " ")}` });
      onRefresh();
    } catch {
      toast({ title: "Error", description: "Failed to update task status", variant: "destructive" });
    } finally {
      setUpdatingTask(null);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === "in_progress") return <Loader2 className="h-4 w-4 text-blue-500" />;
    return <Circle className="h-4 w-4 text-muted-foreground/40" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Shopify Stores" value={shopifyStores.length} icon={Store} color="text-green-500" />
        <StatCard label="Connected Apps" value={apps.length} icon={Globe} color="text-blue-500" />
        <StatCard label="R&D Hours" value={rndData.totalHours} icon={Timer} color="text-purple-500" />
        <StatCard label="Roadmap" value={`${overallPercent}%`} icon={Map} color="text-amber-500" />
      </div>

      {/* Shopify Stores */}
      <SectionCard title="Shopify Stores">
        {shopifyStores.length === 0 ? (
          <div className="py-4 text-center">
            <Store className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-sm text-muted-foreground">No stores connected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shopifyStores.map((store) => (
              <div key={store.id} className="flex items-center justify-between rounded-lg border p-3" data-testid={`store-${store.id}`}>
                <div>
                  <p className="text-sm font-medium">{store.store_name}</p>
                  <p className="text-sm text-muted-foreground">{store.store_url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={store.status || "Connected"} />
                  {store.store_url && (
                    <Button size="icon" variant="ghost" onClick={() => window.open(store.store_url.startsWith("http") ? store.store_url : `https://${store.store_url}`, "_blank")} data-testid={`button-open-store-${store.id}`}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Connected Apps */}
      <SectionCard title={`Connected Apps (${apps.length})`}>
        {apps.length === 0 ? (
          <div className="py-4 text-center">
            <Globe className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-sm text-muted-foreground">No apps connected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {apps.map((app) => (
              <div key={app.id} className="flex items-center gap-3 rounded-lg border p-3" data-testid={`app-${app.id}`}>
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {app.app_icon || app.app_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{app.app_name}</p>
                  <p className="text-sm text-muted-foreground">{app.category || "Uncategorized"}</p>
                </div>
                <StatusBadge status={app.status || "active"} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Roadmap Checklist */}
      <SectionCard title="Roadmap Checklist">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</span>
                <span className="text-sm font-semibold">{overallPercent}%</span>
              </div>
              <Progress value={overallPercent} className="h-2.5" data-testid="progress-roadmap" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="text-lg font-bold">{totalTasks - completedTasks - inProgressTasks}</p>
              <p className="text-sm text-muted-foreground">Not Started</p>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-2.5 text-center">
              <p className="text-lg font-bold text-blue-600">{inProgressTasks}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-2.5 text-center">
              <p className="text-lg font-bold text-emerald-600">{completedTasks}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={expandAll} data-testid="button-expand-all-stages">
              <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Expand All
            </Button>
            <Button size="sm" variant="outline" onClick={collapseAll} data-testid="button-collapse-all-stages">
              <ChevronUp className="mr-1.5 h-3.5 w-3.5" /> Collapse All
            </Button>
          </div>

          <div className="space-y-2">
            {journeyStages.map((stage) => {
              const stageCompleted = stage.tasks.filter((t) => statusMap.get(t.id) === "completed").length;
              const stageTotal = stage.tasks.length;
              const stagePercent = stageTotal > 0 ? Math.round((stageCompleted / stageTotal) * 100) : 0;
              const isExpanded = expandedStages.has(stage.id);

              return (
                <div key={stage.id} className="rounded-lg border" data-testid={`roadmap-stage-${stage.id}`}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-3 text-left transition-colors rounded-lg"
                    onClick={() => toggleStage(stage.id)}
                    data-testid={`button-toggle-stage-${stage.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`flex items-center justify-center h-7 w-7 rounded-full text-sm font-bold shrink-0 ${
                        stagePercent === 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" :
                        stagePercent > 0 ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {stage.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{stage.title}</p>
                        <p className="text-sm text-muted-foreground">{stage.phase} · {stageCompleted}/{stageTotal} done</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-sm font-medium">{stagePercent}%</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1">
                      <div className="mb-2">
                        <Progress value={stagePercent} className="h-1.5" />
                      </div>
                      {stage.tasks.map((task) => {
                        const currentStatus = statusMap.get(task.id) || "not_started";
                        const isUpdating = updatingTask === task.id;

                        return (
                          <div key={task.id} className="flex items-center gap-3 py-2 px-2 rounded-md" data-testid={`roadmap-task-${task.id}`}>
                            <div className="shrink-0">
                              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : getStatusIcon(currentStatus)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm ${currentStatus === "completed" ? "line-through text-muted-foreground" : ""}`}>
                                <span className="text-muted-foreground mr-1.5">#{task.taskNo}</span>
                                {task.title}
                              </p>
                            </div>
                            <Select
                              value={currentStatus}
                              onValueChange={(val) => handleStatusChange(task.id, val)}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className={`w-[130px] text-sm shrink-0 ${
                                currentStatus === "completed" ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400" :
                                currentStatus === "in_progress" ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400" :
                                ""
                              }`} data-testid={`select-status-${task.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_started">Not Started</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* R&D Log */}
      <SectionCard title={`R&D Log (${rndData.totalHours}h total)`}>
        {rndData.items.length === 0 ? (
          <div className="py-4 text-center">
            <Timer className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-sm text-muted-foreground">No R&D entries logged</p>
          </div>
        ) : (
          <>
            {Object.keys(rndData.categoryBreakdown).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(rndData.categoryBreakdown).map(([cat, hours]) => (
                  <Badge key={cat} variant="secondary" className="text-xs">{cat}: {hours}h</Badge>
                ))}
              </div>
            )}
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {rndData.items.slice(0, 20).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-1.5 border-b last:border-0" data-testid={`rnd-${entry.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{entry.description || entry.category}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
                    <span className="text-sm font-medium">{entry.hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}

// ================================================================
// LLC TAB
// ================================================================
function LLCTab({ applications, onAdvance, isSubmitting }: {
  applications: UserProfile["llc_applications"];
  onAdvance: (llcId: string, currentStatus: string) => void;
  isSubmitting: boolean;
}) {
  if (applications.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium" data-testid="text-no-llc">No LLC Applications</p>
        <p className="text-sm text-muted-foreground mt-1">This user has no LLC applications yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((llc) => {
        const currentIdx = LLC_STAGES.indexOf(llc.status);
        const canAdvance = currentIdx >= 0 && currentIdx < LLC_STAGES.length - 1;
        return (
          <SectionCard key={llc.id} title={llc.llc_name}
            actions={canAdvance ? (
              <Button size="sm" onClick={() => onAdvance(llc.id, llc.status)} disabled={isSubmitting} data-testid={`button-advance-llc-${llc.id}`}>
                Next Stage <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            ) : undefined}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {LLC_STAGES.map((stage, idx) => {
                const isComplete = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage} className="flex items-center gap-1">
                    <div className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      isCurrent ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : isComplete ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`} data-testid={`llc-stage-${stage}-${llc.id}`}>
                      {LLC_STAGE_LABELS[stage]}
                    </div>
                    {idx < LLC_STAGES.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                  </div>
                );
              })}
            </div>
            <div className="space-y-1">
              <InfoRow label="State" value={llc.state} />
              <InfoRow label="Package" value={llc.package_type} />
              <InfoRow label="Amount Paid" value={`$${llc.amount_paid || 0}`} />
              <InfoRow label="Created" value={formatDate(llc.created_at)} />
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}

// ================================================================
// PIPELINE TAB (Profile + Lead Score)
// ================================================================
function PipelineTab({ user, isEditing, editForm, setEditForm, onSave, onCancel, isSubmitting }: {
  user: UserProfile; isEditing: boolean;
  editForm: { full_name: string; phone_number: string; account_type: string };
  setEditForm: (fn: (prev: typeof editForm) => typeof editForm) => void;
  onSave: () => void; onCancel: () => void; isSubmitting: boolean;
}) {
  const lead = user.lead_score;
  const stageLabel = (lead?.manual_stage_override || lead?.auto_stage || "new_lead").replace(/_/g, " ");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Profile Card */}
      <SectionCard title="Profile" actions={isEditing ? (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onCancel} data-testid="button-cancel-edit">Cancel</Button>
          <Button size="sm" onClick={onSave} disabled={isSubmitting} data-testid="button-save-profile">
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save
          </Button>
        </div>
      ) : undefined}>
        <div className="space-y-1">
          {isEditing ? (
            <>
              <div className="py-1.5">
                <Label className="text-sm text-muted-foreground">Name</Label>
                <Input value={editForm.full_name} onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))} className="mt-1" data-testid="input-edit-name" />
              </div>
              <div className="py-1.5">
                <Label className="text-sm text-muted-foreground">Phone</Label>
                <Input value={editForm.phone_number} onChange={(e) => setEditForm((prev) => ({ ...prev, phone_number: e.target.value }))} className="mt-1" data-testid="input-edit-phone" />
              </div>
              <div className="py-1.5">
                <Label className="text-sm text-muted-foreground">Account Type</Label>
                <Select value={editForm.account_type} onValueChange={(val) => setEditForm((prev) => ({ ...prev, account_type: val }))}>
                  <SelectTrigger className="mt-1" data-testid="select-edit-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <InfoRow label="Phone" value={user.phone_number || "—"} />
              <InfoRow label="Account Type"><StatusBadge status={user.account_type === "pro" ? "Pro" : "Free"} /></InfoRow>
              <InfoRow label="Status"><StatusBadge status={user.status || "active"} /></InfoRow>
              <InfoRow label="Plan" value={user.plan?.name || "No Plan"} />
              <InfoRow label="Role" value={user.internal_role ? user.internal_role.replace(/_/g, " ") : "External User"} />
              <InfoRow label="Joined" value={formatDate(user.created_at)} />
            </>
          )}
        </div>
      </SectionCard>

      {/* Lead Score Card */}
      <div className="space-y-6">
        <SectionCard title="Lead Score">
          {lead ? (
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor"
                      className={lead.engagement_level === "hot" ? "text-red-500" : lead.engagement_level === "warm" ? "text-amber-500" : "text-blue-400"}
                      strokeWidth="8" strokeDasharray={`${Math.min(lead.score, 100) * 2.51} 251`} strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{lead.score}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <InfoRow label="Engagement"><StatusBadge status={lead.engagement_level} /></InfoRow>
                  <InfoRow label="Stage"><Badge variant="outline" className="capitalize">{stageLabel}</Badge></InfoRow>
                  <InfoRow label="Last Activity" value={formatDate(lead.last_activity_at)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <BarChart3 className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">No lead score calculated</p>
            </div>
          )}
        </SectionCard>

        {user.batches.length > 0 && (
          <SectionCard title="Batch Membership">
            <div className="space-y-2">
              {user.batches.map((bm) => (
                <div key={bm.id} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-sm font-medium">{bm.batch?.name || "Unknown Batch"}</p>
                    <p className="text-sm text-muted-foreground">Week {bm.current_week}</p>
                  </div>
                  <StatusBadge status={bm.status} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

// ================================================================
// ACTIVITY TAB
// ================================================================
function ActivityTab({ activities, onExport }: { activities: ActivityItem[]; onExport: () => void }) {
  const [filter, setFilter] = useState("all");
  const types = Array.from(new Set(activities.map((a) => a.type)));
  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <SectionCard title="Activity Log" actions={
      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-auto min-w-[120px]" data-testid="filter-activity-type"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={onExport} data-testid="button-export-activity">
          <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
        </Button>
      </div>
    }>
      {filtered.length === 0 ? (
        <div className="py-6 text-center">
          <Activity className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground" data-testid="text-no-activity">No activity recorded</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filtered.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 py-2" data-testid={`activity-${activity.id}`}>
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(activity.timestamp)}</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">{activity.type.replace(/_/g, " ")}</Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ================================================================
// SUPPORT TAB
// ================================================================
function SupportTab({ tickets, router }: { tickets: SupportTicket[]; router: ReturnType<typeof useRouter> }) {
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Tickets" value={tickets.length} icon={LifeBuoy} color="text-blue-500" />
        <StatCard label="Open" value={openTickets.length} icon={AlertCircle} color="text-amber-500" />
        <StatCard label="Resolved" value={resolvedTickets.length} icon={CheckCircle2} color="text-emerald-500" />
        <StatCard label="Escalated" value={tickets.filter((t) => t.status === "escalated").length} icon={Zap} color="text-red-500" />
      </div>

      <SectionCard title="All Tickets">
        {tickets.length === 0 ? (
          <div className="py-6 text-center">
            <LifeBuoy className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-tickets">No support tickets</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover-elevate"
                onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                data-testid={`ticket-${ticket.id}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{ticket.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                    <span>{ticket.type}</span>
                    <span>·</span>
                    <span>{formatDate(ticket.created_at)}</span>
                    {ticket.assigned_name && <><span>·</span><span>Assigned: {ticket.assigned_name}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <StatusBadge status={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ================================================================
// ACCESS TAB
// ================================================================
function AccessTab({ rules, userId, planSlug, onRefresh }: {
  rules: AccessRule[]; userId: string; planSlug: string; onRefresh: () => void;
}) {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleRule = async (rule: AccessRule) => {
    try {
      setIsSubmitting(true);
      const newLevel = rule.access_level === "full" ? "locked" : "full";
      await apiFetch("/api/admin/access-rules", {
        method: "POST",
        body: JSON.stringify({ plan_slug: rule.plan_slug, resource_type: rule.resource_type, resource_key: rule.resource_key, access_level: newLevel }),
      });
      showSuccess(`Access ${newLevel === "full" ? "granted" : "revoked"}`);
      onRefresh();
    } catch { showError("Failed to update access"); }
    finally { setIsSubmitting(false); }
  };

  const handleBulkAction = async (action: "unlock" | "lock") => {
    try {
      setIsSubmitting(true);
      await Promise.all(rules.map((rule) =>
        apiFetch("/api/admin/access-rules", {
          method: "POST",
          body: JSON.stringify({ plan_slug: rule.plan_slug, resource_type: rule.resource_type, resource_key: rule.resource_key, access_level: action === "unlock" ? "full" : "locked" }),
        })
      ));
      showSuccess(`All access ${action === "unlock" ? "granted" : "revoked"}`);
      onRefresh();
    } catch { showError("Failed to update access"); }
    finally { setIsSubmitting(false); }
  };

  return (
    <SectionCard title={`Feature Access (${planSlug} plan)`} actions={
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onRefresh} data-testid="button-refresh-access"><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh</Button>
        <Button size="sm" variant="outline" onClick={() => handleBulkAction("unlock")} disabled={isSubmitting} data-testid="button-unlock-all"><Unlock className="mr-1.5 h-3.5 w-3.5" /> Unlock All</Button>
        <Button size="sm" variant="outline" onClick={() => handleBulkAction("lock")} disabled={isSubmitting} data-testid="button-lock-all"><Lock className="mr-1.5 h-3.5 w-3.5" /> Lock All</Button>
      </div>
    }>
      {rules.length === 0 ? (
        <div className="py-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground" data-testid="text-no-rules">No access rules configured for this plan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Resource</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Access Level</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.map((rule) => (
                <tr key={rule.id} data-testid={`row-access-${rule.id}`}>
                  <td className="px-4 py-3 font-medium">{rule.resource_key}</td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{rule.resource_type}</Badge></td>
                  <td className="px-4 py-3"><StatusBadge status={rule.access_level === "full" ? "Active" : rule.access_level === "locked" ? "Inactive" : rule.access_level} /></td>
                  <td className="px-4 py-3 text-right">
                    <Switch checked={rule.access_level === "full"} onCheckedChange={() => handleToggleRule(rule)} disabled={isSubmitting} data-testid={`switch-access-${rule.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

// ================================================================
// NOTES TAB
// ================================================================
function NotesTab({ notes, paymentLinks, tickets, newNote, setNewNote, onAddNote, isSubmitting, router }: {
  notes: AdminNote[]; paymentLinks: PaymentLink[]; tickets: SupportTicket[];
  newNote: string; setNewNote: (val: string) => void; onAddNote: () => void;
  isSubmitting: boolean; router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <SectionCard title="Admin Notes">
          <div className="space-y-3">
            <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note about this user..." className="resize-none" rows={3} data-testid="input-new-note" />
            <Button size="sm" onClick={onAddNote} disabled={isSubmitting || !newNote.trim()} data-testid="button-add-note">
              <StickyNote className="mr-1.5 h-3.5 w-3.5" /> Add Note
            </Button>
          </div>
          {notes.length > 0 && (
            <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border p-3" data-testid={`note-${note.id}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={note.admin_avatar_url || undefined} />
                      <AvatarFallback className="text-xs">{getInitials(note.admin_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{note.admin_name}</span>
                    <span className="text-sm text-muted-foreground">{formatDateTime(note.created_at)}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="Payment History">
          {paymentLinks.length === 0 ? (
            <div className="py-4 text-center">
              <CreditCard className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground" data-testid="text-no-payments">No payment history</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {paymentLinks.map((pl) => (
                <div key={pl.id} className="flex items-center justify-between rounded-lg border p-3" data-testid={`payment-${pl.id}`}>
                  <div>
                    <p className="text-sm font-medium">{pl.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(pl.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${pl.amount}</span>
                    <StatusBadge status={pl.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Support History">
          {tickets.length === 0 ? (
            <div className="py-4 text-center">
              <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground" data-testid="text-no-tickets-notes">No support tickets</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover-elevate"
                  onClick={() => router.push(`/admin/tickets/${ticket.id}`)} data-testid={`notes-ticket-${ticket.id}`}>
                  <div>
                    <p className="text-sm font-medium">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(ticket.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
