"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Group } from '@/types/trip';

interface Member {
  name: string;
}

export default function CreateTripPage() {
  const [step, setStep] = useState(1)
  const [tripName, setTripName] = useState('')
  const [budget, setBudget] = useState('')
  const [budgetCurrency, setBudgetCurrency] = useState('USD')
  const [members, setMembers] = useState<Member[]>([{ name: '' }])
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]')
    setCategories([
      ...storedCategories,
      'Family Trip',
      'Friends Trip',
      'Bike Ride',
      'Vacation Trip',
      'Business Trip',
      'Adventure Trip',
      'Road Trip',
      'Beach Getaway',
      'City Break',
      'Camping Trip'
    ])
  }, [])

  const handleAddMember = () => {
    setMembers([...members, { name: '' }])
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members]
    newMembers[index] = { name: value }
    setMembers(newMembers)
  }

  const handleSave = () => {
    if (!tripName) {
      toast({
        title: "Error",
        description: "Please enter a trip name",
        variant: "destructive",
      })
      return
    }

    const validMembers = members.filter(member => member.name.trim() !== '')
    if (validMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one group member",
        variant: "destructive",
      })
      return
    }

    const tripData = {
      id: Date.now(),
      name: tripName,
      budget: budget ? parseFloat(budget) : null,
      budgetCurrency,
      members: validMembers,
      expenses: [],
      recurringExpenses: [],
      category: category || 'Uncategorized',
      group: groupName,
      expenseCategories: ['Food', 'Transportation', 'Accommodation', 'Activities', 'Other'],
    }

    const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]')
    localStorage.setItem('trips', JSON.stringify([...existingTrips, tripData]))

    toast({
      title: "Success",
      description: "Trip created successfully!",
    })

    router.push('/trips')
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Create New Trip</h1>
      <Progress value={(step / 5) * 100} className="mb-4" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tripName">Trip Name</Label>
              <Input
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter trip name"
              />
            </div>
            <Button onClick={() => setStep(2)}>Next</Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">Total Budget (Optional)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter total budget"
              />
            </div>
            <div>
              <Label htmlFor="budgetCurrency">Budget Currency</Label>
              <Select onValueChange={setBudgetCurrency} value={budgetCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setStep(3)}>Next</Button>
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Label>Group Members</Label>
            {members.map((member, index) => (
              <div key={index} className="space-y-2">
                <Input
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder={`Member ${index + 1}`}
                />
              </div>
            ))}
            <Button onClick={handleAddMember}>Add Member</Button>
            <div className="space-x-2">
              <Button onClick={() => setStep(4)}>Next</Button>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-x-2">
              <Button onClick={() => setStep(5)}>Next</Button>
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="group">Group Name (Optional)</Label>
              <Input
                id="group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-x-2">
              <Button onClick={handleSave}>Save Trip</Button>
              <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

