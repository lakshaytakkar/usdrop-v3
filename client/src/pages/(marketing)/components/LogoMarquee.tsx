const brands = [
  { name: "Shopify", logo: "/images/logos/shopify.svg" },
  { name: "Amazon", logo: "/images/logos/amazon.svg" },
  { name: "TikTok Shop", logo: "/images/logos/tiktok.svg" },
  { name: "Meta", logo: "/images/logos/meta.svg" },
  { name: "Google", logo: "/images/logos/google.svg" },
  { name: "Stripe", logo: "/images/logos/stripe.svg" },
  { name: "eBay", logo: "/images/logos/ebay.svg" },
  { name: "PayPal", logo: "/images/logos/paypal.svg" },
  { name: "Walmart", logo: "/images/logos/walmart.svg" },
  { name: "Etsy", logo: "/images/logos/etsy.svg" },
];

export function LogoMarquee() {
  return (
    <section className="py-10 lg:py-14 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p
          className="text-center text-sm tracking-widest uppercase text-muted-foreground font-medium"
          data-testid="text-logo-marquee-headline"
        >
          Supporting 10,000+ Sellers
        </p>
      </div>
      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center justify-center opacity-60 mx-8 sm:mx-10 shrink-0"
              data-testid={`logo-${brand.name.toLowerCase().replace(/\s+/g, '-')}-${i}`}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-[36px] w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
