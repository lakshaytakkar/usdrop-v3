import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Send,
  FileText,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  category: string;
  is_active: boolean;
}

interface SendEmailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    account_type: string;
    plan?: { name: string } | null;
  };
}

export function SendEmailDrawer({ open, onOpenChange, user }: SendEmailDrawerProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("custom");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await apiFetch("/api/admin/email/templates?limit=100");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.templates || [];
      setTemplates(list.filter((t: EmailTemplate) => t.is_active !== false));
    } catch {
      // silent
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchTemplates();
      setSelectedTemplateId("custom");
      setSubject("");
      setHtmlContent("");
      setCustomVariables({});
      setSent(false);
      setError(null);
      setShowPreview(false);
    }
  }, [open, fetchTemplates]);

  const selectedTemplate = useMemo(() => {
    if (selectedTemplateId === "custom") return null;
    return templates.find((t) => t.id === selectedTemplateId) || null;
  }, [selectedTemplateId, templates]);

  const detectedVariables = useMemo(() => {
    if (!selectedTemplate) return [];
    const content = (selectedTemplate.html_content || "") + (selectedTemplate.subject || "");
    const matches = content.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    const unique = [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
    return unique;
  }, [selectedTemplate]);

  const defaultVariables: Record<string, string> = useMemo(() => ({
    name: user.full_name || "",
    full_name: user.full_name || "",
    first_name: (user.full_name || "").split(" ")[0] || "",
    email: user.email,
    plan: user.plan?.name || user.account_type || "Free",
  }), [user]);

  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || "");
      const vars: Record<string, string> = {};
      detectedVariables.forEach((v) => {
        vars[v] = defaultVariables[v] || "";
      });
      setCustomVariables(vars);
    } else {
      setSubject("");
      setCustomVariables({});
    }
  }, [selectedTemplate, detectedVariables, defaultVariables]);

  const resolvedSubject = useMemo(() => {
    let s = subject;
    Object.entries({ ...defaultVariables, ...customVariables }).forEach(([key, value]) => {
      s = s.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });
    return s;
  }, [subject, customVariables, defaultVariables]);

  const resolvedHtml = useMemo(() => {
    let h = selectedTemplate ? selectedTemplate.html_content : htmlContent;
    Object.entries({ ...defaultVariables, ...customVariables }).forEach(([key, value]) => {
      h = h.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });
    return h;
  }, [selectedTemplate, htmlContent, customVariables, defaultVariables]);

  const handleSend = async () => {
    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!selectedTemplate && !htmlContent.trim()) {
      setError("Email content is required");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const body: Record<string, any> = {
        to: user.email,
        subject: resolvedSubject,
      };

      if (selectedTemplate) {
        body.template_id = selectedTemplate.id;
        body.variables = { ...defaultVariables, ...customVariables };
      } else {
        body.html = resolvedHtml;
      }

      const res = await apiFetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSent(true);
      toast({
        title: "Email sent",
        description: `Email delivered to ${user.email}`,
      });

      setTimeout(() => onOpenChange(false), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, EmailTemplate[]> = {};
    templates.forEach((t) => {
      const cat = t.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    return groups;
  }, [templates]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] p-0 flex flex-col" data-testid="drawer-send-email">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <SheetTitle className="text-lg">Send Email</SheetTitle>
              <SheetDescription className="text-sm">
                Compose and send an email to this user
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/80">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
              <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-700">
                {getInitials(user.full_name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" data-testid="text-recipient-name">{user.full_name || "Unnamed"}</p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-recipient-email">{user.email}</p>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">
              {user.plan?.name || (user.account_type === "pro" ? "Pro" : "Free")}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={(val) => {
                setSelectedTemplateId(val);
                setError(null);
                setSent(false);
              }}
              disabled={loadingTemplates}
            >
              <SelectTrigger className="w-full" data-testid="select-template">
                <SelectValue placeholder={loadingTemplates ? "Loading templates..." : "Choose a template"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Write Custom Email
                  </span>
                </SelectItem>
                {Object.entries(groupedTemplates).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Subject</Label>
            <Input
              value={selectedTemplate ? resolvedSubject : subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setError(null);
              }}
              placeholder="Email subject line"
              readOnly={!!selectedTemplate}
              className={selectedTemplate ? "bg-gray-50" : ""}
              data-testid="input-subject"
            />
            {selectedTemplate && resolvedSubject !== selectedTemplate.subject && (
              <p className="text-xs text-muted-foreground">Variables auto-filled from user profile</p>
            )}
          </div>

          {detectedVariables.length > 0 && selectedTemplate && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Template Variables</Label>
              <div className="space-y-2 p-3 rounded-lg border bg-gray-50/50">
                {detectedVariables.map((varName) => (
                  <div key={varName} className="flex items-center gap-3">
                    <code className="text-xs bg-white border rounded px-2 py-1 min-w-[90px] text-center text-muted-foreground font-mono">
                      {`{{${varName}}}`}
                    </code>
                    <Input
                      value={customVariables[varName] || ""}
                      onChange={(e) =>
                        setCustomVariables((prev) => ({ ...prev, [varName]: e.target.value }))
                      }
                      className="h-8 text-sm flex-1"
                      placeholder={`Value for ${varName}`}
                      data-testid={`input-var-${varName}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedTemplate && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Content (HTML)</Label>
              <Textarea
                value={htmlContent}
                onChange={(e) => {
                  setHtmlContent(e.target.value);
                  setError(null);
                }}
                placeholder="<p>Hello {{name}},</p>\n<p>Your email content here...</p>"
                className="min-h-[180px] font-mono text-sm resize-y"
                data-testid="textarea-html-content"
              />
              <p className="text-xs text-muted-foreground">
                Supports HTML. Use {"{{name}}"}, {"{{email}}"}, {"{{plan}}"} for auto-fill.
              </p>
            </div>
          )}

          {(selectedTemplate || htmlContent.trim()) && (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                data-testid="button-toggle-preview"
              >
                <Eye className="h-3.5 w-3.5" />
                {showPreview ? "Hide" : "Show"} Preview
                {showPreview ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {showPreview && (
                <div className="rounded-lg border overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">Email Preview</span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {user.email}
                    </Badge>
                  </div>
                  <div className="p-1 bg-white">
                    <iframe
                      srcDoc={resolvedHtml}
                      className="w-full border-0 min-h-[240px]"
                      sandbox="allow-same-origin"
                      title="Email Preview"
                      data-testid="iframe-email-preview"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700" data-testid="text-send-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {sent && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-700" data-testid="text-send-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Email sent successfully to {user.email}
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 py-4 border-t bg-white flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
            data-testid="button-cancel-email"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || sent || (!subject.trim())}
            className="bg-blue-500 hover:bg-blue-600 min-w-[120px]"
            data-testid="button-send-email"
          >
            {sending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Sending...
              </>
            ) : sent ? (
              <>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Sent
              </>
            ) : (
              <>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
