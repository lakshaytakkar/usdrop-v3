
import { Card } from "@/components/ui/card"
import {
  User,
  Badge,
  PenTool,
  Mail,
  Shield,
  Receipt,
  Calculator,
  Truck,
  ChevronRight,
  Sparkles,
  Wrench,
  ClipboardCheck,
} from "lucide-react"
import { Link } from "wouter"

const studioTools = [
  {
    title: "Model Studio",
    description: "Generate AI model photos for your products",
    icon: User,
    href: "/tools/model-studio",
    color: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  },
  {
    title: "Whitelabelling",
    description: "Create branded product images & packaging",
    icon: Badge,
    href: "/tools/whitelabelling",
    color: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  },
]

const utilityTools = [
  {
    title: "Description Generator",
    description: "AI-powered product descriptions",
    icon: PenTool,
    href: "/tools/description-generator",
    color: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  },
  {
    title: "Email Templates",
    description: "Ready-to-use customer email flows",
    icon: Mail,
    href: "/tools/email-templates",
    color: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  },
  {
    title: "Policy Generator",
    description: "Legal policies for your store",
    icon: Shield,
    href: "/tools/policy-generator",
    color: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  },
  {
    title: "Invoice Generator",
    description: "Professional invoices in seconds",
    icon: Receipt,
    href: "/tools/invoice-generator",
    color: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  },
  {
    title: "Profit Calculator",
    description: "Calculate margins & break-even",
    icon: Calculator,
    href: "/tools/profit-calculator",
    color: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  },
  {
    title: "Shipping Calculator",
    description: "Compare carrier rates & delivery times",
    icon: Truck,
    href: "/tools/shipping-calculator",
    color: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
  },
  {
    title: "CRO Checklist",
    description: "Conversion rate optimization checklist for your store",
    icon: ClipboardCheck,
    href: "/tools/cro-checklist",
    color: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  },
]

function ToolCard({ tool }: { tool: typeof studioTools[0] }) {
  return (
    <Link href={tool.href} className="block group" data-testid={`link-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
      <Card className="p-4 rounded-xl border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-white h-full">
        <div className="flex items-start gap-3.5">
          <div className={`shrink-0 w-11 h-11 rounded-xl ${tool.color.bg} ${tool.color.text} border ${tool.color.border} flex items-center justify-center`}>
            <tool.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{tool.title}</h3>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </div>
            <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-1">{tool.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function ToolsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-12 md:px-20 lg:px-32 py-6 md:py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tools</h1>
        <p className="text-sm text-gray-500">Everything you need to build, brand, and manage your store</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <h2 className="text-[17px] font-bold text-gray-900">AI Studio</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studioTools.map(tool => (
            <Link key={tool.href} href={tool.href} className="block group" data-testid={`link-studio-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className="p-5 rounded-xl border-gray-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-purple-50/30 to-white h-full">
                <div className="flex items-center gap-4">
                  <div className={`shrink-0 w-14 h-14 rounded-xl ${tool.color.bg} ${tool.color.text} border ${tool.color.border} flex items-center justify-center`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{tool.title}</h3>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-500 transition-colors shrink-0" />
                    </div>
                    <p className="text-[13px] text-gray-500 mt-0.5">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Wrench className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-[17px] font-bold text-gray-900">Utility Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {utilityTools.map(tool => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}
