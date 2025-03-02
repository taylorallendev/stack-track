import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RefreshCw } from "lucide-react";

interface InsightsPanelProps {
  dateRange: [Date | null, Date | null];
}

export function InsightsPanel({}: InsightsPanelProps) {
  // Mock function to generate insights - replace with actual logic
  const generateInsights = () => {
    return [
      "Your most profitable day is Tuesday",
      "Sessions longer than 3 hours have a 15% higher win rate",
      "Your win rate has improved 23% over the last month",
    ];
  };

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Insights</CardTitle>
        <Button variant="ghost" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="text-sm">
              • {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
