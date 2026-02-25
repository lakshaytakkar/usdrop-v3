import { useState } from "react"
import {
  FileSpreadsheet,
  FileText,
  Download,
  Eye,
  FileIcon,
  Film,
} from "lucide-react"
import { ResourcePreviewModal } from "./components/resource-preview-modal"

type FileType = "all" | "spreadsheet" | "pdf" | "video" | "template"

interface ResourceFile {
  id: string
  name: string
  description: string
  type: "spreadsheet" | "pdf" | "video" | "template"
  size: string
  updatedAt: string
}

const resources: ResourceFile[] = [
  {
    id: "1",
    name: "Product Research Tracker",
    description: "Track and compare products, margins, and suppliers",
    type: "spreadsheet",
    size: "245 KB",
    updatedAt: "Feb 2026",
  },
  {
    id: "2",
    name: "Supplier Contact List",
    description: "Pre-vetted US supplier directory with contact info",
    type: "spreadsheet",
    size: "180 KB",
    updatedAt: "Feb 2026",
  },
  {
    id: "3",
    name: "Profit & Loss Template",
    description: "Monthly P&L tracker for your dropshipping store",
    type: "spreadsheet",
    size: "320 KB",
    updatedAt: "Jan 2026",
  },
  {
    id: "4",
    name: "Dropshipping Startup Checklist",
    description: "Step-by-step checklist to launch your first store",
    type: "pdf",
    size: "1.2 MB",
    updatedAt: "Feb 2026",
  },
  {
    id: "5",
    name: "US Sales Tax Guide",
    description: "State-by-state sales tax requirements for e-commerce",
    type: "pdf",
    size: "890 KB",
    updatedAt: "Jan 2026",
  },
  {
    id: "6",
    name: "Facebook Ads Playbook",
    description: "Proven ad strategies for dropshipping products",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "Feb 2026",
  },
  {
    id: "7",
    name: "Product Listing Walkthrough",
    description: "How to create optimized Shopify product listings",
    type: "video",
    size: "45 min",
    updatedAt: "Feb 2026",
  },
  {
    id: "8",
    name: "Store Launch Blueprint",
    description: "Complete video guide from zero to first sale",
    type: "video",
    size: "1h 20min",
    updatedAt: "Jan 2026",
  },
  {
    id: "9",
    name: "Customer Email Sequences",
    description: "Pre-built email flows for order confirmation & follow-up",
    type: "template",
    size: "56 KB",
    updatedAt: "Feb 2026",
  },
  {
    id: "10",
    name: "Return Policy Template",
    description: "Professionally written return & refund policy",
    type: "template",
    size: "32 KB",
    updatedAt: "Jan 2026",
  },
  {
    id: "11",
    name: "Ad Spend Tracker",
    description: "Daily ad spend and ROAS tracking spreadsheet",
    type: "spreadsheet",
    size: "210 KB",
    updatedAt: "Feb 2026",
  },
  {
    id: "12",
    name: "Shipping Rate Comparison",
    description: "Compare shipping costs across major carriers",
    type: "pdf",
    size: "560 KB",
    updatedAt: "Jan 2026",
  },
]

const tabs: { id: FileType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "spreadsheet", label: "Spreadsheets" },
  { id: "pdf", label: "PDFs" },
  { id: "video", label: "Videos" },
  { id: "template", label: "Templates" },
]

function getFileIcon(type: ResourceFile["type"]) {
  switch (type) {
    case "spreadsheet":
      return <FileSpreadsheet className="h-4.5 w-4.5" />
    case "pdf":
      return <FileText className="h-4.5 w-4.5" />
    case "video":
      return <Film className="h-4.5 w-4.5" />
    case "template":
      return <FileIcon className="h-4.5 w-4.5" />
  }
}

function getFileColor(type: ResourceFile["type"]) {
  switch (type) {
    case "spreadsheet":
      return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" }
    case "pdf":
      return { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" }
    case "video":
      return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" }
    case "template":
      return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" }
  }
}

function getTypeLabel(type: ResourceFile["type"]) {
  switch (type) {
    case "spreadsheet": return "Excel"
    case "pdf": return "PDF"
    case "video": return "Video"
    case "template": return "Template"
  }
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<FileType>("all")
  const [previewFile, setPreviewFile] = useState<ResourceFile | null>(null)

  const filtered = activeTab === "all" ? resources : resources.filter(r => r.type === activeTab)

  const currentPreviewIndex = previewFile ? filtered.findIndex(f => f.id === previewFile.id) : -1
  const hasPrev = currentPreviewIndex > 0
  const hasNext = currentPreviewIndex >= 0 && currentPreviewIndex < filtered.length - 1

  return (
    <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Resources</h1>
        <p className="text-sm text-gray-500">Essential files, templates, and guides for your dropshipping journey</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`button-tab-${tab.id}`}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-2">{filtered.length} files</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_100px_80px_100px_90px] gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <span>Name</span>
          <span>Type</span>
          <span>Size</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(file => {
            const colors = getFileColor(file.type)
            return (
              <div
                key={file.id}
                onClick={() => setPreviewFile(file)}
                className="group flex flex-col md:grid md:grid-cols-[1fr_100px_80px_100px_90px] gap-1 md:gap-2 items-start md:items-center px-4 py-3 hover:bg-blue-50/30 transition-colors cursor-pointer"
                data-testid={`row-resource-${file.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 w-8 h-8 rounded-lg ${colors.bg} ${colors.text} border ${colors.border} flex items-center justify-center`}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{file.description}</p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} md:ml-0 ml-11`}>
                  {getTypeLabel(file.type)}
                </span>

                <span className="text-[12px] text-gray-500 hidden md:block">{file.size}</span>

                <span className="text-[12px] text-gray-400 hidden md:block">{file.updatedAt}</span>

                <div className="hidden md:flex items-center justify-end gap-1">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    data-testid={`button-preview-${file.id}`}
                    title="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                    data-testid={`button-download-${file.id}`}
                    title="Download"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ResourcePreviewModal
        file={previewFile}
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => {
          if (hasPrev) setPreviewFile(filtered[currentPreviewIndex - 1])
        }}
        onNext={() => {
          if (hasNext) setPreviewFile(filtered[currentPreviewIndex + 1])
        }}
      />
    </div>
  )
}
