import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface RecurringExpense {
  id: number
  name: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  paidBy: string
  splitAmong: string[]
  category: string
}

interface RecurringExpenseFormProps {
  members: { name: string; role: 'organizer' | 'contributor' }[]
  categories: string[]
  onAddRecurringExpense: (expense: RecurringExpense) => void
}

export function RecurringExpenseForm({ members, categories, onAddRecurringExpense }: RecurringExpenseFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [paidBy, setPaidBy] = useState('')
  const [splitAmong, setSplitAmong] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount || !paidBy || splitAmong.length === 0 || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newRecurringExpense: RecurringExpense = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      frequency,
      paidBy,
      splitAmong,
      category,
    }

    onAddRecurringExpense(newRecurringExpense)
    setName('')
    setAmount('')
    setFrequency('daily')
    setPaidBy('')
    setSplitAmong([])
    setCategory('')

    toast({
      title: "Success",
      description: "Recurring expense added successfully",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Expense Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter expense name"
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)} value={frequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="paidBy">Paid By</Label>
        <Select onValueChange={setPaidBy} value={paidBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.name} value={member.name}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="splitAmong">Split Among</Label>
        <Select
          onValueChange={(value) => setSplitAmong(value.split(','))}
          value={splitAmong.join(',')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select members" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.name} value={member.name}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Recurring Expense</Button>
    </form>
  )
}

