"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "../ui/separator";

// 1. Updated Data Structure to match the image's segmented timeline
const tenancyData = [
  {
    unitCount: 2, // Total units in this row
    timeframe: "In 7 Days", // Label for the row (Top label in the image)
    urgent: 1, // Units expiring very soon (Red)
    short: 1, // Units expiring shortly (Orange)
    mid: 0, // Units expiring later (Green/Gray) - not used in this top row
    long: 0,
  },
  {
    unitCount: 10,
    timeframe: "In 30 Days", // Just a category label, not an axis value
    urgent: 0,
    short: 0,
    mid: 10,
    long: 0,
  },
  {
    unitCount: 30,
    timeframe: "In 90 Days",
    urgent: 0.5, // Small urgent segment (Tiny red/orange dot)
    short: 0.5, // Small short segment
    mid: 29, // Large mid segment
    long: 0,
  },
  {
    unitCount: 23,
    timeframe: "In 180 Days",
    urgent: 0,
    short: 0,
    mid: 0,
    long: 23,
  },
];

// 2. Updated Chart Config with custom colors to match the image
const tenancyChartConfig = {
  // We'll define colors directly using HEX for better control over the visual
  // The 'unitCount' is the effective category, but we use the bar keys for config
  urgent: {
    label: "0-7 Days",
    color: "#D9534F", // Red for urgent
  },
  short: {
    label: "8-30 Days",
    color: "#F0AD4E", // Orange/Yellow for short
  },
  mid: {
    label: "31-90 Days",
    color: "var(--primary-foreground)", // Green/Gray for mid
  },
  long: {
    label: "90+ Days",
    color: "#6D948E", // A darker gray-green for long
  },
} satisfies ChartConfig;

// Component now takes no props, using internal data for the example
export function TenancyExpiryPipeline() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between h-0">
        <div>
          <CardTitle>Tenancy Expiry Pipeline</CardTitle>
        </div>
        <div className="text-sm text-primary cursor-pointer ">Details</div>
      </CardHeader>
      <Separator />
      {/* Label "In 7 Days" placed outside the chart for easier styling */}
      <div className="px-6 pt-2 text-sm font-medium text-muted-foreground">
        In 7 Days
      </div>

      <CardContent className="pt-2 pb-4">
        <ChartContainer
          config={tenancyChartConfig}
          className="min-h-[160px] h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={tenancyData}
            layout="vertical" // Correctly sets up a horizontal bar chart
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            {/* YAxis (Left): Shows the unit count (2, 10, 30, 23) */}
            <YAxis
              dataKey="unitCount"
              type="category" // Treat the numbers as categories (labels)
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              width={30}
              className="font-bold text-sm"
            />

            {/* XAxis (Bottom): Represents the pipeline days/values. Hide the numbers but keep the ticks/labels. */}
            <XAxis
              type="number"
              hide={true} // Hide the values (the numbers 0, 5, 10, etc.)
            />

            {/* Custom X-Axis to display the Day labels (1Day, 7Day, etc.) */}
            {/* NOTE: For simplicity, we are hardcoding a simple XAxis below. A true solution would use a custom tick component. */}
            {/* The image's X-Axis labels (1Day, 7Day, etc.) are complex to implement with Recharts out-of-the-box. 
                We'll place them below the chart using simple divs.
            */}

            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={
                <ChartTooltipContent
                  className="text-sm"
                  // indicator="none" // No indicator dot
                  labelFormatter={(label) => `Units: ${label}`} // Formats the unit count label
                />
              }
            />

            {/* STACKED BARS: Use stackId="a" for all to stack them on the same line */}

            {/* Red segment (Urgent) */}
            <Bar
              dataKey="urgent"
              stackId="a"
              fill="var(--color-urgent)"
              radius={[5, 0, 0, 5]} // Rounded only on the left side
              barSize={20} // Fixed height for bars
            />

            {/* Orange segment (Short) */}
            <Bar
              dataKey="short"
              stackId="a"
              fill="var(--color-short)"
              barSize={20}
            />

            {/* Green/Gray segment (Mid) */}
            <Bar
              dataKey="mid"
              stackId="a"
              fill="var(--color-mid)"
              barSize={20}
            />

            {/* Dark Green/Gray segment (Long) */}
            <Bar
              dataKey="long"
              stackId="a"
              fill="var(--color-long)"
              radius={[0, 5, 5, 0]} // Rounded only on the right side
              barSize={20}
            />
          </BarChart>
        </ChartContainer>

        {/* Custom Timeline Labels (Mimicking the X-Axis labels at the bottom) */}
        <div className="flex justify-between text-xs text-muted-foreground px-10 -mt-2">
          <span>1 Day</span>
          <span>7 Day</span>
          <span>3 Days</span>
          <span>3 Days</span>
          <span>5 Days</span>
          <span>2 Days</span>
          <span>6 Day</span>
        </div>
      </CardContent>
    </Card>
  );
}

// To call this, just render: <TenancyExpiryPipeline />
