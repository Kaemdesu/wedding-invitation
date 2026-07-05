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
import { BismillahTransition } from '@/components/wedding/bismillah-transition'
import { wedding } from '@/lib/wedding-config'

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

        <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-0">
          <BismillahTransition />

          <LazySection>
            <CoupleSection />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterCouple} />

          <LazySection>
            <EventDetails />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterEvents} />

          <LazySection>
            <Gallery />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterGallery} />

          <LazySection>
            <Rsvp />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterRsvp} />

          <LazySection>
            <WishesWall />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterWishes} />

          <LazySection>
            <GiftRegistry />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterGifts} />

          <LazySection>
            <Countdown />
          </LazySection>

          <PoetryTransition lines={wedding.poetry.afterCountdown} />

          <Footer />
        </div>
      </main>
      <MusicPlayer />
    </>
  )
}