import { useState } from "react"
import { createPortal } from "react-dom"
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  FileText,
  Film,
  FileIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ResourceType = "spreadsheet" | "pdf" | "video" | "template"

interface ResourceFile {
  id: string
  name: string
  description: string
  type: ResourceType
  size: string
  updatedAt: string
}

interface ResourcePreviewModalProps {
  file: ResourceFile | null
  open: boolean
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
}

const spreadsheetData: Record<string, { headers: string[]; rows: string[][] }> = {
  "1": {
    headers: ["Product", "Category", "Sell Price", "Cost", "Margin", "Supplier", "Score"],
    rows: [
      ["LED Strip Lights", "Home Decor", "$24.99", "$6.50", "74%", "ShenZhen Lighting Co.", "9.2"],
      ["Posture Corrector", "Health", "$19.99", "$4.20", "79%", "GuangZhou Health Tech", "8.8"],
      ["Portable Blender", "Kitchen", "$29.99", "$8.75", "71%", "Yiwu Smart Home", "8.5"],
      ["Car Phone Mount", "Auto", "$14.99", "$2.80", "81%", "DongGuan Auto Parts", "8.3"],
      ["Yoga Resistance Bands", "Fitness", "$12.99", "$2.10", "84%", "FuJian Sports Co.", "8.1"],
      ["Pet Grooming Glove", "Pets", "$9.99", "$1.90", "81%", "ZheJiang Pet Supply", "7.9"],
      ["Wireless Earbuds", "Electronics", "$34.99", "$11.50", "67%", "ShenZhen Audio Tech", "7.7"],
      ["Insulated Tumbler", "Lifestyle", "$22.99", "$5.30", "77%", "YiWu Drinkware", "7.5"],
    ],
  },
  "2": {
    headers: ["Company", "Contact", "Email", "Phone", "Category", "MOQ", "Lead Time"],
    rows: [
      ["US Direct Supply", "Mark Johnson", "mark@usdirectsupply.com", "(555) 123-4567", "General", "10 units", "3-5 days"],
      ["FastShip America", "Sarah Lee", "sarah@fastshipamerica.com", "(555) 234-5678", "Electronics", "25 units", "2-4 days"],
      ["HomeGoods Direct", "David Chen", "david@homegoodsdirect.com", "(555) 345-6789", "Home & Garden", "15 units", "4-7 days"],
      ["FitGear Wholesale", "Amy Roberts", "amy@fitgearwholesale.com", "(555) 456-7890", "Fitness", "20 units", "3-5 days"],
      ["PetPro Distributors", "James Wilson", "james@petprodist.com", "(555) 567-8901", "Pet Supplies", "30 units", "5-7 days"],
      ["TechSource USA", "Lisa Wang", "lisa@techsourceusa.com", "(555) 678-9012", "Tech", "50 units", "2-3 days"],
    ],
  },
  "3": {
    headers: ["Month", "Revenue", "COGS", "Ad Spend", "Shipping", "Platform Fees", "Net Profit", "Margin"],
    rows: [
      ["January", "$12,450", "$4,150", "$2,800", "$890", "$625", "$3,985", "32%"],
      ["February", "$15,680", "$5,230", "$3,200", "$1,120", "$784", "$5,346", "34%"],
      ["March", "$18,920", "$6,310", "$3,800", "$1,350", "$946", "$6,514", "34%"],
      ["April", "$22,100", "$7,370", "$4,500", "$1,580", "$1,105", "$7,545", "34%"],
      ["May", "$19,800", "$6,600", "$4,200", "$1,410", "$990", "$6,600", "33%"],
      ["June", "$25,340", "$8,450", "$5,100", "$1,810", "$1,267", "$8,713", "34%"],
    ],
  },
  "11": {
    headers: ["Date", "Campaign", "Platform", "Spend", "Impressions", "Clicks", "CTR", "Conversions", "ROAS"],
    rows: [
      ["Feb 1", "Spring Collection", "Facebook", "$85.00", "12,450", "234", "1.88%", "8", "3.2x"],
      ["Feb 1", "Retargeting", "Facebook", "$45.00", "8,920", "312", "3.50%", "12", "5.8x"],
      ["Feb 2", "Spring Collection", "Facebook", "$90.00", "13,100", "251", "1.92%", "9", "3.4x"],
      ["Feb 2", "TikTok Launch", "TikTok", "$60.00", "25,600", "410", "1.60%", "6", "2.7x"],
      ["Feb 3", "Spring Collection", "Facebook", "$85.00", "11,800", "218", "1.85%", "7", "2.8x"],
      ["Feb 3", "Retargeting", "Facebook", "$50.00", "9,450", "338", "3.58%", "14", "6.1x"],
    ],
  },
}

