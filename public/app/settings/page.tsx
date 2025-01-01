"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GroupManager } from '@/components/group-manager'
import { CurrencyManager } from '@/components/currency-manager'
import { Group, ExchangeRate } from '@/types/trip'

export default function SettingsPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [currency, setCurrency] = useState('₹')
  const [groups, setGroups] = useState<Group[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]')
    setCategories(storedCategories)
    const storedCurrency = localStorage.getItem('currency') || '₹'
    setCurrency(storedCurrency)
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]')
    setGroups(storedGroups)
    const storedExchangeRates = JSON.parse(localStorage.getItem('exchangeRates') || '[]')
    setExchangeRates(storedExchangeRates)
  }, [])

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      localStorage.setItem('categories', JSON.stringify(updatedCategories))
      setNewCategory('')
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } else {
      toast({
        title: "Error",
        description: "Category already exists or is empty",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = (category: string) => {
    const updatedCategories = categories.filter(c => c !== category)
    setCategories(updatedCategories)
    localStorage.setItem('categories', JSON.stringify(updatedCategories))
    toast({
      title: "Success",
      description: "Category deleted successfully",
    })
  }

  const handleClearAllData = () => {
    localStorage.clear()
    toast({
      title: "Success",
      description: "All data has been cleared",
    })
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
    toast({
      title: "Success",
      description: "Currency updated successfully",
    })
  }

  const handleGroupsChange = (updatedGroups: Group[]) => {
    setGroups(updatedGroups)
  }

  const handleExchangeRatesChange = (updatedRates: ExchangeRate[]) => {
    setExchangeRates(updatedRates)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
              />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category} className="flex justify-between items-center">
                  <span>{category}</span>
                  <Button variant="destructive" onClick={() => handleDeleteCategory(category)}>Delete</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Select Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button
                variant={currency === '₹' ? 'default' : 'outline'}
                onClick={() => handleCurrencyChange('₹')}
              >
                ₹ (INR)
              </Button>
              <Button
                variant={currency === '$' ? 'default' : 'outline'}
                onClick={() => handleCurrencyChange('$')}
              >
                $ (USD)
              </Button>
              <Button
                variant={currency === '€' ? 'default' : 'outline'}
                onClick={() => handleCurrencyChange('€')}
              >
                € (EUR)
              </Button>
            </div>
          </CardContent>
        </Card>
        <CurrencyManager onExchangeRatesChange={handleExchangeRatesChange} />
        <GroupManager onGroupsChange={handleGroupsChange} />
        <Card>
          <CardHeader>
            <CardTitle>Clear All Data</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear All Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your trips, categories, and expense data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllData}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

