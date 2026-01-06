"use client"

import { Crown, Play } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { VideoPlayerModal } from "@/components/ui/video-player-modal"

// Local hero assets
const imgImage = "/images/hero/image-overlay.png"
const imgEllipse11806 = "/images/hero/ellipse-11806.svg"
const imgEllipse11807 = "/images/hero/ellipse-11807.svg"
const imgEllipse11809 = "/images/hero/ellipse-11809.svg"
const imgDiscount = "/images/hero/discount.svg"
const imgGroup1707483725 = "/images/hero/arrow-icon.svg"
const imgBrowserMockup = "/images/hero/browser-mockup.svg"

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="bg-[rgba(255,255,255,0.4)] relative w-full min-h-[720px] overflow-hidden" data-node-id="3:3892">
      {/* Background Ellipses */}
      <div className="absolute bottom-[-140px] right-[-140px] size-[640px]" data-node-id="3:3893">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11806} />
        </div>
      </div>
      <div className="absolute left-[-140px] size-[640px] top-[-140px]" data-node-id="3:3894">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11806} />
        </div>
      </div>
      <div className="absolute bottom-[-140px] left-[-140px] size-[640px]" data-node-id="3:3895">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11807} />
        </div>
      </div>
      <div className="absolute right-[-140px] size-[640px] top-[-140px]" data-node-id="3:3896">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11809} />
        </div>
      </div>

      {/* Image Overlays */}
      <div className="absolute h-[216px] mix-blend-screen opacity-60 right-[-190px] top-[30px] w-[661.091px]" data-name="Image" data-node-id="3:3897">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-1.09%] max-w-none top-0 w-[103.05%]" src={imgImage} />
        </div>
      </div>
      <div className="absolute h-[378px] left-[calc(50%-480px)] mix-blend-screen opacity-60 top-[200px] translate-x-[-50%] w-[1156.91px]" data-name="Image" data-node-id="3:3898">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-1.09%] max-w-none top-0 w-[103.05%]" src={imgImage} />
        </div>
      </div>
      <div className="absolute flex h-[485.205px] items-center justify-center left-[calc(50%-520.45px)] mix-blend-screen top-[545.4px] translate-x-[-50%] w-[1187.35px]">
        <div className="flex-none" style={{ transform: "rotate(354.6deg)" }}>
          <div className="h-[378px] relative w-[1156.91px]" data-name="Image" data-node-id="3:3899">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-full left-[-1.09%] max-w-none top-0 w-[103.05%]" src={imgImage} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[378px] left-[calc(50%-454.96px)] mix-blend-screen top-[835px] translate-x-[-50%] w-[1156.91px]" data-name="Image" data-node-id="3:3900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-1.09%] max-w-none top-0 w-[103.05%]" src={imgImage} />
        </div>
      </div>
      <div className="absolute flex h-[570.327px] items-center justify-center left-[calc(50%+673.25px)] mix-blend-screen top-[676.73px] translate-x-[-50%] w-[1204.518px]">
        <div className="flex-none" style={{ transform: "rotate(350.151deg)" }}>
          <div className="h-[378px] relative w-[1156.91px]" data-name="Image" data-node-id="3:3901">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-full left-[-1.09%] max-w-none top-0 w-[103.05%]" src={imgImage} />
            </div>
          </div>
        </div>
      </div>

      {/* Shadow Element */}
      <div className="absolute bg-[rgba(0,0,0,0.2)] blur-[10px] filter h-[14.332px] left-1/2 top-[562.67px] translate-x-[-50%] w-[179.82px]" data-node-id="3:3902" />

      {/* Discount Badge */}
      <div className="absolute bg-[rgba(255,255,255,0.5)] backdrop-blur-[10px] border border-solid border-white content-stretch flex gap-[12px] items-center left-1/2 translate-x-[-50%] pl-[6px] pr-[16px] py-[6px] relative rounded-[99px] top-[200px] w-fit h-[52px] z-10" data-node-id="3:3903">
        <div className="bg-white content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[999px] shadow-[0px_0.4px_0.8px_0px_rgba(0,0,0,0.06)] shrink-0 h-[40px]" data-node-id="3:3904">
          <Crown className="size-[24px] shrink-0 text-[#FFD700]" fill="#FFD700" data-name="crown" data-node-id="3:3905" />
          <div className="flex flex-col font-['Inter_Display:Medium',sans-serif] h-[20px] justify-center leading-[0] not-italic opacity-80 relative shrink-0 text-[#323140] text-[16px] text-center tracking-[-0.16px] whitespace-nowrap" data-node-id="3:3909">
            <p className="leading-[22.4px]">World's #1</p>
          </div>
        </div>
        <div className="flex flex-col font-['Inter_Display:Medium',sans-serif] justify-center leading-[0] not-italic opacity-80 relative shrink-0 text-[#323140] text-[16px] text-center tracking-[-0.16px] whitespace-nowrap" data-node-id="3:3910">
          <p className="leading-[22.4px]">Start your dropshipping journey with free AI credits</p>
        </div>
      </div>

      {/* Main Heading and Subheading */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-center leading-[0] left-1/2 translate-x-[-50%] text-center top-[276px] w-[886.002px] max-w-[886px]" data-node-id="3:3911">
        <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[60px] text-black tracking-[-2.4px] w-[min-content] font-medium" data-node-id="3:3912">
          <p className="leading-[74px] whitespace-pre-wrap">
            All-in-One <span className="font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Dropshipping</span> Platform Powered by Advanced AI
          </p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[#555555] text-[16px] w-[580.726px] font-normal" data-node-id="3:3913">
          <p className="leading-[22px] whitespace-pre-wrap">Discover winning products, create stunning ads, and automate fulfillment—all in one powerful platform designed to scale your dropshipping business.</p>
        </div>
      </div>

      {/* CTA Buttons Container */}
      <div className="absolute flex gap-[16px] items-center justify-center left-1/2 top-[526px] translate-x-[-50%]" data-node-id="cta-buttons-container">
        {/* Get Started Free Button */}
        <div className="bg-white h-[48px] overflow-clip rounded-[8px] w-[184.2px] relative" data-node-id="3:3914">
          <Link href="/signup" className="block h-full w-full">
            <div 
              className="absolute h-[48px] left-[-0.47px] top-0 w-[184.672px] cursor-pointer" 
              data-node-id="3:3915" 
              style={{ backgroundImage: "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%), linear-gradient(180deg, rgba(255, 47, 47, 1) 0%, rgba(239, 123, 22, 1) 35.878%, rgba(138, 67, 225, 1) 69.922%, rgba(213, 17, 253, 1) 100%)" }} 
            />
            <div 
              className="absolute h-[44px] left-1/2 rounded-[6px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[180.19px] cursor-pointer hover:opacity-90 transition-opacity" 
              data-node-id="3:3916" 
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 180.19 44\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"0.24\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(18.019 4.4 -8.9948 17.553 0 0)\"><stop stop-color=\"rgba(174,163,240,1)\" offset=\"0\"/><stop stop-color=\"rgba(131,122,180,1)\" offset=\"0.25\"/><stop stop-color=\"rgba(109,102,150,1)\" offset=\"0.375\"/><stop stop-color=\"rgba(87,82,120,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(65,61,90,1)\" offset=\"0.625\"/><stop stop-color=\"rgba(44,41,60,1)\" offset=\"0.75\"/><stop stop-color=\"rgba(22,20,30,1)\" offset=\"0.875\"/><stop stop-color=\"rgba(11,10,15,1)\" offset=\"0.9375\"/><stop stop-color=\"rgba(5,5,8,1)\" offset=\"0.96875\"/><stop stop-color=\"rgba(0,0,0,1)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(155.02deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)" }}
            >
              <div className="absolute flex flex-col justify-center leading-[0] left-[16.76px] text-[14.667px] text-white top-[21.9px] translate-y-[-50%] whitespace-nowrap font-bold" data-node-id="3:3917">
                <p className="leading-[18.857px]">Get Started Free</p>
              </div>
              <div className="absolute flex items-center justify-center left-[143.87px] size-[20.952px] top-[11.52px]">
                <div className="flex-none" style={{ transform: "rotate(180deg)" }}>
                  <div className="relative size-[20.952px]" data-name="arrow-left-02" data-node-id="3:3918">
                    <div className="absolute flex inset-[17.43%_17.44%_17.46%_17.45%] items-center justify-center">
                      <div className="flex-none h-[8.73px] w-[10.562px]" style={{ transform: "rotate(-45deg)" }}>
                        <div className="relative size-full" data-node-id="3:3919">
                          <div className="absolute inset-[-6%_-4.96%]">
                            <img alt="" className="block max-w-none size-full" src={imgGroup1707483725} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Watch Video Button */}
        <button
          onClick={() => setIsVideoOpen(true)}
          className="bg-white h-[48px] overflow-hidden rounded-[8px] w-[184.2px] relative border border-solid border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.2)] transition-all cursor-pointer"
          data-node-id="watch-video-button"
        >
          <div className="absolute inset-0 flex items-center justify-between px-[16.76px] bg-white rounded-[6px]">
              {/* Text */}
              <div className="flex flex-col justify-center leading-[0] text-[14.667px] text-[#323140] whitespace-nowrap font-bold" data-node-id="watch-video-text">
                <p className="leading-[18.857px]">Watch Video</p>
              </div>
              {/* Play icon */}
              <div className="flex items-center justify-center size-[20.952px]">
                <Play className="size-[20.952px] text-[#323140] fill-[#323140]" data-name="play-icon" data-node-id="watch-video-icon" />
              </div>
            </div>
        </button>

        {/* Video Player Modal with Academy-style Controls */}
        <VideoPlayerModal
          videoSrc="/videos/7567204602899221815.mp4"
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      </div>

      {/* Browser Mockup */}
      <div className="absolute left-[calc(50%+16.74px)] top-[593.98px] translate-x-[-50%] w-[1193.477px] h-[513.013px]" data-name="Group" data-node-id="3:3941">
        <div className="absolute flex h-[507.243px] items-center justify-center left-[calc(50%+16.74px)] top-[596.86px] translate-x-[-50%] w-[1189.151px]">
          <div className="flex-none" style={{ transform: "rotate(356.834deg) scaleX(99.859%) scaleY(101.146%) skewX(16.943deg)" }}>
            <div className="border border-[rgba(255,255,255,0.6)] border-solid h-[476.626px] overflow-clip relative rounded-[23px] w-[1021.587px]" data-node-id="3:3943">
              <div className="absolute h-[672.167px] left-[-1px] top-[-1.01px] w-[1027px]" data-node-id="3:3944" style={{ backgroundImage: "linear-gradient(1.4210854715202004e-14deg, rgba(255, 47, 47, 0.2) 0%, rgba(239, 123, 22, 0.2) 35.878%, rgba(138, 67, 225, 0.2) 69.922%, rgba(213, 17, 253, 0.2) 100%)" }} />
              <div className="absolute border border-solid border-white h-[638px] left-[calc(50%-0.29px)] overflow-clip rounded-[16px] top-[calc(50%+85.93px)] translate-x-[-50%] translate-y-[-50%] w-[1011px]" data-node-id="3:3945">
                <div className="absolute h-[638.634px] left-[-2px] top-1/2 translate-y-[-50%] w-[1013.065px]" data-name="Div [framer-1bmkzq0]" data-node-id="3:3946">
                  <div className="absolute h-[638.634px] left-0 rounded-[12.334px] top-0 w-[1013.065px]" data-name="Div" data-node-id="3:3947">
                    <div className="absolute h-[638.634px] left-px overflow-clip top-0 w-[1011.075px]" data-name="Image" data-node-id="3:3948">
                      {/* Browser Content - Using the Figma mockup image */}
                      <img 
                        alt="Dashboard mockup" 
                        className="w-full h-full object-cover object-top" 
                        src={imgBrowserMockup}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
