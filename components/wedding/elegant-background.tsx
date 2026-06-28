'use client'

export function ElegantBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1. Atmospheric base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,oklch(0.17_0.020_270)_0%,oklch(0.12_0.012_270)_55%,oklch(0.08_0.010_270)_100%)]" />

      {/* 2. Soft gold ambient glows — like distant candlelight */}
      <div className="absolute -left-[20%] top-[8%] h-[700px] w-[700px] rounded-full bg-gold/[0.10] blur-[140px]" />
      <div className="absolute -right-[15%] top-[45%] h-[800px] w-[800px] rounded-full bg-amber/[0.09] blur-[160px]" />
      <div className="absolute bottom-[-10%] left-[28%] h-[600px] w-[600px] rounded-full bg-gold-soft/[0.08] blur-[150px]" />

      {/* 3. Batik Kawung pattern — bumped to 12% so it's actually visible */}
      <svg
        className="absolute inset-0 h-full w-full text-gold opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="batik-kawung"
            x="0"
            y="0"
            width="110"
            height="110"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="currentColor" strokeWidth="0.8">
              <ellipse cx="55" cy="0" rx="20" ry="26" />
              <ellipse cx="0" cy="55" rx="26" ry="20" />
              <ellipse cx="110" cy="55" rx="26" ry="20" />
              <ellipse cx="55" cy="110" rx="20" ry="26" />
            </g>
            <g fill="currentColor" opacity="0.9">
              <circle cx="55" cy="55" r="1.8" />
              <circle cx="0" cy="0" r="1.4" />
              <circle cx="110" cy="0" r="1.4" />
              <circle cx="0" cy="110" r="1.4" />
              <circle cx="110" cy="110" r="1.4" />
            </g>
            <g fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.7">
              <ellipse cx="55" cy="0" rx="10" ry="14" />
              <ellipse cx="0" cy="55" rx="14" ry="10" />
              <ellipse cx="110" cy="55" rx="14" ry="10" />
              <ellipse cx="55" cy="110" rx="10" ry="14" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#batik-kawung)" />
      </svg>

      {/* 4. Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.08_0.010_270/0.65)_100%)]" />
    </div>
  )
}