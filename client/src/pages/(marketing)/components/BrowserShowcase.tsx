



export function BrowserShowcase() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-32">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50" />
        
        {/* Abstract Bubble Shapes */}
        <div className="absolute flex h-[780px] items-center justify-center left-1/2 top-[-49px] translate-x-[-50%] w-full max-w-[1879px]">
          <div className="flex-none rotate-[180deg] skew-x-[2.269deg]">
            <div className="h-[781px] relative w-full max-w-[1848px] opacity-30">
              <div className="absolute inset-[-64%_-27%] bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
        
        <div className="absolute flex h-[1958px] items-center justify-center left-1/2 top-[-638px] translate-x-[-50%] w-full max-w-[1240px]">
          <div className="flex-none rotate-[105deg] skew-x-[2.269deg]">
            <div className="h-[781px] relative w-full max-w-[1848px] opacity-30">
              <div className="absolute inset-[-64%_-27%] bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Browser Mockup Window */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="relative h-[600px] left-1/2 shadow-[0px_0px_100px_0px_rgba(35,42,62,0.12)] translate-x-[-50%] w-full max-w-[1440px]">
          {/* Browser Header */}
          <div className="absolute h-12 left-0 right-0 top-0 z-10">
            <div className="absolute bg-white border-[rgba(0,0,0,0.07)] border-b border-solid inset-0 rounded-tl-[5px] rounded-tr-[5px]" />
            
            {/* macOS Traffic Lights */}
            <div className="absolute flex gap-2 items-start left-[18px] top-1/2 translate-y-[-50%]">
              <div className="size-3 rounded-full bg-red-400" />
              <div className="size-3 rounded-full bg-yellow-400" />
              <div className="size-3 rounded-full bg-green-400" />
            </div>

            {/* Navigation Arrows */}
            <div className="absolute flex gap-2 items-start left-[156px] top-1/2 translate-y-[-50%] w-14">
              <button className="size-6 flex items-center justify-center hover:bg-slate-100 rounded transition-colors">
                <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="size-6 flex items-center justify-center hover:bg-slate-100 rounded transition-colors">
                <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Browser Icons */}
            <div className="absolute right-[88px] rounded-md size-6 top-1/2 translate-y-[-50%] bg-slate-100 hover:bg-slate-200 transition-colors" />
            <div className="absolute right-[56px] rounded-md size-6 top-1/2 translate-y-[-50%] bg-slate-100 hover:bg-slate-200 transition-colors" />
            <div className="absolute right-[24px] rounded-md size-6 top-1/2 translate-y-[-50%] bg-slate-100 hover:bg-slate-200 transition-colors" />

            {/* URL Bar */}
            <div className="absolute bg-[#f2f2f2] h-7 left-[27.15%] right-[27.22%] rounded-md top-[10px]" />
          </div>

          {/* Browser Content Area */}
          <div className="absolute bg-white inset-[48px_0_0_0] rounded-bl-2xl rounded-br-2xl overflow-hidden">
            <img
              src="/images/landing/hero-browser-content.png"
              alt="USDrop AI Platform Dashboard"
             
              className="object-cover"
             
            />
          </div>
        </div>
      </div>
    </section>
  )
}

