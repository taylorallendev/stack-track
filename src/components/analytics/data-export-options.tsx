import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Download, FileSpreadsheet, FileImage } from "lucide-react"

export function DataExportOptions() {
  const handleExport = (format: string) => {
    // Implement export logic here
    console.log(`Exporting data as ${format}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button variant="outline" onClick={() => handleExport("CSV")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("PDF")}>
            <Download className="mr-2 h-4 w-4" />
            Export as PDF Report
          </Button>
          <Button variant="outline" onClick={() => handleExport("PNG")}>
            <FileImage className="mr-2 h-4 w-4" />
            Export Charts as PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

