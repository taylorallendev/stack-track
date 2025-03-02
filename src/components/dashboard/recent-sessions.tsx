import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { ExternalLink } from "lucide-react"

interface Session {
  id: string
  date: string
  stakes: string
  site: string
  duration: string
  buyIn: number
  cashOut: number
  profit: number
}

export function RecentSessions() {
  // Mock data - would be fetched from your database in a real app
  const sessions: Session[] = [
    {
      id: "1",
      date: "02/15/24",
      stakes: "5NL",
      site: "Bovada",
      duration: "2h 15m",
      buyIn: 50,
      cashOut: 72.5,
      profit: 22.5,
    },
    {
      id: "2",
      date: "02/13/24",
      stakes: "5NL",
      site: "Bovada",
      duration: "1h 45m",
      buyIn: 50,
      cashOut: 38.25,
      profit: -11.75,
    },
    {
      id: "3",
      date: "02/10/24",
      stakes: "10NL",
      site: "PokerStars",
      duration: "3h 30m",
      buyIn: 100,
      cashOut: 145.75,
      profit: 45.75,
    },
    {
      id: "4",
      date: "02/08/24",
      stakes: "5NL",
      site: "Bovada",
      duration: "2h 00m",
      buyIn: 50,
      cashOut: 62.25,
      profit: 12.25,
    },
    {
      id: "5",
      date: "02/05/24",
      stakes: "5NL",
      site: "Bovada",
      duration: "1h 30m",
      buyIn: 50,
      cashOut: 43.5,
      profit: -6.5,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Stakes</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Buy-in</TableHead>
                <TableHead>Cash-out</TableHead>
                <TableHead>Profit/Loss</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.stakes}</TableCell>
                  <TableCell>{session.site}</TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>${session.buyIn.toFixed(2)}</TableCell>
                  <TableCell>${session.cashOut.toFixed(2)}</TableCell>
                  <TableCell className={session.profit >= 0 ? "text-green-500" : "text-red-500"}>
                    ${session.profit.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/sessions/${session.id}`}>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" asChild>
            <Link href="/sessions">View All Sessions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

