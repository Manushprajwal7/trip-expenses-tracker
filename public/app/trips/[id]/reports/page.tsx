"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { Trip, Expense } from '@/types/trip'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4CAF50', '#9C27B0', '#FF9800', '#795548'];

export default function ReportsPage() {
  const { id } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]')
    const currentTrip = trips.find((t: Trip) => t.id === Number(id))
    setTrip(currentTrip)
  }, [id])

  if (!trip) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  const expensesByCategory = trip.expenses.reduce((acc: { [key: string]: number }, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))

  const expensesByMember = trip.members.reduce((acc: { [key: string]: number }, member) => {
    acc[member.name] = trip.expenses
      .filter(expense => expense.paidBy === member.name)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return acc
  }, {})

  const barChartData = Object.entries(expensesByMember).map(([name, amount]) => ({ name, amount }))

  const expensesByDate = trip.expenses.reduce((acc: { [key: string]: number }, expense) => {
    const date = new Date(expense.date).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + expense.amount
    return acc
  }, {})

  const lineChartData = Object.entries(expensesByDate)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, amount]) => ({ date, amount }))

  const generatePDF = () => {
    // Implement PDF generation logic here
    console.log('Generating PDF...')
    toast({
      title: "Info",
      description: "PDF generation is not implemented yet.",
    })
  }

  const generateCSV = () => {
    // Implement CSV generation logic here
    console.log('Generating CSV...')
    toast({
      title: "Info",
      description: "CSV generation is not implemented yet.",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports for {trip.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Member</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={generatePDF}>Download PDF Report</Button>
        <Button onClick={generateCSV}>Download CSV Report</Button>
      </div>
    </div>
  )
}

