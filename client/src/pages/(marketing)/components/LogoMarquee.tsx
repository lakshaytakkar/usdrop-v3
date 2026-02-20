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
          <p className="text-center text-[15px] text-[#555555] mb-10">
            Trusted by 50,000+ businesses for innovative design and growth.
          </p>
        </MotionFadeIn>

        <MotionFadeIn direction="up" distance={DISTANCE.sm} duration={DURATION.slow} delay={0.1}>
          <div className="flex items-center justify-between max-w-[900px] mx-auto gap-6 sm:gap-8 lg:gap-12 flex-wrap sm:flex-nowrap">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
                data-testid={`logo-${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-5 w-auto object-contain grayscale"
                />
                <span className="text-[14px] font-medium text-[#333333] hidden sm:inline whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </MotionFadeIn>
      </div>
    </section>
  );
}
