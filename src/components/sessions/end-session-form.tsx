"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import type { SessionData } from "~/components/sessions/session-controls"
import { formatDuration } from "~/lib/format-duration"

interface EndSessionFormProps {
  sessionData: SessionData
  onCancel: () => void
  onSubmit: (data: { cashOut: number; notes: string }) => void
}

export function EndSessionForm({ sessionData, onCancel, onSubmit }: EndSessionFormProps) {
  const [cashOut, setCashOut] = useState("")
  const [notes, setNotes] = useState(sessionData.notes || "")

  const totalBuyIn = sessionData.buyIn + sessionData.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0)

  const cashOutValue = Number.parseFloat(cashOut) || 0
  const profit = cashOutValue - totalBuyIn

  const now = new Date()
  const durationMs = now.getTime() - sessionData.startTime.getTime()
  const durationHours = durationMs / (1000 * 60 * 60)
  const hourlyRate = profit / durationHours

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      cashOut: cashOutValue,
      notes,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>End Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cash-out">Cash Out Amount ($)</Label>
              <Input
                id="cash-out"
                type="number"
                min="0"
                step="0.01"
                value={cashOut}
                onChange={(e) => setCashOut(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="font-medium">{formatDuration(durationMs, true)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Buy-In</p>
                <p className="font-medium">${totalBuyIn.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Profit/Loss</p>
                <p className={`font-medium ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>${profit.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className={`font-medium ${hourlyRate >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${hourlyRate.toFixed(2)}/hr
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-notes">Session Notes</Label>
              <Textarea
                id="session-notes"
                placeholder="Record thoughts, strategies, or mistakes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Session
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

