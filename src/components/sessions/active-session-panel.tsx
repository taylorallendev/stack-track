"use client"

import type React from "react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import type { SessionData } from "~/components/sessions/session-controls"
import { useState } from "react"

interface ActiveSessionPanelProps {
  sessionData: SessionData
  onAddRebuy: (amount: number) => void
  onEndSession: () => void
}

export function ActiveSessionPanel({ sessionData, onAddRebuy, onEndSession }: ActiveSessionPanelProps) {
  const [rebuyAmount, setRebuyAmount] = useState("25")
  const [isRebuyDialogOpen, setIsRebuyDialogOpen] = useState(false)

  const handleRebuySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddRebuy(Number.parseFloat(rebuyAmount))
    setIsRebuyDialogOpen(false)
  }

  const totalBuyIn = sessionData.buyIn + sessionData.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Stakes</p>
            <p className="font-medium">{sessionData.stakes}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Initial Buy-In</p>
            <p className="font-medium">${sessionData.buyIn.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Site/Location</p>
            <p className="font-medium">{sessionData.site}</p>
          </div>
        </div>

        {sessionData.rebuys.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Rebuys</p>
            <div className="space-y-1">
              {sessionData.rebuys.map((rebuy, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    Rebuy #{index + 1} at{" "}
                    {rebuy.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span>${rebuy.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Total Buy-In</span>
              <span className="font-medium">${totalBuyIn.toFixed(2)}</span>
            </div>
          </div>
        )}

        {sessionData.notes && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Session Notes</p>
            <p className="text-sm">{sessionData.notes}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Dialog open={isRebuyDialogOpen} onOpenChange={setIsRebuyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                Add Rebuy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleRebuySubmit}>
                <DialogHeader>
                  <DialogTitle>Add Rebuy</DialogTitle>
                  <DialogDescription>Enter the amount you want to add to your current session.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="rebuy-amount">Rebuy Amount ($)</Label>
                  <Input
                    id="rebuy-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={rebuyAmount}
                    onChange={(e) => setRebuyAmount(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsRebuyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Rebuy</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" className="flex-1" onClick={onEndSession}>
            End Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

