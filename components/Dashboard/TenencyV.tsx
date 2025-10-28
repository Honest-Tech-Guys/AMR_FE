"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "../ui/separator";

type TenancyExpiryData = {
  in_2_days: number;
  in_7_days: number;
  in_14_days: number;
  in_30_days: number;
  in_60_days: number;
};

const tenancyChartConfig = {
  urgent: {
    label: "0-7 Days",
    color: "#D9534F",
  },
  short: {
    label: "8-30 Days",
    color: "#F0AD4E",
  },
  mid: {
    label: "31-90 Days",
    color: "var(--primary-foreground)",
  },
  long: {
    label: "90+ Days",
    color: "#6D948E",
  },
} satisfies ChartConfig;

interface Props {
  data: TenancyExpiryData;
}

export function TenancyExpiryPipeline({ data }: Props) {
  // ✅ Transform the incoming data into chart-friendly format
  const tenancyData = [
    {
      timeframe: "In 2 Days",
      count: data.in_2_days,
      urgent: data.in_2_days,
      short: 0,
      mid: 0,
      long: 0,
    },
    {
      timeframe: "In 7 Days",
      count: data.in_7_days,
      urgent: 0,
      short: data.in_7_days,
      mid: 0,
      long: 0,
    },
    {
      timeframe: "In 14 Days",
      count: data.in_14_days,
      urgent: 0,
      short: data.in_14_days,
      mid: 0,
      long: 0,
    },
    {
      timeframe: "In 30 Days",
      count: data.in_30_days,
      urgent: 0,
      short: 0,
      mid: data.in_30_days,
      long: 0,
    },
    {
      timeframe: "In 60 Days",
      count: data.in_60_days,
      urgent: 0,
      short: 0,
      mid: 0,
      long: data.in_60_days,
    },
  ];

  return (
    <Card className="w-full py-0 gap-3">
      <CardHeader className="flex items-center justify-between mt-4  ">
        <CardTitle className="h-full">Tenancy Expiry Pipeline</CardTitle>
        <div className="text-sm text-primary cursor-pointer">Details</div>
      </CardHeader>
      <Separator />

      <CardContent className=" ">
        <ChartContainer
          config={tenancyChartConfig}
          className="min-h-[160px] h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={tenancyData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <YAxis
              dataKey="timeframe"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              width={80}
              className="font-medium text-sm"
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={
                <ChartTooltipContent
                  className="text-sm"
                  labelFormatter={(label) => `${label}`}
                />
              }
            />
            <Bar
              dataKey="urgent"
              stackId="a"
              fill="#D9534F"
              barSize={20}
              radius={[5, 0, 0, 5]}
            />
            <Bar dataKey="short" stackId="a" fill="#F0AD4E" barSize={20} />
            <Bar
              dataKey="mid"
              stackId="a"
              fill="var(--primary-foreground)"
              barSize={20}
            />
            <Bar
              dataKey="long"
              stackId="a"
              fill="#6D948E"
              barSize={20}
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
