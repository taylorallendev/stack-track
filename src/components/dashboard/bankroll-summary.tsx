import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

export function BankrollSummary() {
  // Mock data - would be fetched from your database in a real app
  const bankrollData = {
    currentBankroll: 1250.75,
    change: 125.5,
    isPositive: true,
    totalBuyIns: 2500,
    totalCashOuts: 3750.75,
    lifetimeProfit: 1250.75,
    totalHours: 120,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Bankroll Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">${bankrollData.currentBankroll.toFixed(2)}</span>
            <div
              className={`ml-4 flex items-center text-sm ${bankrollData.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {bankrollData.isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              ${bankrollData.change.toFixed(2)} (7 days)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Buy-ins</span>
              <span className="text-lg font-medium">${bankrollData.totalBuyIns.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Cash-outs</span>
              <span className="text-lg font-medium">${bankrollData.totalCashOuts.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Lifetime Profit</span>
              <span
                className={`text-lg font-medium ${bankrollData.lifetimeProfit >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                ${bankrollData.lifetimeProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Hours</span>
              <span className="text-lg font-medium">{bankrollData.totalHours}h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

