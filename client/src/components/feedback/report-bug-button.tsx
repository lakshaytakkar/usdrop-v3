import { useState } from "react";
import { Bug, X } from "lucide-react";
import { apiFetch } from "@/lib/supabase";

/* Floating "Report a bug / feedback" widget. Submits to /api/support/tickets
   (type bug | feature_request | other) which the team triages in the Suprans HQ
   USDrop → Bug Reports inbox. */
export function ReportBugButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature_request" | "other">("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const r = await apiFetch("/api/support/tickets", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), type, description: description.trim() }),
      });
      if (!r.ok) throw new Error("Failed");
      setDone(true);
      setTitle(""); setDescription("");
      setTimeout(() => { setOpen(false); setDone(false); }, 1600);
    } catch {
      alert("Couldn't submit — please try again.");
    } finally { setBusy(false); }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Report a bug or request a feature"
        style={{ position: "fixed", right: 20, bottom: 72, zIndex: 50, display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#111" }}
      >
        <Bug size={16} /> Feedback
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: "100%", background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 17, fontWeight: 700, flex: 1 }}>Report a bug / feedback</div>
              <button onClick={() => setOpen(false)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            {done ? (
              <div style={{ padding: "24px 0", textAlign: "center", color: "#0B7A4B", fontWeight: 600 }}>✓ Thanks! Our team has received it.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {(["bug", "feature_request", "other"] as const).map((t) => (
                    <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, border: type === t ? "2px solid #2E5BFF" : "1px solid #e5e7eb", background: type === t ? "#EEF2FF" : "#fff", cursor: "pointer", fontSize: 12.5, fontWeight: 600, textTransform: "capitalize" }}>
                      {t === "feature_request" ? "Feature" : t}
                    </button>
                  ))}
                </div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === "bug" ? "What went wrong?" : "Your idea / request"} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 8 }} />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details (steps, screenshots links, etc.)" rows={4} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 12 }} />
                <button onClick={submit} disabled={!title.trim() || busy} style={{ width: "100%", padding: "11px", borderRadius: 9, border: "none", background: title.trim() ? "#111" : "#9ca3af", color: "#fff", fontWeight: 700, fontSize: 14, cursor: title.trim() ? "pointer" : "default" }}>
                  {busy ? "Sending…" : "Submit"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
