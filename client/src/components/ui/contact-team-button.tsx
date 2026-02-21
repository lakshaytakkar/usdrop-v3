import { useState, useRef, useEffect } from "react"
import { ChevronUp, MessageCircle, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const teamMembers = [
  {
    name: "Arjun Mehta",
    role: "Account Manager",
    avatar: "/team/contact-avatar.png",
    whatsapp: "+919876543210",
  },
]

export function ContactTeamButton() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open])

  const handleWhatsAppClick = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    window.open(`https://wa.me/${cleaned}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-50" data-testid="contact-team-container">
      {open && (
        <div
          className="absolute bottom-14 right-0 w-72 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200"
          data-testid="contact-team-dropdown"
        >
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-[13px] font-semibold text-gray-900">Contact Our Team</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">We're here to help you succeed</p>
          </div>

          <div className="p-2">
            {teamMembers.map((member) => (
              <button
                key={member.name}
                onClick={() => handleWhatsAppClick(member.whatsapp)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group"
                data-testid={`button-contact-${member.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">{member.name}</p>
                  <p className="text-[11px] text-gray-500">{member.role}</p>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
            <p className="text-[10px] text-gray-400 text-center">Tap to chat on WhatsApp</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-2 h-10 pl-2.5 pr-3.5 rounded-full text-[13px] font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer group",
          open
            ? "bg-[#25D366] text-white"
            : "bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white"
        )}
        data-testid="button-contact-team"
      >
        <img
          src="/team/contact-avatar.png"
          alt="Contact"
          className="w-6 h-6 rounded-full object-cover border border-white/30"
        />
        <span>Contact Team</span>
        <ChevronUp className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
          open ? "rotate-180" : ""
        )} />
      </button>
    </div>
  )
}