const pdfContent: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  "4": {
    title: "Dropshipping Startup Checklist",
    sections: [
      { heading: "1. Business Foundation", content: "Register your business entity (LLC recommended for liability protection)\nObtain an EIN from the IRS\nOpen a business bank account\nGet a reseller's permit / sales tax certificate\nChoose your business name and register the domain" },
      { heading: "2. Market Research", content: "Identify your niche market (focus on specific categories)\nResearch competitor stores and pricing strategies\nValidate product demand using Google Trends and social media\nAnalyze profit margins — aim for 30%+ after all costs\nIdentify 3-5 reliable suppliers with US warehousing" },
      { heading: "3. Store Setup", content: "Set up Shopify store with a premium theme\nConfigure payment gateways (Stripe + PayPal)\nCreate essential pages: About, Contact, Shipping Policy, Return Policy, Privacy Policy\nSet up Google Analytics and Facebook Pixel\nConfigure shipping zones and rates" },
      { heading: "4. Product Listings", content: "Write compelling product titles with keywords\nCreate detailed descriptions highlighting benefits\nUpload high-quality product images (minimum 5 per product)\nSet competitive pricing with healthy margins\nAdd trust badges and social proof elements" },
      { heading: "5. Marketing Launch", content: "Set up Facebook Business Manager and ad account\nCreate a content calendar for social media\nLaunch initial test campaigns with $20-50/day budget\nSet up email marketing flows (welcome, abandoned cart, post-purchase)\nPlan influencer outreach strategy" },
    ],
  },
  "5": {
    title: "US Sales Tax Guide for E-commerce",
    sections: [
      { heading: "Understanding Nexus", content: "Economic nexus thresholds vary by state. Most states require collection once you exceed $100,000 in sales or 200 transactions. Physical presence in a state (inventory, employees, office) also creates nexus regardless of sales volume." },
      { heading: "Key State Requirements", content: "California: $500,000 threshold, 7.25% base rate\nTexas: $500,000 threshold, 6.25% base rate\nNew York: $500,000 AND 100+ transactions, 4% base rate\nFlorida: $100,000 threshold, 6% base rate\nPennsylvania: $100,000 threshold, 6% base rate" },
      { heading: "Collection & Remittance", content: "Use automated tax software (TaxJar, Avalara) for accurate rate calculation\nFile returns on time — most states have monthly or quarterly deadlines\nKeep detailed records of all transactions and tax collected\nRegister for sales tax permits BEFORE collecting tax" },
      { heading: "Marketplace Facilitator Laws", content: "Most states now require marketplaces (Amazon, eBay, Walmart) to collect and remit sales tax on your behalf. This does NOT apply to your own Shopify store — you are responsible for direct sales tax collection." },
    ],
  },
  "6": {
    title: "Facebook Ads Playbook for Dropshipping",
    sections: [
      { heading: "Campaign Structure", content: "Use CBO (Campaign Budget Optimization) for scaling\nStart with 3-5 ad sets per campaign\nEach ad set should target different interests or lookalike audiences\nBegin with $20-30/day per ad set for testing\nKill ad sets that don't convert after spending 2x your target CPA" },
      { heading: "Creative Best Practices", content: "Use video ads — they outperform static images 3:1\nHook viewers in the first 3 seconds\nShow the product in use, not just studio shots\nInclude social proof (reviews, UGC content)\nTest multiple headlines and primary text variations" },
      { heading: "Targeting Strategy", content: "Phase 1 (Testing): Interest-based targeting in separate ad sets\nPhase 2 (Validation): Combine winning interests into broader ad sets\nPhase 3 (Scaling): Lookalike audiences from purchasers (1%, 2%, 5%)\nPhase 4 (Expansion): Broad targeting with proven creatives" },
      { heading: "Key Metrics to Track", content: "CPM (Cost Per 1000 Impressions): Aim for under $15\nCTR (Click-Through Rate): Aim for 2%+\nCPC (Cost Per Click): Aim for under $1.50\nCPA (Cost Per Acquisition): Must be under 30% of AOV\nROAS (Return on Ad Spend): Minimum 2.5x to be profitable" },
    ],
  },
  "12": {
    title: "Shipping Rate Comparison Guide",
    sections: [
      { heading: "USPS Rates (2026)", content: "First Class (under 16oz): $3.50 - $5.50\nPriority Mail (1-3 days): $7.50 - $15.00\nPriority Express (1-2 days): $25.00 - $45.00\nBest for: Lightweight items under 1 lb" },
      { heading: "UPS Rates (2026)", content: "Ground (3-5 days): $8.00 - $18.00\n3-Day Select: $12.00 - $25.00\n2nd Day Air: $18.00 - $35.00\nNext Day Air: $30.00 - $60.00\nBest for: Heavier items, reliable tracking" },
      { heading: "FedEx Rates (2026)", content: "Ground (3-5 days): $7.50 - $17.00\nExpress Saver (3 days): $13.00 - $28.00\n2Day: $17.00 - $32.00\nOvernight: $28.00 - $55.00\nBest for: Time-sensitive shipments" },
      { heading: "Recommendations", content: "For items under 1 lb: Use USPS First Class\nFor items 1-5 lbs: Compare USPS Priority vs UPS Ground\nFor items over 5 lbs: UPS or FedEx Ground\nAlways negotiate rates with volume — 20%+ discounts are common\nUse Pirate Ship or Shippo for discounted label purchasing" },
    ],
  },
}

