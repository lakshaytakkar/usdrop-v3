"use client"

const integrations = [
  { name: "Shopify", logo: "/images/logos/shopify.svg", description: "Connect store" },
  { name: "WooCommerce", logo: "https://cdn.brandfetch.io/id0HloHs0j/theme/light/logo.svg?c=1bxidFmh5WQIU3SI0_2jW", description: "Import products" },
  { name: "Meta Ads", logo: "/images/logos/meta.svg", description: "Run campaigns" },
  { name: "TikTok Shop", logo: "/images/logos/tiktok.svg", description: "Sync products" },
  { name: "Stripe", logo: "/images/logos/stripe.svg", description: "Process payments" },
  { name: "PayPal", logo: "/images/logos/paypal.svg", description: "Accept payments" },
  { name: "AliExpress", logo: "/images/logos/aliexpress.svg", description: "Source products" },
  { name: "CJ Dropshipping", logo: "https://cdn.brandfetch.io/idVij88c9u/w/100/h/100/theme/dark/logo.png?c=1bxidFmh5WQIU3SI0_2jW", description: "Fulfill orders" },
  { name: "Google Analytics", logo: "/images/logos/google.svg", description: "Track performance" },
];

export const Integrations: React.FC = () => {
  return (
    <section id="integrations-1" className="py-24 integrations-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Automate your workflow with our integrations
          </h2>
          <p className="text-xl text-muted-foreground">
            Connect with the tools you already use and love.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <a
              key={index}
              href="#"
              className="group p-6 bg-background border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Text */}
                <div>
                  <h6 className="text-lg font-bold text-foreground mb-1">
                    {integration.name}
                  </h6>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* More Button */}
        <div className="text-center mt-12">
          <a href="#" className="inline-block px-6 py-3 border border-border rounded-md text-foreground hover:border-primary hover:bg-muted transition-colors font-semibold">
            View all integrations
          </a>
        </div>
      </div>
    </section>
  );
};


