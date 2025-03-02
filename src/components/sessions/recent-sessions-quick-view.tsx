import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { Button } from "~/components/ui/button"

interface QuickViewSession {
  id: string
  date: string
  stakes: string
  site: string
  duration: string
  profit: number
}

export function RecentSessionsQuickView() {
  // Mock data - would be fetched from your database in a real app
  const recentSessions: QuickViewSession[] = [
    {
      id: "1",
      date: "02/15/24",
      stakes: "5NL",
      site: "Bovada",
      duration: "2h 15m",
      profit: 22.5,
    },
    {
      id: "2",
      date: "02/13/24",
      stakes: "5NL",
      site: "Bovada",
      duration: "1h 45m",
      profit: -11.75,
    },
    {
      id: "3",
      date: "02/10/24",
      stakes: "10NL",
      site: "PokerStars",
      duration: "3h 30m",
      profit: 45.75,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSessions.map((session) => (
            <div key={session.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">
                  {session.date} - {session.stakes}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session.site} • {session.duration}
                </p>
              </div>
              <div className={`font-medium ${session.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                ${session.profit.toFixed(2)}
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/sessions/history">View All Sessions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

