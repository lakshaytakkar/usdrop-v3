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
} from "lucide-react";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const LLC_STAGES = ["pending", "filed", "ein_received", "boi_filed", "bank_opened", "stripe_connected", "complete"];
const LLC_STAGE_LABELS: Record<string, string> = {
  pending: "Pending",
  filed: "Filed",
  ein_received: "EIN Received",
  boi_filed: "BOI Filed",
  bank_opened: "Bank Opened",
  stripe_connected: "Stripe Connected",
  complete: "Complete",
};
const LLC_DATE_FIELDS: Record<string, string> = {
  filed: "filed_at",
  ein_received: "ein_at",
  boi_filed: "boi_at",
  bank_opened: "bank_at",
  stripe_connected: "stripe_at",
  complete: "completed_at",
};

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);

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
      if (data.user_details) {
        setBusinessForm(data.user_details);
      }
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
    } catch {
      // optional
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchPlans();
  }, [fetchUser, fetchPlans]);

  const fetchTabData = useCallback(
    async (tab: string) => {
      try {
        if (tab === "notes") {
          const [notesRes, paymentsRes, ticketsRes] = await Promise.all([
            apiFetch(`/api/admin/users/${id}/notes`),
            apiFetch(`/api/admin/users/${id}/payment-links`),
            apiFetch(`/api/admin/users/${id}/tickets`),
          ]);
          if (notesRes.ok) {
            const d = await notesRes.json();
            setNotes(d.notes || []);
          }
          if (paymentsRes.ok) {
            const d = await paymentsRes.json();
            setPaymentLinks(d.payment_links || []);
          }
          if (ticketsRes.ok) {
            const d = await ticketsRes.json();
            setTickets(d.tickets || []);
          }
        } else if (tab === "activity") {
          const res = await apiFetch(`/api/admin/external-users/${id}/activity`);
          if (res.ok) {
            const d = await res.json();
            setActivities(d.activities || []);
          }
        } else if (tab === "access") {
          const planSlug = user?.plan?.slug || user?.account_type || "free";
          const res = await apiFetch(`/api/admin/access-rules?plan_slug=${planSlug}`);
          if (res.ok) {
            const d = await res.json();
            setAccessRules(d || []);
          }
        }
      } catch {
        // fail silently for tab data
      }
    },
    [id, user]
  );

  useEffect(() => {
    if (user && (activeTab === "notes" || activeTab === "activity" || activeTab === "access")) {
      fetchTabData(activeTab);
    }
  }, [activeTab, user, fetchTabData]);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      showSuccess("Profile updated successfully");
      setIsEditingProfile(false);
      fetchUser();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, editForm, fetchUser, showSuccess, showError]);

  const handleChangePlan = useCallback(async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          subscription_plan_id: selectedPlan === "none" ? null : selectedPlan,
        }),
      });
      if (!res.ok) throw new Error("Failed to change plan");
      showSuccess("Plan updated successfully");
      fetchUser();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to change plan");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, selectedPlan, fetchUser, showSuccess, showError]);

  const handleAddNote = useCallback(async () => {
    if (!user || !newNote.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}/notes`, {
        method: "POST",
        body: JSON.stringify({ note: newNote.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      showSuccess("Note added");
      setNewNote("");
      fetchTabData("notes");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, newNote, fetchTabData, showSuccess, showError]);

  const handleSaveBusinessInfo = useCallback(async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/api/admin/users/${user.id}/details`, {
        method: "PUT",
        body: JSON.stringify(businessForm),
      });
      if (!res.ok) throw new Error("Failed to save business info");
      showSuccess("Business info saved");
      fetchUser();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save business info");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, businessForm, fetchUser, showSuccess, showError]);

  const handleCopyWhatsApp = useCallback(() => {
    if (!user?.phone_number) {
      showError("No phone number available");
      return;
    }
    const phone = user.phone_number.replace(/\D/g, "");
    const url = `https://wa.me/${phone}`;
    navigator.clipboard.writeText(url);
    showSuccess("WhatsApp link copied");
  }, [user, showSuccess, showError]);

  const handleExportActivityCSV = useCallback(() => {
    const headers = ["Date", "Type", "Description"];
    const rows = activities.map((a) => [
      formatDateTime(a.timestamp),
      a.type,
      a.description,
    ]);
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

  const handleAdvanceLLC = useCallback(
    async (llcId: string, currentStatus: string) => {
      const currentIdx = LLC_STAGES.indexOf(currentStatus);
      if (currentIdx < 0 || currentIdx >= LLC_STAGES.length - 1) return;
      const nextStage = LLC_STAGES[currentIdx + 1];
      try {
        setIsSubmitting(true);
        const updateData: Record<string, any> = { status: nextStage };
        const dateField = LLC_DATE_FIELDS[nextStage];
        if (dateField) {
          updateData[dateField] = new Date().toISOString();
        }
        const res = await apiFetch(`/api/admin/llc/${llcId}`, {
          method: "PATCH",
          body: JSON.stringify(updateData),
        });
        if (!res.ok) throw new Error("Failed to advance LLC stage");
        showSuccess(`LLC advanced to ${LLC_STAGE_LABELS[nextStage]}`);
        fetchUser();
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to advance stage");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUser, showSuccess, showError]
  );

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

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/users")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title={user.full_name || "Unnamed User"} subtitle={user.email} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleCopyWhatsApp} data-testid="button-copy-whatsapp">
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Copy WhatsApp
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push(`/admin/tickets?create=true&userId=${user.id}`)} data-testid="button-create-ticket">
          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          Create Ticket
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push(`/admin/pipeline?paymentLink=true&userId=${user.id}`)} data-testid="button-send-payment">
          <CreditCard className="mr-1.5 h-3.5 w-3.5" />
          Send Payment Link
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsEditingProfile(!isEditingProfile);
          }}
          data-testid="button-edit-profile"
        >
          <Edit className="mr-1.5 h-3.5 w-3.5" />
          Edit Profile
        </Button>
        <Select value={selectedPlan} onValueChange={(val) => { setSelectedPlan(val); }}>
          <SelectTrigger className="w-auto min-w-[140px]" data-testid="select-change-plan">
            <SelectValue placeholder="Change Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Plan</SelectItem>
            {plans.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPlan !== (user.subscription_plan_id || "none") && (
          <Button size="sm" onClick={handleChangePlan} disabled={isSubmitting} data-testid="button-apply-plan">
            Apply
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap" data-testid="tabs-user-detail">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="llc" data-testid="tab-llc">LLC Status</TabsTrigger>
          <TabsTrigger value="learning" data-testid="tab-learning">Learning</TabsTrigger>
          <TabsTrigger value="access" data-testid="tab-access">Feature Access</TabsTrigger>
          <TabsTrigger value="business" data-testid="tab-business">Business Info</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity Log</TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">Notes & History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <OverviewTab
            user={user}
            isEditing={isEditingProfile}
            editForm={editForm}
            setEditForm={setEditForm}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditingProfile(false)}
            isSubmitting={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="llc" className="space-y-6 mt-4">
          <LLCTab
            applications={user.llc_applications}
            onAdvance={handleAdvanceLLC}
            isSubmitting={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="learning" className="space-y-6 mt-4">
          <LearningTab user={user} />
        </TabsContent>

        <TabsContent value="access" className="space-y-6 mt-4">
          <AccessTab rules={accessRules} userId={user.id} planSlug={user.plan?.slug || user.account_type || "free"} onRefresh={() => fetchTabData("access")} />
        </TabsContent>

        <TabsContent value="business" className="space-y-6 mt-4">
          <BusinessTab
            userDetails={businessForm}
            shopifyStores={user.shopify_stores}
            onChange={(key, val) => setBusinessForm((prev) => ({ ...prev, [key]: val }))}
            onSave={handleSaveBusinessInfo}
            isSubmitting={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-4">
          <ActivityTab activities={activities} onExport={handleExportActivityCSV} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6 mt-4">
          <NotesTab
            notes={notes}
            paymentLinks={paymentLinks}
            tickets={tickets}
            newNote={newNote}
            setNewNote={setNewNote}
            onAddNote={handleAddNote}
            isSubmitting={isSubmitting}
            router={router}
          />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function OverviewTab({
  user,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
  isSubmitting,
}: {
  user: UserProfile;
  isEditing: boolean;
  editForm: { full_name: string; phone_number: string; account_type: string };
  setEditForm: (fn: (prev: typeof editForm) => typeof editForm) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SectionCard
        title="Profile"
        actions={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={onCancel} data-testid="button-cancel-edit">Cancel</Button>
              <Button size="sm" onClick={onSave} disabled={isSubmitting} data-testid="button-save-profile">
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
            <AvatarFallback className="text-lg">{getInitials(user.full_name || user.email)}</AvatarFallback>
          </Avatar>
          <div>
            {isEditing ? (
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                className="text-lg font-semibold"
                data-testid="input-edit-name"
              />
            ) : (
              <p className="text-lg font-semibold" data-testid="text-profile-name">{user.full_name || "Unnamed"}</p>
            )}
            <p className="text-sm text-muted-foreground" data-testid="text-profile-email">{user.email}</p>
          </div>
        </div>
        <div className="space-y-1">
          {isEditing ? (
            <>
              <div className="py-1.5">
                <Label className="text-sm text-muted-foreground">Phone</Label>
                <Input
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="Phone number"
                  className="mt-1"
                  data-testid="input-edit-phone"
                />
              </div>
              <div className="py-1.5">
                <Label className="text-sm text-muted-foreground">Account Type</Label>
                <Select value={editForm.account_type} onValueChange={(val) => setEditForm((prev) => ({ ...prev, account_type: val }))}>
                  <SelectTrigger className="mt-1" data-testid="select-edit-type">
                    <SelectValue />
                  </SelectTrigger>
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
              <InfoRow label="Account Type">
                <StatusBadge status={user.account_type === "pro" ? "Pro" : "Free"} />
              </InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={user.status || "active"} />
              </InfoRow>
              <InfoRow label="Plan" value={user.plan?.name || "No Plan"} />
              <InfoRow label="Role" value={user.internal_role ? user.internal_role.replace(/_/g, " ") : "External User"} />
              <InfoRow label="Joined" value={formatDate(user.created_at)} />
            </>
          )}
        </div>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="Business Snapshot">
          <div className="space-y-1">
            <InfoRow label="Onboarding">
              <div className="flex items-center gap-2">
                <StatusBadge status={user.onboarding_completed ? "Completed" : "Pending"} />
                <span className="text-xs text-muted-foreground">{user.onboarding_progress}%</span>
              </div>
            </InfoRow>
            <InfoRow label="Courses Enrolled" value={user.courses.total} />
            <InfoRow label="Courses Completed" value={user.courses.completed} />
            <InfoRow label="Shopify Stores" value={user.shopify_stores.length} />
            <InfoRow label="LLC Applications" value={user.llc_applications.length} />
            <InfoRow label="Batches" value={user.batches.length} />
            {user.lead_score && (
              <>
                <InfoRow label="Lead Score" value={user.lead_score.score} />
                <InfoRow label="Engagement">
                  <StatusBadge status={user.lead_score.engagement_level} />
                </InfoRow>
              </>
            )}
          </div>
        </SectionCard>

        {user.batches.length > 0 && (
          <SectionCard title="Batch Membership">
            <div className="space-y-2">
              {user.batches.map((bm) => (
                <div key={bm.id} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-sm font-medium">{bm.batch?.name || "Unknown Batch"}</p>
                    <p className="text-xs text-muted-foreground">Week {bm.current_week}</p>
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

function LLCTab({
  applications,
  onAdvance,
  isSubmitting,
}: {
  applications: UserProfile["llc_applications"];
  onAdvance: (llcId: string, currentStatus: string) => void;
  isSubmitting: boolean;
}) {
  if (applications.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium" data-testid="text-no-llc">No LLC Applications</p>
        <p className="text-xs text-muted-foreground mt-1">This user has no LLC applications yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((llc) => {
        const currentIdx = LLC_STAGES.indexOf(llc.status);
        const canAdvance = currentIdx >= 0 && currentIdx < LLC_STAGES.length - 1;
        return (
          <SectionCard
            key={llc.id}
            title={llc.llc_name}
            actions={
              canAdvance ? (
                <Button
                  size="sm"
                  onClick={() => onAdvance(llc.id, llc.status)}
                  disabled={isSubmitting}
                  data-testid={`button-advance-llc-${llc.id}`}
                >
                  Move to Next Stage
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              ) : undefined
            }
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {LLC_STAGES.map((stage, idx) => {
                const isComplete = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage} className="flex items-center gap-1">
                    <div
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        isCurrent
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : isComplete
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                      data-testid={`llc-stage-${stage}-${llc.id}`}
                    >
                      {LLC_STAGE_LABELS[stage]}
                    </div>
                    {idx < LLC_STAGES.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
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

function LearningTab({ user }: { user: UserProfile }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Onboarding Progress">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-medium">{user.onboarding_progress}%</span>
          </div>
          <Progress value={user.onboarding_progress} className="h-2" data-testid="progress-onboarding" />
          <InfoRow label="Status">
            <StatusBadge status={user.onboarding_completed ? "Completed" : "In Progress"} />
          </InfoRow>
        </div>
      </SectionCard>

      <SectionCard title="Enrolled Courses">
        {user.courses.enrollments.length === 0 ? (
          <div className="py-6 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-courses">No course enrollments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.courses.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="rounded-lg border p-4" data-testid={`course-enrollment-${enrollment.id}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{enrollment.course_title}</span>
                  </div>
                  <StatusBadge
                    status={enrollment.completed_at ? "Completed" : "In Progress"}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium">{Math.round(enrollment.progress_percentage)}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
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

function AccessTab({
  rules,
  userId,
  planSlug,
  onRefresh,
}: {
  rules: AccessRule[];
  userId: string;
  planSlug: string;
  onRefresh: () => void;
}) {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleRule = async (rule: AccessRule) => {
    try {
      setIsSubmitting(true);
      const newLevel = rule.access_level === "full" ? "locked" : "full";
      await apiFetch("/api/admin/access-rules", {
        method: "POST",
        body: JSON.stringify({
          plan_slug: rule.plan_slug,
          resource_type: rule.resource_type,
          resource_key: rule.resource_key,
          access_level: newLevel,
        }),
      });
      showSuccess(`Access ${newLevel === "full" ? "granted" : "revoked"}`);
      onRefresh();
    } catch {
      showError("Failed to update access");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkAction = async (action: "unlock" | "lock") => {
    try {
      setIsSubmitting(true);
      const promises = rules.map((rule) =>
        apiFetch("/api/admin/access-rules", {
          method: "POST",
          body: JSON.stringify({
            plan_slug: rule.plan_slug,
            resource_type: rule.resource_type,
            resource_key: rule.resource_key,
            access_level: action === "unlock" ? "full" : "locked",
          }),
        })
      );
      await Promise.all(promises);
      showSuccess(`All access ${action === "unlock" ? "granted" : "revoked"}`);
      onRefresh();
    } catch {
      showError("Failed to update access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionCard
      title={`Feature Access (${planSlug} plan)`}
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onRefresh} data-testid="button-refresh-access">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction("unlock")} disabled={isSubmitting} data-testid="button-unlock-all">
            <Unlock className="mr-1.5 h-3.5 w-3.5" />
            Unlock All
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction("lock")} disabled={isSubmitting} data-testid="button-lock-all">
            <Lock className="mr-1.5 h-3.5 w-3.5" />
            Lock All
          </Button>
        </div>
      }
    >
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
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Access Level</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.map((rule) => (
                <tr key={rule.id} data-testid={`row-access-${rule.id}`}>
                  <td className="px-4 py-3 font-medium">{rule.resource_key}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{rule.resource_type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rule.access_level === "full" ? "Active" : rule.access_level === "locked" ? "Inactive" : rule.access_level} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Switch
                      checked={rule.access_level === "full"}
                      onCheckedChange={() => handleToggleRule(rule)}
                      disabled={isSubmitting}
                      data-testid={`switch-access-${rule.id}`}
                    />
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

function BusinessTab({
  userDetails,
  shopifyStores,
  onChange,
  onSave,
  isSubmitting,
}: {
  userDetails: Record<string, any>;
  shopifyStores: UserProfile["shopify_stores"];
  onChange: (key: string, val: any) => void;
  onSave: () => void;
  isSubmitting: boolean;
}) {
  const businessFields = [
    { key: "business_name", label: "Business Name" },
    { key: "business_type", label: "Business Type" },
    { key: "website_url", label: "Website URL" },
    { key: "target_market", label: "Target Market" },
    { key: "monthly_revenue", label: "Monthly Revenue" },
    { key: "experience_level", label: "Experience Level" },
    { key: "goals", label: "Goals" },
    { key: "niche", label: "Niche" },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Business Information"
        actions={
          <Button size="sm" onClick={onSave} disabled={isSubmitting} data-testid="button-save-business">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {businessFields.map((field) => (
            <div key={field.key}>
              <Label className="text-sm text-muted-foreground">{field.label}</Label>
              <Input
                value={userDetails[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="mt-1"
                data-testid={`input-business-${field.key}`}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Shopify Stores">
        {shopifyStores.length === 0 ? (
          <div className="py-6 text-center">
            <Store className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-stores">No Shopify stores connected</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shopifyStores.map((store) => (
              <div key={store.id} className="flex items-center justify-between rounded-lg border p-3" data-testid={`store-${store.id}`}>
                <div>
                  <p className="text-sm font-medium">{store.store_name}</p>
                  <p className="text-xs text-muted-foreground">{store.store_url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={store.status || "Connected"} />
                  {store.store_url && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(store.store_url.startsWith("http") ? store.store_url : `https://${store.store_url}`, "_blank")}
                      data-testid={`button-open-store-${store.id}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function ActivityTab({
  activities,
  onExport,
}: {
  activities: ActivityItem[];
  onExport: () => void;
}) {
  const [filter, setFilter] = useState("all");
  const types = Array.from(new Set(activities.map((a) => a.type)));
  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <SectionCard
      title="Activity Log"
      actions={
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-auto min-w-[120px]" data-testid="filter-activity-type">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={onExport} data-testid="button-export-activity">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            CSV
          </Button>
        </div>
      }
    >
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
                <p className="text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">{activity.type.replace(/_/g, " ")}</Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function NotesTab({
  notes,
  paymentLinks,
  tickets,
  newNote,
  setNewNote,
  onAddNote,
  isSubmitting,
  router,
}: {
  notes: AdminNote[];
  paymentLinks: PaymentLink[];
  tickets: SupportTicket[];
  newNote: string;
  setNewNote: (val: string) => void;
  onAddNote: () => void;
  isSubmitting: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <SectionCard title="Admin Notes">
          <div className="space-y-3">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this user..."
              className="resize-none"
              rows={3}
              data-testid="input-new-note"
            />
            <Button
              size="sm"
              onClick={onAddNote}
              disabled={isSubmitting || !newNote.trim()}
              data-testid="button-add-note"
            >
              <StickyNote className="mr-1.5 h-3.5 w-3.5" />
              Add Note
            </Button>
          </div>
          {notes.length > 0 && (
            <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border p-3" data-testid={`note-${note.id}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={note.admin_avatar_url || undefined} />
                      <AvatarFallback className="text-[10px]">{getInitials(note.admin_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{note.admin_name}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(note.created_at)}</span>
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
              <p className="text-xs text-muted-foreground" data-testid="text-no-payments">No payment history</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {paymentLinks.map((pl) => (
                <div key={pl.id} className="flex items-center justify-between rounded-lg border p-3" data-testid={`payment-${pl.id}`}>
                  <div>
                    <p className="text-sm font-medium">{pl.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(pl.created_at)}</p>
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
              <p className="text-xs text-muted-foreground" data-testid="text-no-tickets">No support tickets</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover-elevate"
                  onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                  data-testid={`ticket-${ticket.id}`}
                >
                  <div>
                    <p className="text-sm font-medium">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(ticket.created_at)}</p>
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
