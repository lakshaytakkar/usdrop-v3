import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { DISTANCE, DURATION } from '@/lib/motion';

const brands = [
  { name: "Shopify", logo: "/images/logos/shopify.svg" },
  { name: "Amazon", logo: "/images/logos/amazon.svg" },
  { name: "TikTok Shop", logo: "/images/logos/tiktok.svg" },
  { name: "Meta", logo: "/images/logos/meta.svg" },
  { name: "Google", logo: "/images/logos/google.svg" },
  { name: "Stripe", logo: "/images/logos/stripe.svg" },
];

export function LogoMarquee() {
  return (
    <section className="py-10 lg:py-14 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.sm} duration={DURATION.slow}>
          <div className="flex items-center justify-center max-w-[900px] mx-auto gap-8 sm:gap-10 lg:gap-14 flex-wrap sm:flex-nowrap">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                data-testid={`logo-${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </MotionFadeIn>
      </div>
    </section>
  );
}
