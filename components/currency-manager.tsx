import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

interface CurrencyManagerProps {
  onExchangeRatesChange: (rates: ExchangeRate[]) => void;
}

export function CurrencyManager({ onExchangeRatesChange }: CurrencyManagerProps) {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [rate, setRate] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedRates = JSON.parse(localStorage.getItem('exchangeRates') || '[]')
    setExchangeRates(storedRates)
  }, [])

  const handleAddExchangeRate = () => {
    if (!fromCurrency || !toCurrency || !rate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newRate: ExchangeRate = {
      from: fromCurrency,
      to: toCurrency,
      rate: parseFloat(rate),
    }

    const updatedRates = [...exchangeRates, newRate]
    setExchangeRates(updatedRates)
    localStorage.setItem('exchangeRates', JSON.stringify(updatedRates))
    onExchangeRatesChange(updatedRates)

    setFromCurrency('')
    setToCurrency('')
    setRate('')

    toast({
      title: "Success",
      description: "Exchange rate added successfully",
    })
  }

  const handleDeleteExchangeRate = (index: number) => {
    const updatedRates = exchangeRates.filter((_, i) => i !== index)
    setExchangeRates(updatedRates)
    localStorage.setItem('exchangeRates', JSON.stringify(updatedRates))
    onExchangeRatesChange(updatedRates)

    toast({
      title: "Success",
      description: "Exchange rate deleted successfully",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Exchange Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fromCurrency">From Currency</Label>
              <Input
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                placeholder="e.g., USD"
              />
            </div>
            <div>
              <Label htmlFor="toCurrency">To Currency</Label>
              <Input
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                placeholder="e.g., EUR"
              />
            </div>
            <div>
              <Label htmlFor="rate">Exchange Rate</Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g., 0.85"
              />
            </div>
          </div>
          <Button onClick={handleAddExchangeRate}>Add Exchange Rate</Button>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exchangeRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>{rate.from}</TableCell>
                <TableCell>{rate.to}</TableCell>
                <TableCell>{rate.rate}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteExchangeRate(index)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

