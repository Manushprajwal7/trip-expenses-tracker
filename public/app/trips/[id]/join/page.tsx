"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Trip {
  id: number
  name: string
  members: string[]
  // ... other trip properties
}

export default function JoinTripPage() {
  const { id } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [name, setName] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]')
    const currentTrip = trips.find((t: Trip) => t.id === Number(id))
    setTrip(currentTrip)
  }, [id])

  const handleJoin = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    if (trip) {
      const updatedTrip = { ...trip, members: [...trip.members, name.trim()] }
      const trips = JSON.parse(localStorage.getItem('trips') || '[]')
      const updatedTrips = trips.map((t: Trip) => t.id === updatedTrip.id ? updatedTrip : t)
      localStorage.setItem('trips', JSON.stringify(updatedTrips))

      toast({
        title: "Success",
        description: "You have joined the trip successfully",
      })

      router.push(`/trips/${id}`)
    }
  }

  if (!trip) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Join Trip: {trip.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <Button onClick={handleJoin} className="w-full">Join Trip</Button>
        </CardContent>
      </Card>
    </div>
  )
}

