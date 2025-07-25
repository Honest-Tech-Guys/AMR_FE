"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export const description = "A donut chart with text";

const chartData = [
  { browser: "paid", visitors: 275, fill: "#63DAAB" },
  { browser: "unpaid", visitors: 200, fill: "#EFF2F5" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface Props {
  chartData: { browser: string; visitors: number; fill: string }[];
  MainLabel: string;
  SubLabel: string;
  DetailsLink: string;
  data: string;
  labelCenter: string;
}
export function ChartPieDonutText({
  chartData,
  DetailsLink,
  labelCenter,
  MainLabel,
  SubLabel,
  data,
}: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center justify-between pb-0">
        <div>
          <CardTitle>{MainLabel}</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground">Details</div>
      </CardHeader>
      <Separator />
      <CardHeader className="items-center pb-0">
        <CardTitle>{SubLabel}</CardTitle>
        <CardDescription>{data}</CardDescription>
      </CardHeader>

      <CardContent className="flex items-center  pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto flex-1 aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                position="center"
                className="text-md font-semibold fill-foreground "
              >
                {labelCenter}
              </Label>
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex-col justify-center gap-4 mt-2 text-sm">
          {chartData.map((item) => (
            <div className="flex items-center gap-2">
              <span
                className={cn(`inline-block rounded-full w-4 h-4 `)}
                style={{ backgroundColor: item.fill }}
              />
              <span>{item.browser}</span>
              <span>MYR {item.visitors}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
