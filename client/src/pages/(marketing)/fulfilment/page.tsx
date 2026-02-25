import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function FulfilmentMarketingPage() {
  return (
    <FeaturePageTemplate
      badge="Fulfilment"
      headline={
        <>
          We Pack & Ship{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            For You
          </span>
        </>
      }
      subtext="From our warehouse to your customer's door. Fast, reliable fulfilment in under 7 days."
      ctaText="Start Fulfilling Orders"
      heroImage="/images/marketing/fulfilment-hero.png"
      heroImageAlt="Order fulfilment dashboard"
      painPoints={{
        heading: "The struggle of self-fulfilment",
        items: [
          {
            emoji: "📦",
            label: "Manual Work",
            title: "Packing orders yourself",
            description: "You're taping boxes, printing labels, and hauling packages to the post office every day.",
          },
          {
            emoji: "🐌",
            label: "Slow Shipping",
            title: "30-day delivery from China",
            description: "Your customers wait weeks for their orders and leave negative reviews before the package arrives.",
          },
          {
            emoji: "📞",
            label: "Support Load",
            title: "Constant 'where's my order' emails",
            description: "Without fast shipping and tracking, your inbox fills up with frustrated customer inquiries.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop Fulfilment",
        items: [
          {
            title: "Orders fulfilled automatically",
            description: "When a customer places an order, we pick, pack, and ship it from our warehouse — no manual work required. You focus on selling, we handle the rest.",
            image: "/images/marketing/fulfilment-hero.png",
          },
          {
            title: "Fast delivery, happy customers",
            description: "Delivery in under 7 days with professional packaging and branded inserts. Your customers get a premium experience, and you get fewer complaints.",
            image: "/images/marketing/fulfilment-hero.png",
          },
          {
            title: "Real-time tracking on every order",
            description: "Every shipment includes tracking that syncs with your store. Customers get automatic updates, and you get fewer 'where's my order' emails.",
            image: "/images/marketing/fulfilment-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Connect your store", description: "Link your Shopify store and orders sync automatically. No manual uploads needed." },
        { title: "We pack and ship", description: "Our warehouse team picks, packs, and labels each order with professional packaging." },
        { title: "Customer gets tracking", description: "Tracking info syncs to your store automatically. Customers get live delivery updates." },
      ]}
      ctaBanner={{
        title: "Stop handling shipments yourself.",
        subtitle: "Let us handle packing, shipping, and tracking — so you can focus on selling.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
