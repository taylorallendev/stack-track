"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  previousValue?: number
  prefix?: string
  suffix?: string
  trend?: "up" | "down" | "neutral"
  loading?: boolean
  formatter?: (value: number) => string
  trendFormatter?: (value: number) => string
  description?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  previousValue,
  prefix = "",
  suffix = "",
  trend,
  loading = false,
  formatter = (val) => val.toString(),
  trendFormatter = (val) => val.toFixed(2),
  description,
  className,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  
  // Calculate trend percentage
  const trendPercentage = previousValue !== undefined && previousValue !== 0
    ? ((value - previousValue) / Math.abs(previousValue)) * 100
    : 0
  
  // Animate the value
  useEffect(() => {
    if (loading) return
    
    const duration = 1000 // ms
    const steps = 20
    const stepTime = duration / steps
    const increment = (value - displayValue) / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(prev => prev + increment)
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [value, displayValue, loading])
  
  // Determine trend color and icon
  const trendColor = !trend 
    ? "text-muted-foreground"
    : trend === "up" 
      ? "text-green-500 dark:text-green-400" 
      : trend === "down" 
        ? "text-red-500 dark:text-red-400"
        : "text-muted-foreground"
  
  const trendIcon = !trend
    ? null
    : trend === "up"
      ? "↑"
      : trend === "down"
        ? "↓"
        : null
  
  return (
    <Card className={cn(className)}>
      <CardHeader className="py-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {prefix}{formatter(displayValue)}{suffix}
            </div>
            
            {(previousValue !== undefined || description) && (
              <p className="text-xs text-muted-foreground">
                {previousValue !== undefined && (
                  <span className={cn("mr-1", trendColor)}>
                    {trendIcon} {trendFormatter(Math.abs(trendPercentage))}%
                  </span>
                )}
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}