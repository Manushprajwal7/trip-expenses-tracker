"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShareTrip } from '@/components/share-trip'
import { RecurringExpenseForm } from '@/components/recurring-expense-form'
import { ExpenseCategoryManager } from '@/components/expense-category-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Group, Trip, Expense, RecurringExpense, ExchangeRate, Member } from '@/types/trip'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { CSVLink } from 'react-csv'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Checkbox } from "@/components/ui/checkbox"

export default function TripDetailsPage() {
  const { id } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCurrency, setExpenseCurrency] = useState('USD')
  const [expenseCategory, setExpenseCategory] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitAmong, setSplitAmong] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [splitAmongAllExceptPayer, setSplitAmongAllExceptPayer] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTripData = () => {
      const trips = JSON.parse(localStorage.getItem('trips') || '[]')
      const currentTrip = trips.find((t: Trip) => t.id === Number(id))
      if (currentTrip) {
        if (!currentTrip.expenseCategories) {
          currentTrip.expenseCategories = ['Food', 'Transportation', 'Accommodation', 'Activities', 'Other']
        }
        setTrip(currentTrip)
        if (currentTrip.members.length > 0) {
          setCurrentUser(currentTrip.members[0])
        }
      }

      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]')
      setGroups(storedGroups)

      const storedExchangeRates = JSON.parse(localStorage.getItem('exchangeRates') || '[]')
      setExchangeRates(storedExchangeRates)

      setLoading(false)
    }

    fetchTripData()
  }, [id])

  const handleAddExpense = () => {
    if (!trip) return

    if (!expenseName || !expenseAmount || !paidBy || (!splitAmong.length && !splitAmongAllExceptPayer) || !expenseCategory) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const splitAmongMembers = splitAmongAllExceptPayer
      ? trip.members.filter(member => member.name !== paidBy).map(member => member.name)
      : splitAmong

    const newExpense: Expense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      currency: expenseCurrency,
      paidBy,
      splitAmong: splitAmongMembers,
      date: new Date().toISOString(),
      category: expenseCategory,
    }

    const updatedTrip = { ...trip, expenses: [...trip.expenses, newExpense] }
    updateTripInStorage(updatedTrip)

    setTrip(updatedTrip)
    setExpenseName('')
    setExpenseAmount('')
    setExpenseCurrency('USD')
    setExpenseCategory('')
    setPaidBy('')
    setSplitAmong([])
    setSplitAmongAllExceptPayer(false)

    toast({
      title: "Success",
      description: "Expense added successfully",
    })
  }

  const handleAddRecurringExpense = (newRecurringExpense: RecurringExpense) => {
    if (!trip) return

    const updatedTrip = {
      ...trip,
      recurringExpenses: [...(trip.recurringExpenses || []), newRecurringExpense],
    }
    updateTripInStorage(updatedTrip)
    setTrip(updatedTrip)
  }

  const handleDeleteExpense = (expenseId: number) => {
    if (!trip) return

    const updatedExpenses = trip.expenses.filter(expense => expense.id !== expenseId)
    const updatedTrip = { ...trip, expenses: updatedExpenses }
    updateTripInStorage(updatedTrip)
    setTrip(updatedTrip)

    toast({
      title: "Success",
      description: "Expense deleted successfully",
    })
  }

  const handleDeleteRecurringExpense = (expenseId: number) => {
    if (!trip) return

    const updatedRecurringExpenses = trip.recurringExpenses.filter(expense => expense.id !== expenseId)
    const updatedTrip = { ...trip, recurringExpenses: updatedRecurringExpenses }
    updateTripInStorage(updatedTrip)
    setTrip(updatedTrip)

    toast({
      title: "Success",
      description: "Recurring expense deleted successfully",
    })
  }

  const updateTripInStorage = (updatedTrip: Trip) => {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]')
    const updatedTrips = trips.map((t: Trip) => t.id === updatedTrip.id ? updatedTrip : t)
    localStorage.setItem('trips', JSON.stringify(updatedTrips))
  }

  const handleShare = () => {
    if (!trip) return

    const tripSummary = `Trip: ${trip.name}
Budget: ${trip.budget ? `${trip.budgetCurrency} ${trip.budget.toFixed(2)}` : 'Not set'}
Members: ${trip.members.map(m => m.name).join(', ')}
Total Expenses: ${trip.budgetCurrency} ${totalExpenses.toFixed(2)}`

    if (navigator.share) {
      navigator.share({
        title: `Trip Summary: ${trip.name}`,
        text: tripSummary,
      }).then(() => {
        toast({
          title: "Success",
          description: "Trip summary shared successfully",
        })
      }).catch((error) => {
        console.error('Error sharing:', error)
        fallbackShare(tripSummary)
      })
    } else {
      fallbackShare(tripSummary)
    }
  }

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Success",
        description: "Trip summary copied to clipboard. You can now paste and share it.",
      })
    }).catch((error) => {
      console.error('Error copying to clipboard:', error)
      toast({
        title: "Error",
        description: "Failed to copy trip summary. Please try again.",
        variant: "destructive",
      })
    })
  }

  const handleCategoriesChange = (newCategories: string[]) => {
    if (!trip) return

    const updatedTrip = { ...trip, expenseCategories: newCategories }
    updateTripInStorage(updatedTrip)
    setTrip(updatedTrip)
  }

  const handleChangeGroup = (groupId: string) => {
    if (!trip) return

    const updatedTrip = { ...trip, group: groupId === "no-group" ? null : parseInt(groupId) };
    updateTripInStorage(updatedTrip);
    setTrip(updatedTrip);

    toast({
      title: "Success",
      description: "Trip group updated successfully",
    });
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount

    const directRate = exchangeRates.find(rate => rate.from === fromCurrency && rate.to === toCurrency)
    if (directRate) return amount * directRate.rate

    const inverseRate = exchangeRates.find(rate => rate.from === toCurrency && rate.to === fromCurrency)
    if (inverseRate) return amount / inverseRate.rate

    // If no direct or inverse rate, try to convert through USD
    const fromToUSD = exchangeRates.find(rate => rate.from === fromCurrency && rate.to === 'USD')
    const usdToTarget = exchangeRates.find(rate => rate.from === 'USD' && rate.to === toCurrency)
    if (fromToUSD && usdToTarget) {
      return amount * fromToUSD.rate * usdToTarget.rate
    }

    // If conversion is not possible, return the original amount
    console.warn(`Unable to convert from ${fromCurrency} to ${toCurrency}`)
    return amount
  }

  const generatePDF = () => {
    if (!trip) return

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(`Trip Report: ${trip.name}`, 14, 22)
    
    doc.setFontSize(12)
    doc.text(`Total Budget: ${trip.budgetCurrency} ${trip.budget?.toFixed(2) || 'Not set'}`, 14, 32)
    doc.text(`Total Expenses: ${trip.budgetCurrency} ${totalExpenses.toFixed(2)}`, 14, 40)
    
    if (remainingBudget !== null) {
      doc.text(`Remaining Budget: ${trip.budgetCurrency} ${remainingBudget.toFixed(2)}`, 14, 48)
    }

    doc.autoTable({
      head: [['Name', 'Amount', 'Currency', 'Category', 'Paid By', 'Split Among', 'Date']],
      body: trip.expenses.map(expense => [
        expense.name,
        expense.amount.toFixed(2),
        expense.currency,
        expense.category,
        expense.paidBy,
        expense.splitAmong.join(', '),
        new Date(expense.date).toLocaleDateString()
      ]),
      startY: 60
    })

    doc.save(`${trip.name}_report.pdf`)
  }

  const generateCSV = () => {
    if (!trip) return

    const csvData = [
      ['Name', 'Amount', 'Currency', 'Category', 'Paid By', 'Split Among', 'Date'],
      ...trip.expenses.map(expense => [
        expense.name,
        expense.amount.toFixed(2),
        expense.currency,
        expense.category,
        expense.paidBy,
        expense.splitAmong.join(', '),
        new Date(expense.date).toLocaleDateString()
      ])
    ]

    return csvData
  }

  const chartRef = useRef(null)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B']

  const expensesByCategory = trip?.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>) || {}

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!trip) {
    return <div className="flex justify-center items-center h-screen">Trip not found</div>
  }

  const totalExpenses = trip.expenses.reduce((sum, expense) => {
    const convertedAmount = convertCurrency(expense.amount, expense.currency, trip.budgetCurrency)
    return sum + convertedAmount
  }, 0)

  const remainingBudget = trip.budget ? trip.budget - totalExpenses : null

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {}
    trip.members.forEach(member => balances[member.name] = 0)

    trip.expenses.forEach(expense => {
      const convertedAmount = convertCurrency(expense.amount, expense.currency, trip.budgetCurrency)
      balances[expense.paidBy] += convertedAmount
      const splitAmount = convertedAmount / expense.splitAmong.length
      expense.splitAmong.forEach(member => {
        balances[member] -= splitAmount
      })
    })

    return balances
  }

  const balances = calculateBalances()

  const isOrganizer = currentUser?.role === 'organizer'

  const filteredExpenses = trip.expenses.filter(expense => {
    const categoryMatch = !filterCategory || expense.category === filterCategory
    const dateMatch = (!filterDateFrom || new Date(expense.date) >= new Date(filterDateFrom)) &&
                      (!filterDateTo || new Date(expense.date) <= new Date(filterDateTo))
    return categoryMatch && dateMatch
  })

  const topSpenders = Object.entries(balances)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const debtClearingSuggestions = () => {
    const sortedBalances = Object.entries(balances).sort(([, a], [, b]) => a - b)
    const suggestions: string[] = []

    let i = 0
    let j = sortedBalances.length - 1

    while (i < j) {
      const [debtor, debtAmount] = sortedBalances[i]
      const [creditor, creditAmount] = sortedBalances[j]

      if (Math.abs(debtAmount) < creditAmount) {
        suggestions.push(`${debtor} should pay ${trip.budgetCurrency} ${Math.abs(debtAmount).toFixed(2)} to ${creditor}`)
        sortedBalances[j] = [creditor, creditAmount + debtAmount]
        i++
      } else {
        suggestions.push(`${debtor} should pay ${trip.budgetCurrency} ${creditAmount.toFixed(2)} to ${creditor}`)
        sortedBalances[i] = [debtor, debtAmount + creditAmount]
        j--
      }
    }

    return suggestions
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <Button onClick={handleShare}>Share Trip</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="one-time" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-time">One-time Expense</TabsTrigger>
                <TabsTrigger value="recurring">Recurring Expense</TabsTrigger>
              </TabsList>
              <TabsContent value="one-time">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expenseName">Expense Name</Label>
                    <Input
                      id="expenseName"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      placeholder="Enter expense name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenseAmount">Amount</Label>
                    <Input
                      id="expenseAmount"
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenseCurrency">Currency</Label>
                    <Select onValueChange={setExpenseCurrency} value={expenseCurrency}>
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
                  <div>
                    <Label htmlFor="expenseCategory">Category</Label>
                    <Select onValueChange={setExpenseCategory} value={expenseCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {trip.expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                        {trip.members.map((member) => (
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
                        {trip.members.map((member) => (
                          <SelectItem key={member.name} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="splitAmongAllExceptPayer"
                      checked={splitAmongAllExceptPayer}
                      onCheckedChange={(checked) => {
                        setSplitAmongAllExceptPayer(checked as boolean)
                        if (checked) {
                          setSplitAmong(trip.members.filter(member => member.name !== paidBy).map(member => member.name))
                        }
                      }}
                    />
                    <Label htmlFor="splitAmongAllExceptPayer">Split among all except payer</Label>
                  </div>
                  <Button onClick={handleAddExpense}>Add Expense</Button>
                </div>
              </TabsContent>
              <TabsContent value="recurring">
                <RecurringExpenseForm
                  members={trip.members}
                  categories={trip.expenseCategories}
                  onAddRecurringExpense={handleAddRecurringExpense}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Budget: {trip.budget ? `${trip.budgetCurrency} ${trip.budget.toFixed(2)}` : 'Not set'}</p>
            <p>Total Expenses: {trip.budgetCurrency} {totalExpenses.toFixed(2)}</p>
            {remainingBudget !== null && (
              <p className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
                Remaining Budget: {trip.budgetCurrency} {remainingBudget.toFixed(2)}
              </p>
            )}
            <h3 className="text-lg font-semibold mt-4 mb-2">Individual Balances</h3>
            <ul>
              {Object.entries(balances).map(([member, balance]) => (
                <li key={member} className={balance < 0 ? 'text-red-500' : 'text-green-500'}>
                  {member}: {trip.budgetCurrency} {balance.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Spenders</CardTitle>
          </CardHeader>
          <CardContent>
            <ol>
              {topSpenders.map(([member, amount], index) => (
                <li key={member}>
                  {index + 1}. {member}: {trip.budgetCurrency} {amount.toFixed(2)}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Debt Clearing Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {debtClearingSuggestions().map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleChangeGroup} value={trip.group?.toString() ?? "no-group"}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-group">No Group</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Share Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <ShareTrip tripId={trip.id} />
          </CardContent>
        </Card>
        <ExpenseCategoryManager
          initialCategories={trip.expenseCategories}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart ref={chartRef}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={generatePDF}>Download PDF Report</Button>
        <CSVLink
          data={generateCSV()}
          filename={`${trip.name}_report.csv`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Download CSV Report
        </CSVLink>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor="filterCategory">Filter by Category</Label>
              <Select onValueChange={setFilterCategory} value={filterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {trip.expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4">
              <div>
                <Label htmlFor="filterDateFrom">From Date</Label>
                <Input
                  id="filterDateFrom"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="filterDateTo">To Date</Label>
                <Input
                  id="filterDateTo"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Tabs defaultValue="one-time" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="one-time">One-time Expenses</TabsTrigger>
              <TabsTrigger value="recurring">Recurring Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="one-time">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Split Among</TableHead>
                    <TableHead>Date</TableHead>
                    {isOrganizer && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.name}</TableCell>
                      <TableCell>{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{expense.currency}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.paidBy}</TableCell>
                      <TableCell>{expense.splitAmong.join(', ')}</TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      {isOrganizer && (
                        <TableCell>
                          <Button variant="destructive" onClick={() => handleDeleteExpense(expense.id)}>Delete</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="recurring">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Split Among</TableHead>
                    {isOrganizer && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trip.recurringExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.name}</TableCell>
                      <TableCell>{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{expense.currency}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.frequency}</TableCell>
                      <TableCell>{expense.paidBy}</TableCell>
                      <TableCell>{expense.splitAmong.join(', ')}</TableCell>
                      {isOrganizer && (
                        <TableCell>
                          <Button variant="destructive" onClick={() => handleDeleteRecurringExpense(expense.id)}>Delete</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

