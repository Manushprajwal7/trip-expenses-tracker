"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { Group, Trip } from '@/types/trip';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('trips') || '[]')
    setTrips(storedTrips)
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(storedGroups);
    setLoading(false)
  }, [])

  const handleDelete = (id: number) => {
    const updatedTrips = trips.filter(trip => trip.id !== id)
    localStorage.setItem('trips', JSON.stringify(updatedTrips))
    setTrips(updatedTrips)
    toast({
      title: "Success",
      description: "Trip deleted successfully",
    })
  }

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedTrips = filteredTrips.reduce((acc, trip) => {
    const groupName = trip.group ? groups.find(g => g.id === trip.group)?.name || 'Ungrouped' : 'Ungrouped';
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push(trip)
    return acc
  }, {} as Record<string, Trip[]>)

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Trips</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          type="text"
          placeholder="Search trips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Button asChild>
          <Link href="/create-trip">Create New Trip</Link>
        </Button>
      </div>
      {Object.keys(groupedTrips).length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">No trips found.</p>
          <Button asChild>
            <Link href="/create-trip">Create Your First Trip</Link>
          </Button>
        </div>
      ) : (
        Object.entries(groupedTrips).map(([groupName, groupTrips]) => (
          <div key={groupName} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{groupName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{trip.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Budget: {trip.budget ? `${trip.budgetCurrency} ${trip.budget.toFixed(2)}` : 'Not set'}</p>
                      <p>Members: {trip.members.map(m => m.name).join(', ')}</p>
                      <p>Expenses: {trip.expenses.length}</p>
                    </CardContent>
                    <CardFooter className="space-x-2">
                      <Button asChild>
                        <Link href={`/trips/${trip.id}`}>Manage</Link>
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(trip.id)}>Delete</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

