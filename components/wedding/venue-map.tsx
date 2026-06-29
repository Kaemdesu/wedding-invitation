'use client'

import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'
import { useState } from 'react'
import { wedding } from '@/lib/wedding-config'
import { fadeUp, viewportDefaults, easeLuxury } from '@/lib/motion'

export function VenueMap() {
  const { venue } = wedding
  const [loaded, setLoaded] = useState(false)

  // Embed URL (no API key needed — uses public embed endpoint)
  const query = venue.placeId
    ? `place_id:${venue.placeId}`
    : `${venue.lat},${venue.lng}`

  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    `${venue.name}, ${venue.fullAddress}`
  )}&ll=${venue.lat},${venue.lng}&z=16&output=embed`

  // "Open in Maps" link — works on mobile (opens Maps app) and desktop
  const mapsLink = venue.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${venue.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        venue.name + ' ' + venue.fullAddress
      )}`

  // Directions link
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${venue.lat},${venue.lng}`
  )}&destination_place_id=${venue.placeId || ''}`

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportDefaults}
      className="mx-auto mt-10 max-w-5xl md:mt-14"
    >
      {/* Venue label */}
      <div className="mb-5 flex items-center justify-center gap-3 text-center md:mb-6">
        <MapPin className="h-4 w-4 text-gold" />
        <p className="font-mono text-fluid-xs uppercase tracking-[0.3em] text-gold/80">
          The Location
        </p>
      </div>

      {/* Map container */}
      <div className="group relative overflow-hidden rounded-2xl border border-gold/25 bg-card/30 backdrop-blur-sm">
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
              <p className="font-mono text-fluid-xs uppercase tracking-wider text-gold/70">
                Loading map...
              </p>
            </div>
          </div>
        )}

        {/* The actual map iframe */}
        <iframe
          title={`${venue.name} — Map`}
          src={embedUrl}
          width="100%"
          height="420"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="block aspect-[16/10] w-full md:aspect-[21/9]"
        />

        {/* Gold border glow overlay (decorative) */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/20" />
      </div>

      {/* Venue name + address below map */}
      <motion.div
        variants={fadeUp}
        className="mt-6 text-center md:mt-8"
      >
        <h3 className="font-heading text-fluid-2xl font-light italic text-gradient-gold">
          {venue.name}
        </h3>
        <p className="mt-2 font-sans text-fluid-base text-cream/80">
          {venue.fullAddress}
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        variants={fadeUp}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:mt-8"
      >
        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-6 py-3 font-mono text-fluid-xs font-semibold uppercase tracking-[0.25em] text-background transition hover:opacity-90"
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-card/40 px-6 py-3 font-mono text-fluid-xs font-semibold uppercase tracking-[0.25em] text-gold transition hover:border-gold hover:bg-gold/10"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Maps
        </a>
      </motion.div>
    </motion.div>
  )
}