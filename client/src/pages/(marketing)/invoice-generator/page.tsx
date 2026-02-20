import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function InvoiceGeneratorPage() {
  return (
    <FeaturePageTemplate
      badge="Business Tools"
      headline={
        <>
          Create Professional{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Invoices
          </span>{" "}
          Instantly
        </>
      }
      subtext="Generate branded invoices with line items, taxes, and totals. Download as PDF in one click."
      ctaText="Create an Invoice"
      heroImage="/images/marketing/invoice-gen-hero.png"
      heroImageAlt="Invoice generator"
      accentColor="#6366F1"
      sectionBadge="Features"
      sectionTitle="Professional Invoicing Made Easy"
      steps={[
        {
          title: "Add Your Details",
          description: "Business info and line items.",
          image: "/images/marketing/invoice-gen-hero.png",
        },
        {
          title: "Auto-Calculate",
          description: "Taxes and totals done for you.",
          image: "/images/marketing/invoice-gen-hero.png",
        },
        {
          title: "Download PDF",
          description: "Share or print instantly.",
          image: "/images/marketing/invoice-gen-hero.png",
        },
      ]}
      ctaBanner={{
        title: "Look professional from day one.",
        subtitle: "Branded invoices that make your business look established.",
        buttonText: "Try It Free",
      }}
    />
  )
}
