

// Local hero assets for ethereal background
const imgEllipse11806 = "/images/hero/ellipse-11806.svg"
const imgEllipse11807 = "/images/hero/ellipse-11807.svg"
const imgEllipse11809 = "/images/hero/ellipse-11809.svg"

export function EtherealBackground() {
  return (
    <>
      {/* Background Ellipses - Ethereal Cloud Pattern */}
      <div className="absolute bottom-[-140px] right-[-140px] size-[640px] opacity-40 pointer-events-none">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11806} />
        </div>
      </div>
      <div className="absolute left-[-140px] size-[640px] top-[-140px] opacity-40 pointer-events-none">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11806} />
        </div>
      </div>
      <div className="absolute bottom-[-140px] left-[-140px] size-[640px] opacity-40 pointer-events-none">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11807} />
        </div>
      </div>
      <div className="absolute right-[-140px] size-[640px] top-[-140px] opacity-40 pointer-events-none">
        <div className="absolute inset-[-65.63%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse11809} />
        </div>
      </div>
    </>
  )
}