const templateContent: Record<string, { title: string; content: string }> = {
  "9": {
    title: "Customer Email Sequences",
    content: `SEQUENCE 1: ORDER CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Subject: Your order #{{order_number}} is confirmed! 🎉

Hi {{first_name}},

Thank you for your purchase! We're excited to get your order on its way.

Order Summary:
{{order_details}}

Estimated Delivery: {{delivery_date}}

We'll send you a tracking number as soon as your order ships.

Questions? Reply to this email — we're here to help!

Best,
{{store_name}} Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEQUENCE 2: SHIPPING NOTIFICATION

Subject: Your order is on its way! 📦

Hi {{first_name}},

Great news — your order has shipped!

Track your package: {{tracking_link}}
Carrier: {{carrier_name}}
Estimated arrival: {{est_arrival}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEQUENCE 3: POST-DELIVERY FOLLOW-UP (3 days after delivery)

Subject: How's everything? We'd love your feedback ⭐

Hi {{first_name}},

Your order should have arrived by now. We hope you love it!

Would you mind leaving a quick review? It helps other customers
and means the world to our small team.

[Leave a Review] → {{review_link}}

Not satisfied? Reply to this email and we'll make it right.`,
  },
  "10": {
    title: "Return & Refund Policy",
    content: `RETURN & REFUND POLICY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Last Updated: February 2026

1. RETURN WINDOW
We offer a 30-day return window from the date of delivery.
Items must be unused, in original packaging, and in the same
condition as received.

2. HOW TO INITIATE A RETURN
- Contact us at returns@{{store_domain}} with your order number
- We'll provide a prepaid return shipping label
- Pack the item securely and drop it off at any {{carrier}} location

3. REFUND PROCESS
- Refunds are processed within 5-7 business days of receiving the return
- Refund will be issued to the original payment method
- Shipping costs are non-refundable unless the return is due to our error

4. EXCHANGES
We're happy to exchange items for a different size or color.
Contact us within 30 days of delivery to arrange an exchange.

5. DAMAGED OR DEFECTIVE ITEMS
If your item arrives damaged or defective:
- Contact us within 48 hours of delivery with photos
- We'll send a replacement at no cost or issue a full refund
- No need to return the damaged item

6. NON-RETURNABLE ITEMS
- Personalized or custom-made products
- Items marked as "Final Sale"
- Gift cards

7. CONTACT US
Email: support@{{store_domain}}
Response time: Within 24 hours`,
  },
}

