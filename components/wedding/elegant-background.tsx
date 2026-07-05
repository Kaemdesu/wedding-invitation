'use client'

export function ElegantBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1. Atmospheric base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,oklch(0.17_0.020_270)_0%,oklch(0.12_0.012_270)_55%,oklch(0.08_0.010_270)_100%)]" />

      {/* 2. Floral wallpaper texture — more visible */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: 'url(/images/wallpaper.jpg)' }}
      />

      {/* 3. Soft gold ambient glows on top for warmth */}
      <div className="absolute -left-[20%] top-[8%] h-[700px] w-[700px] rounded-full bg-gold/[0.08] blur-[140px]" />
      <div className="absolute -right-[15%] top-[45%] h-[800px] w-[800px] rounded-full bg-amber/[0.07] blur-[160px]" />
      <div className="absolute bottom-[-10%] left-[28%] h-[600px] w-[600px] rounded-full bg-gold-soft/[0.06] blur-[150px]" />

      {/* 4. Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,oklch(0.06_0.010_270/0.6)_100%)]" />
    </div>
  )
}