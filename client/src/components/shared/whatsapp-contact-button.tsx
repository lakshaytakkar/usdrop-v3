
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

interface WhatsAppFloatingButtonProps {
  pocName?: string
  phoneNumber?: string
  avatarUrl?: string
}

export function WhatsAppFloatingButton({
  pocName = "Parth",
  phoneNumber = "+91 9350502364",
  avatarUrl = "https://avatar.iran.liara.run/public/boy",
}: WhatsAppFloatingButtonProps) {
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const formattedNumber = phoneNumber.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${formattedNumber}`

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" data-testid="whatsapp-floating">
      <div
        ref={popupRef}
        className={cn(
          "mb-3 w-72 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 origin-bottom-right",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-2 pointer-events-none"
        )}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="h-5 w-5 text-white" />
            <span className="text-white font-semibold text-sm">Your POC</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
            data-testid="button-close-whatsapp-popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-4 hover:bg-green-50/50 transition-colors group cursor-pointer"
          data-testid="link-whatsapp-contact"
        >
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={pocName}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-green-100"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
              {pocName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{phoneNumber}</p>
            <p className="text-[11px] text-green-600 font-medium mt-1">
              Tap to chat on WhatsApp
            </p>
          </div>
          <WhatsAppIcon className="h-5 w-5 text-green-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
        </a>
      </div>

      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95",
          open
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-green-500 hover:bg-green-600"
        )}
        style={{
          boxShadow: open
            ? "0 4px 14px rgba(0,0,0,0.2)"
            : "0 4px 14px rgba(37,211,102,0.4)",
        }}
        data-testid="button-whatsapp-floating"
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <WhatsAppIcon className="h-7 w-7 text-white" />
        )}
      </button>
    </div>
  )
}
