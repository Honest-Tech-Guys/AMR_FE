"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

/**
 * DateRangePicker with two responsive calendars + scrollable popover
 */

type DateRange = {
  from: Date | undefined | null;
  to: Date | undefined | null;
};

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(() => ({
    from: value?.from ?? null,
    to: value?.to ?? null,
  }));

  React.useEffect(() => {
    if (value) setRange({ from: value.from ?? null, to: value.to ?? null });
  }, [value]);

  function handleFromSelect(date: Date | undefined) {
    const next = { from: date ?? null, to: range.to };
    setRange(next);
    onChange?.(next);
  }

  function handleToSelect(date: Date | undefined) {
    const next = { from: range.from, to: date ?? null };
    setRange(next);
    onChange?.(next);
  }

  function formatRange(r: DateRange) {
    if (!r.from && !r.to) return placeholder;
    if (r.from && !r.to) return `From ${format(r.from, "MMM d, yyyy")}`;
    if (r.from && r.to)
      return `${format(r.from, "MMM d, yyyy")} — ${format(
        r.to,
        "MMM d, yyyy"
      )}`;
    return placeholder;
  }

  function clear() {
    const next = { from: null, to: null };
    setRange(next);
    onChange?.(next);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start bg-gray-100 rounded-[6px] font-normal ${className}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span
            className={`truncate ${
              !range.from && !range.to ? "text-muted-foreground" : ""
            }`}
          >
            {formatRange(range)}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full max-w-[600px] p-0">
        {/* Scrollable container */}
        <div className="max-h-[90vh] overflow-y-scroll p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">From</p>
              <Calendar
                mode="single"
                selected={range.from ?? undefined}
                onSelect={handleFromSelect}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">To</p>
              <Calendar
                mode="single"
                selected={range.to ?? undefined}
                onSelect={handleToSelect}
              />
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {range.from ? format(range.from, "PPP") : "--"} —{" "}
              {range.to ? format(range.to, "PPP") : "--"}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={clear}>
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setOpen(false)}
                className="text-white"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
