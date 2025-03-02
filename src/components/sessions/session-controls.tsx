"use client"

import { useState } from "react"
import { StartSessionPanel } from "~/components/sessions/start-session-panel"
import { ActiveSessionPanel } from "~/components/sessions/active-session-panel"
import { EndSessionForm } from "~/components/sessions/end-session-form"
import { RecentSessionsQuickView } from "~/components/sessions/recent-sessions-quick-view"
import { SessionHistoryAccess } from "~/components/sessions/session-history-access"
import { SessionStatusIndicator } from "~/components/sessions/session-status-indicator"

export type SessionState = "inactive" | "active" | "ending"

export interface SessionData {
  id?: string
  stakes: string
  buyIn: number
  site: string
  notes: string
  startTime: Date
  endTime?: Date
  duration?: string
  rebuys: Array<{ amount: number; timestamp: Date }>
  cashOut?: number
  profit?: number
  hourlyRate?: number
}

export function SessionControls() {
  const [sessionState, setSessionState] = useState<SessionState>("inactive")
  const [sessionData, setSessionData] = useState<SessionData>({
    stakes: "5NL",
    buyIn: 50,
    site: "Bovada",
    notes: "",
    startTime: new Date(),
    rebuys: [],
  })

  const handleStartSession = (data: Partial<SessionData>) => {
    setSessionData({
      ...sessionData,
      ...data,
      startTime: new Date(),
      rebuys: [],
    })
    setSessionState("active")
  }

  const handleAddRebuy = (amount: number) => {
    setSessionData({
      ...sessionData,
      rebuys: [...sessionData.rebuys, { amount, timestamp: new Date() }],
    })
  }

  const handleEndSession = () => {
    setSessionState("ending")
  }

  const handleCancelEndSession = () => {
    setSessionState("active")
  }

  const handleFinalizeSession = (data: { cashOut: number; notes: string }) => {
    const endTime = new Date()
    const durationMs = endTime.getTime() - sessionData.startTime.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)

    const totalBuyIn = sessionData.buyIn + sessionData.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0)

    const profit = data.cashOut - totalBuyIn
    const hourlyRate = profit / durationHours

    // Format duration as "Xh Ym"
    const hours = Math.floor(durationHours)
    const minutes = Math.floor((durationHours - hours) * 60)
    const duration = `${hours}h ${minutes}m`

    const finalSessionData = {
      ...sessionData,
      endTime,
      duration,
      cashOut: data.cashOut,
      profit,
      hourlyRate,
      notes: data.notes,
    }

    // Here you would typically save the session data to your database
    console.log("Session finalized:", finalSessionData)

    // Reset the session state
    setSessionState("inactive")
    setSessionData({
      stakes: "5NL",
      buyIn: 50,
      site: "Bovada",
      notes: "",
      startTime: new Date(),
      rebuys: [],
    })
  }

  return (
    <div className="space-y-6">
      <SessionStatusIndicator
        sessionState={sessionState}
        startTime={sessionState === "active" || sessionState === "ending" ? sessionData.startTime : undefined}
      />

      {sessionState === "inactive" && <StartSessionPanel onStartSession={handleStartSession} />}

      {sessionState === "active" && (
        <ActiveSessionPanel sessionData={sessionData} onAddRebuy={handleAddRebuy} onEndSession={handleEndSession} />
      )}

      {sessionState === "ending" && (
        <EndSessionForm sessionData={sessionData} onCancel={handleCancelEndSession} onSubmit={handleFinalizeSession} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <RecentSessionsQuickView />
        <SessionHistoryAccess />
      </div>
    </div>
  )
}