function getFileIcon(type: ResourceType) {
  switch (type) {
    case "spreadsheet":
      return <FileSpreadsheet className="h-4 w-4" />
    case "pdf":
      return <FileText className="h-4 w-4" />
    case "video":
      return <Film className="h-4 w-4" />
    case "template":
      return <FileIcon className="h-4 w-4" />
  }
}

function getFileColor(type: ResourceType) {
  switch (type) {
    case "spreadsheet":
      return { bg: "bg-emerald-50", text: "text-emerald-600", accent: "emerald" }
    case "pdf":
      return { bg: "bg-red-50", text: "text-red-500", accent: "red" }
    case "video":
      return { bg: "bg-purple-50", text: "text-purple-600", accent: "purple" }
    case "template":
      return { bg: "bg-blue-50", text: "text-blue-600", accent: "blue" }
  }
}

function SpreadsheetPreview({ fileId }: { fileId: string }) {
  const data = spreadsheetData[fileId]
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Preview not available for this spreadsheet
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-emerald-600 text-white">
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider border-r border-emerald-500 w-10">#</th>
            {data.headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider border-r border-emerald-500 last:border-r-0 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={cn("border-b border-gray-100 transition-colors", ri % 2 === 0 ? "bg-white" : "bg-gray-50/50", "hover:bg-emerald-50/40")}>
              <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono border-r border-gray-100">{ri + 1}</td>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-[13px] text-gray-700 border-r border-gray-100 last:border-r-0 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PDFPreview({ fileId }: { fileId: string }) {
  const data = pdfContent[fileId]
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Preview not available for this document
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>
          <p className="text-sm text-gray-400">USDrop AI Resources</p>
        </div>
        <div className="space-y-8">
          {data.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                {section.heading}
              </h2>
              <div className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line pl-8">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VideoPreview({ file }: { file: ResourceFile }) {
  return (
    <div className="h-full flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
          <Film className="h-10 w-10 text-white/60" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{file.name}</p>
          <p className="text-white/50 text-sm mt-1">{file.size} • {file.description}</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors cursor-pointer"
          data-testid="button-play-video"
        >
          <Film className="h-4 w-4" />
          Play Video
        </button>
      </div>
    </div>
  )
}

function TemplatePreview({ fileId }: { fileId: string }) {
  const data = templateContent[fileId]
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Preview not available for this template
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-6 pb-4 border-b-2 border-blue-100">
          <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
          <p className="text-xs text-gray-400 mt-1">USDrop AI Template</p>
        </div>
        <pre className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
          {data.content}
        </pre>
      </div>
    </div>
  )
}

export function ResourcePreviewModal({
  file,
  open,
  onClose,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}: ResourcePreviewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!open || !file) return null

  const colors = getFileColor(file.type)

  const renderPreview = () => {
    switch (file.type) {
      case "spreadsheet":
        return <SpreadsheetPreview fileId={file.id} />
      case "pdf":
        return <PDFPreview fileId={file.id} />
      case "video":
        return <VideoPreview file={file} />
      case "template":
        return <TemplatePreview fileId={file.id} />
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      data-testid="modal-resource-preview"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={cn(
          "relative flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-200",
          isFullscreen
            ? "w-screen h-screen rounded-none"
            : "w-[90vw] max-w-5xl h-[85vh]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center", colors.bg, colors.text)}>
              {getFileIcon(file.type)}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate" data-testid="text-preview-filename">{file.name}</h2>
              <p className="text-[11px] text-gray-400 truncate">{file.description} • {file.size} • Updated {file.updatedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-4">
            {hasPrev && (
              <button
                onClick={onPrev}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Previous file"
                data-testid="button-preview-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Next file"
                data-testid="button-preview-next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              data-testid="button-preview-fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Download"
              data-testid="button-preview-download"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              title="Close"
              data-testid="button-preview-close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-50">
          {renderPreview()}
        </div>
      </div>
    </div>,
    document.body
  )
}
