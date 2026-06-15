import { Hero } from '@/components/wedding/hero'
import { CoupleSection } from '@/components/wedding/couple-section'
import { EventDetails } from '@/components/wedding/event-details'
import { Gallery } from '@/components/wedding/gallery'
import { Rsvp } from '@/components/wedding/rsvp'
import { Footer } from '@/components/wedding/footer'

export default function Page() {
  return (
    <main className="bg-background">
      <Hero />
      <CoupleSection />
      <EventDetails />
      <Gallery />
      <Rsvp />
      <Footer />
    </main>
  )
}
