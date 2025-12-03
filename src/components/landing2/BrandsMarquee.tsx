"use client"

const brands = [
  { 
    name: "Shopify", 
    logo: "/images/logos/shopify.svg",
  },
  { 
    name: "WooCommerce", 
    logo: "https://cdn.brandfetch.io/id0HloHs0j/theme/light/logo.svg?c=1bxidFmh5WQIU3SI0_2jW",
  },
  { 
    name: "TikTok Shop", 
    logo: "/images/logos/tiktok.svg",
  },
  { 
    name: "Meta Ads", 
    logo: "/images/logos/meta.svg",
  },
  { 
    name: "AliExpress", 
    logo: "/images/logos/aliexpress.svg",
  },
  { 
    name: "CJ Dropshipping", 
    logo: "https://cdn.brandfetch.io/idVij88c9u/w/100/h/100/theme/dark/logo.png?c=1bxidFmh5WQIU3SI0_2jW",
  },
  { 
    name: "Stripe", 
    logo: "/images/logos/stripe.svg",
  },
  { 
    name: "PayPal", 
    logo: "/images/logos/paypal.svg",
  },
  { 
    name: "Google Ads", 
    logo: "/images/logos/google.svg",
  },
];

export const BrandsMarquee: React.FC = () => {
  return (
    <div id="brands-1" className="py-20 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {brands.map((brand, index) => (
              <div key={index} className="brand-logo flex items-center justify-center">
                <img 
                  className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" 
                  src={brand.logo} 
                  alt={brand.name}
                  style={{ maxWidth: '150px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


