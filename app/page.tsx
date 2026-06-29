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

export default function Page() {
  return (
    <>
      <ElegantBackground />
      <main className="relative">
        <Hero />
        <div
          aria-hidden
          className="relative h-48 bg-gradient-to-b from-background via-background/70 to-transparent"
        />
        <LazySection>
          <CoupleSection />
        </LazySection>
        <LazySection>
          <EventDetails />
        </LazySection>
        <LazySection>
          <Gallery />
        </LazySection>
        <LazySection>
          <Rsvp />
        </LazySection>
        <LazySection>
          <WishesWall />
        </LazySection>
        <LazySection>
          <GiftRegistry />
        </LazySection>
        <LazySection>
          <Countdown />
        </LazySection>
        <Footer />
      </main>
      <MusicPlayer />
    </>
  )
}