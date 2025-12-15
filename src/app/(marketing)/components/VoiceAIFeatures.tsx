"use client"

import { Mic, Search, FileCheck, TrendingUp } from "lucide-react"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

// Image assets from Figma
const imgVector8120 = "https://www.figma.com/api/mcp/asset/a70ce659-5985-4c02-8130-8504a62c6384"
const imgVector8121 = "https://www.figma.com/api/mcp/asset/5a8e11c9-51b1-40db-b024-754baadd9d35"
const imgVector = "https://www.figma.com/api/mcp/asset/3ea3e72b-88b6-4728-82cd-e379b0b654aa"

const features = [
  {
    icon: Mic,
    title: "Voice-First Experience",
    description: "Speak, don't type. Interact naturally with our AI using hands-free voice commands.",
    iconColor: "text-red-500",
  },
  {
    icon: Search,
    title: "Smart Article Discovery",
    description: "Say what you need — we'll find it. Our AI understands context and delivers precise results.",
    iconColor: "text-purple-500",
  },
  {
    icon: FileCheck,
    title: "Instant Article Summaries",
    description: "Get to the point faster. AI-powered summaries help you digest content in seconds.",
    iconColor: "text-green-500",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Results",
    description: "No delays. Enjoy lightning-fast voice recognition and content delivery.",
    iconColor: "text-orange-500",
  },
]

const aiCapabilities: Array<{ label: string; rotation: number; position: { top?: string; bottom?: string; left?: string; right?: string } }> = [
  { label: "AI Generator", rotation: 350, position: { top: "200.68px", left: "calc(50%-4px)" } },
  { label: "AI Music", rotation: 352, position: { top: "199.35px", left: "36.01px" } },
  { label: "Smart Audio", rotation: 350, position: { top: "221.67px", left: "330.69px" } },
  { label: "API Integration", rotation: 19, position: { top: "270.93px", left: "6.3px" } },
  { label: "Real Audio", rotation: 328, position: { bottom: "1px", right: "1px" } },
  { label: "Audio Enhancement", rotation: 0, position: { bottom: "18.96px", left: "calc(50%-19.61px)" } },
  { label: "Noise Cancellation", rotation: 11, position: { top: "278.73px", left: "calc(50%+43.26px)" } },
]

