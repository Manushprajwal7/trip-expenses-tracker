import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExpenseCategoryManagerProps {
  initialCategories: string[]
  onCategoriesChange: (categories: string[]) => void
}

export function ExpenseCategoryManager({ initialCategories, onCategoriesChange }: ExpenseCategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [newCategory, setNewCategory] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      onCategoriesChange(updatedCategories)
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
    onCategoriesChange(updatedCategories)
    toast({
      title: "Success",
      description: "Category deleted successfully",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex justify-between items-center">
                <span>{category}</span>
                <Button variant="destructive" onClick={() => handleDeleteCategory(category)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

