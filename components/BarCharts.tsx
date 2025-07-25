"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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

export const description = "A bar chart with a custom label";

const chartData = [
  { type: "Auto Collection", cost: 1650000, costInBar: "RM 1650000" },
  { type: "Online Payment", cost: 210627000, costInBar: "RM 210627000" },
  { type: "Manual Payment", cost: 147580000, costInBar: "RM 147580000" },
];

const chartConfig = {
  cost: {
    label: "cost",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function ChartBarLabelCustom() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex items-center justify-between pb-0">
          <div>
            <CardTitle>Tenancy</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">Details</div>
        </CardHeader>
        <Separator />
        <CardHeader className="items-center pb-0">
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>May 2025</CardDescription>
        </CardHeader>
        <div className="flex justify-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-7 h-3 bg-[#63DAAB]`} />
            MYR
          </div>
        </div>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="type" />
              <YAxis dataKey="cost" type="number" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="cost" fill="var(--color-cost)">
                {" "}
                <LabelList
                  dataKey="costInBar"
                  offset={8}
                  className="fill-(--color-label) font-semibold"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