export function VoiceAIFeatures() {
  return (
    <section className="py-20 lg:py-32 bg-[rgba(255,255,255,0.4)] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-[60px] items-start w-full">
          {/* Header Section */}
          <div className="flex flex-col gap-4 items-start w-full">
            {/* Features Badge */}
            <MotionFadeIn direction="up" distance={DISTANCE.sm} duration={DURATION.fast}>
              <div className="bg-gradient-to-b border-2 border-solid border-white from-[#e8e4e2] h-[60px] overflow-clip relative rounded-[12px] w-[106px]">
                <div className="absolute bg-white h-[48px] left-1/2 overflow-clip rounded-[8px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[94px]">
                  <div
                    className="absolute h-[48px] left-[-0.93px] top-0 w-[94.932px]"
                    style={{
                      backgroundImage:
                        "linear-gradient(152.6621732852738deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%)",
                    }}
                  />
                  <div
                    className="absolute h-[44px] left-1/2 rounded-[6px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[90px]"
                    style={{
                      backgroundImage:
                        "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 90 44\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.23999999463558197\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(9 4.4 -4.4927 17.553 0 0)\\'><stop stop-color=\\'rgba(174,163,240,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(131,122,180,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(109,102,150,1)\\' offset=\\'0.375\\'/><stop stop-color=\\'rgba(87,82,120,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(65,61,90,1)\\' offset=\\'0.625\\'/><stop stop-color=\\'rgba(44,41,60,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(22,20,30,1)\\' offset=\\'0.875\\'/><stop stop-color=\\'rgba(11,10,15,1)\\' offset=\\'0.9375\\'/><stop stop-color=\\'rgba(5,5,8,1)\\' offset=\\'0.96875\\'/><stop stop-color=\\'rgba(0,0,0,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>'), linear-gradient(136.9895457133776deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)",
                    }}
                  >
                    <div className="absolute flex flex-col font-medium justify-center leading-[0] left-[calc(50%-29px)] text-[14.667px] text-white top-1/2 translate-y-[-50%] whitespace-nowrap">
                      <p className="leading-[18.857px]">Features</p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionFadeIn>

            {/* Heading Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:gap-8 items-start w-full">
              <MotionFadeIn direction="up" distance={DISTANCE.md} delay={0.1} duration={DURATION.slow}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1b0c25] leading-tight">
                  Learn Smarter, Just by Speaking — Powered by Voice AI
                </h2>
              </MotionFadeIn>
              <MotionFadeIn direction="left" distance={DISTANCE.md} delay={0.2} duration={DURATION.slow}>
                <p className="text-base sm:text-lg text-[#555555] text-left lg:text-right whitespace-normal lg:whitespace-nowrap lg:ml-auto">
                  From Voice Commands to Custom Summaries — It's All Effortless
                </p>
              </MotionFadeIn>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 lg:gap-12 w-full relative">
            {/* Left Section - Features Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
              {/* Decorative Vector Elements - Hidden on mobile for better layout */}
              <div className="hidden xl:block absolute left-[328px] top-0 h-[416px] w-0 pointer-events-none z-0">
                <div className="absolute inset-[-0.12%_-1.3px_-0.12%_-0.5px]">
                  <img alt="" className="block max-w-none size-full" src={imgVector8120} />
                </div>
              </div>
              <div className="hidden xl:block absolute left-0 top-[208px] h-0 w-[656px] pointer-events-none z-0">
                <div className="flex items-center justify-center">
                  <div className="flex-none rotate-[270deg]">
                    <div className="h-[656px] relative w-0">
                      <div className="absolute inset-[-0.08%_-0.5px_-0.2%_-0.5px]">
                        <img alt="" className="block max-w-none size-full" src={imgVector8121} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {features.map((feature, index) => (
                <MotionFadeIn
                  key={index}
                  direction="up"
                  distance={DISTANCE.md}
                  delay={0.1 + index * 0.1}
                  duration={DURATION.slow}
                >
                  <div className="h-[200px] relative w-full z-10">
                    <div className="absolute content-stretch flex flex-col gap-5 items-start left-6 top-6 w-[calc(100%-48px)]">
                      <div className="relative shrink-0 size-8">
                        <feature.icon className={`size-8 ${feature.iconColor}`} />
                      </div>
                      <div className="content-stretch flex flex-col gap-3 items-start leading-[0] relative shrink-0 w-full">
                        <div className="flex flex-col font-medium justify-center min-w-full relative shrink-0 text-lg text-black">
                          <p className="leading-normal whitespace-pre-wrap">{feature.title}</p>
                        </div>
                        <div className="flex flex-col font-normal justify-center relative shrink-0 text-[#555555] text-sm w-full">
                          <p className="leading-[22px] whitespace-pre-wrap">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionFadeIn>
              ))}
            </div>

            {/* Right Section - AI Capabilities Graphic */}
            <MotionFadeIn direction="left" distance={DISTANCE.lg} delay={0.3} duration={DURATION.slow}>
              <div className="bg-[rgba(241,211,255,0.3)] border-2 border-[rgba(255,255,255,0.6)] border-solid h-[400px] sm:h-[452px] overflow-clip relative rounded-[24px] w-full lg:w-[512px] shrink-0 min-h-[400px]">
                {/* Background Vector Decorations */}
                <div className="absolute flex h-[452px] items-center justify-center left-[calc(50%-268px)] top-[-52px] translate-x-[-50%] w-[1022.579px] pointer-events-none">
                  <div className="flex-none rotate-[180deg]">
                    <div className="h-[452px] relative w-[1022.579px]">
                      <div className="absolute inset-[-9.73%_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[452px] items-center justify-center left-[-345.84px] top-[119px] w-[1022.579px] pointer-events-none">
                  <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                    <div className="h-[452px] relative w-[1022.579px]">
                      <div className="absolute inset-[-9.73%_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Capability Tags */}
                {aiCapabilities.map((capability, index) => {
                  // Convert pixel positions to responsive positioning
                  const getPosition = () => {
                    if (capability.position.top && capability.position.left) {
                      return {
                        top: capability.position.top,
                        left: capability.position.left,
                      }
                    }
                    if (capability.position.bottom && capability.position.right) {
                      return {
                        bottom: capability.position.bottom,
                        right: capability.position.right,
                      }
                    }
                    if (capability.position.bottom && capability.position.left) {
                      return {
                        bottom: capability.position.bottom,
                        left: capability.position.left,
                      }
                    }
                    if (capability.position.top && capability.position.right) {
                      return {
                        top: capability.position.top,
                        right: capability.position.right,
                      }
                    }
                    return {}
                  }

                  return (
                    <div
                      key={index}
                      className="absolute flex items-center justify-center"
                      style={{
                        ...getPosition(),
                        height: "auto",
                        width: "auto",
                      }}
                    >
                      <div className="flex-none" style={{ transform: `rotate(${capability.rotation}deg)` }}>
                        <div className="bg-white content-stretch flex items-center justify-center px-4 sm:px-[30px] py-2 sm:py-[15px] relative rounded-[99px] shadow-[0px_1.935px_5.804px_0px_rgba(0,0,0,0.03),0px_0.774px_0.774px_0px_rgba(0,0,0,0.03)]">
                          <div className="flex flex-col font-medium justify-center leading-[0] relative shrink-0 text-sm sm:text-lg text-black whitespace-nowrap">
                            <p className="leading-normal">{capability.label}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </MotionFadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

