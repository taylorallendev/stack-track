"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "~/lib/utils";

interface DateRangeSelectorProps {
  dateRange: [Date | null, Date | null];
  setDateRange: (dateRange: [Date | null, Date | null]) => void;
}

export function DateRangeSelector({
  dateRange,
  setDateRange,
}: DateRangeSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setDateRange([start, end]);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !dateRange[0] && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange[0] && dateRange[1] ? (
              `${format(dateRange[0], "LLL dd, y")} - ${format(dateRange[1], "LLL dd, y")}`
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange[0] ?? undefined}
            selected={{
              from: dateRange[0] ?? undefined,
              to: dateRange[1] ?? undefined,
            }}
            onSelect={(range) => {
              setDateRange([range?.from ?? null, range?.to ?? null]);
              if (range?.to) setIsCalendarOpen(false);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(7)}
        >
          Last 7 days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(30)}
        >
          Last 30 days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(90)}
        >
          Last 90 days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(365)}
        >
          Year to date
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDateRange([null, null])}
        >
          All time
        </Button>
      </div>
    </div>
  );
}
