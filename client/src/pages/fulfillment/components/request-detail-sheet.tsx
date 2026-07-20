import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Check, Truck, XCircle, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FulfillmentRequest,
  PIPELINE,
  STATUS_META,
  statusIndex,
  statusBadgeClass,
  fmtDate,
  orderItemsSummary,
  WAREHOUSE,
} from "../lib"

interface RequestDetailSheetProps {
  request: FulfillmentRequest | null
  onClose: () => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[12.5px] text-slate-500">{label}</span>
      <span className="text-[13px] font-medium text-slate-900 text-right">{value}</span>
    </div>
  )
}

export function RequestDetailSheet({ request, onClose }: RequestDetailSheetProps) {
  const open = !!request
  const cancelled = request?.status === "cancelled"
  const currentIdx = request ? statusIndex(request.status) : -1

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        {request && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-center justify-between gap-3">
                <SheetTitle>{request.order_number || `Request ${request.id.slice(0, 8)}`}</SheetTitle>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize", statusBadgeClass(request.status))}>
                  {STATUS_META[request.status]?.label || request.status}
                </span>
              </div>
            </SheetHeader>

            {/* Timeline */}
            <div className="mt-5">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500 mb-3">Progress</div>
              {cancelled ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5">
                  <XCircle className="h-4 w-4 text-rose-500" />
                  <span className="text-[13px] font-medium text-rose-700">This request was cancelled.</span>
                </div>
              ) : (
                <ol className="relative">
                  {PIPELINE.map((step, i) => {
                    const done = i < currentIdx
                    const active = i === currentIdx
                    const isLast = i === PIPELINE.length - 1
                    return (
                      <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
                        {!isLast && (
                          <span
                            className={cn(
                              "absolute left-[11px] top-6 bottom-0 w-px",
                              done ? "bg-emerald-300" : "bg-slate-200"
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "relative z-[1] shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2",
                            done && "bg-emerald-500 border-emerald-500 text-white",
                            active && "bg-blue-600 border-blue-600 text-white",
                            !done && !active && "bg-white border-slate-300 text-transparent"
                          )}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : active ? <Truck className="h-3 w-3" /> : null}
                        </span>
                        <div className="min-w-0 -mt-0.5">
                          <div className={cn("text-[13.5px] font-semibold", active ? "text-blue-700" : done ? "text-slate-900" : "text-slate-400")}>
                            {STATUS_META[step].label}
                          </div>
                          <div className="text-[12px] text-slate-500 leading-relaxed">{STATUS_META[step].blurb}</div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>

            {/* Tracking */}
            {request.tracking_number && (
              <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">Tracking</div>
                <div className="text-[13px] font-medium text-slate-900 mt-0.5">
                  {request.carrier ? `${request.carrier} · ` : ""}{request.tracking_number}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="mt-5">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Details</div>
              <Row label="Items" value={orderItemsSummary(request.items)} />
              <Row label="Quantity" value={request.quantity} />
              <Row label="Destination" value={request.destination_country} />
              <Row
                label="Quote"
                value={request.quote_amount != null ? `${request.currency === "USD" ? "$" : request.currency + " "}${Number(request.quote_amount).toFixed(2)}` : "Pending"}
              />
              <Row label="Requested" value={fmtDate(request.created_at)} />
              {request.notes && <Row label="Notes" value={request.notes} />}
            </div>

            {/* Fulfilled by */}
            <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-slate-900 truncate">{WAREHOUSE.name}</div>
                <div className="text-[11.5px] text-slate-500">{WAREHOUSE.location}</div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
