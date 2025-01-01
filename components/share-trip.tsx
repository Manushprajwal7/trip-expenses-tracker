"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { QRCodeSVG } from 'qrcode.react'

interface ShareTripProps {
  tripId: number
}

export function ShareTrip({ tripId }: ShareTripProps) {
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()
  const shareUrl = `${window.location.origin}/trips/${tripId}/join`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      })
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input value={shareUrl} readOnly />
        <Button onClick={handleCopyLink}>Copy</Button>
      </div>
      <Button onClick={() => setShowQR(!showQR)}>
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </Button>
      {showQR && (
        <div className="flex justify-center">
          <QRCodeSVG value={shareUrl} size={200} />
        </div>
      )}
    </div>
  )
}

