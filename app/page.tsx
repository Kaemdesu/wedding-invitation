import { Hero } from '@/components/wedding/hero'
import { CoupleSection } from '@/components/wedding/couple-section'
import { EventDetails } from '@/components/wedding/event-details'
import { Gallery } from '@/components/wedding/gallery'
import { Rsvp } from '@/components/wedding/rsvp'
import { WishesWall } from '@/components/wedding/wishes-wall'
import { GiftRegistry } from '@/components/wedding/gift-registry'
import { Countdown } from '@/components/wedding/countdown'
import { Footer } from '@/components/wedding/footer'
import { LazySection } from '@/components/wedding/lazy-section'
import { ElegantBackground } from '@/components/wedding/elegant-background'
import { MusicPlayer } from '@/components/wedding/music-player'
import { PoetryTransition } from '@/components/wedding/poetry-transition'
import { wedding } from '@/lib/wedding-config'

export default function Page() {
  return (
    <>
      <ElegantBackground />
      <main className="relative">
        <Hero />

        {/* Atmospheric bridge from hero to batik */}
        <div
          aria-hidden
          className="relative h-48 bg-gradient-to-b from-background via-background/70 to-transparent"
        />

        {/* ✦ Chapter 1 */}
        <PoetryTransition lines={wedding.poetry.afterHero} />

        <LazySection>
          <CoupleSection />
        </LazySection>

        {/* ✦ Chapter 2 */}
        <PoetryTransition lines={wedding.poetry.afterCouple} />

        <LazySection>
          <EventDetails />
        </LazySection>

        {/* ✦ Chapter 3 */}
        <PoetryTransition lines={wedding.poetry.afterEvents} />

        <LazySection>
          <Gallery />
        </LazySection>

        {/* ✦ Chapter 4 */}
        <PoetryTransition lines={wedding.poetry.afterGallery} />

        <LazySection>
          <Rsvp />
        </LazySection>

        {/* ✦ Chapter 5 */}
        <PoetryTransition lines={wedding.poetry.afterRsvp} />

        <LazySection>
          <WishesWall />
        </LazySection>

        {/* ✦ Chapter 6 */}
        <PoetryTransition lines={wedding.poetry.afterWishes} />

        <LazySection>
          <GiftRegistry />
        </LazySection>

        {/* ✦ Chapter 7 */}
        <PoetryTransition lines={wedding.poetry.afterGifts} />

        <LazySection>
          <Countdown />
        </LazySection>

        {/* ✦ Chapter 8 — final whisper before footer */}
        <PoetryTransition lines={wedding.poetry.afterCountdown} />

        <Footer />
      </main>
      <MusicPlayer />
    </>
  )
}