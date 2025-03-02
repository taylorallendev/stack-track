import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { PlusCircle, MinusCircle, Target } from "lucide-react"

export function ActionButtons() {
  return (
    <div className="space-y-4">
      <Button size="lg" className="w-full md:w-auto" asChild>
        <Link href="/sessions/new">Start Session</Link>
      </Button>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Deposit
            </Button>
            <Button variant="outline" size="sm">
              <MinusCircle className="mr-2 h-4 w-4" />
              Record Withdrawal
            </Button>
            <Button variant="outline" size="sm">
              <Target className="mr-2 h-4 w-4" />
              View Goals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

