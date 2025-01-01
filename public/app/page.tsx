import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WavyBackground } from '@/components/ui/wavy-background'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <WavyBackground className="absolute inset-0 z-0" />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4 relative z-10">
        <h1 className="text-4xl font-bold mb-4">Trip Expenses Tracker</h1>
        <p className="text-xl mb-8">Simplify your trip expenses with ease.</p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/create-trip">Create New Trip</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/trips">View Existing Trips</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

