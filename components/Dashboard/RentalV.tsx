"use client";
import React from "react";
import {
  Label,
  PieChart,
  Pie,
  Cell,
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
} from "recharts";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Badge } from "../ui/badge";

type OccupancyChartProps = {
  occupancyRate: number; // e.g. 95.6
  MainLabel: string;
  SubLabel: string;
};

const RentalV = ({
  occupancyRate,
  MainLabel,
  SubLabel,
}: OccupancyChartProps) => {
  const COLORS = ["#88BD23", "#E8ECEF"]; // green and light gray
  const data = [
    { name: "Occupied", value: occupancyRate },
    { name: "Vacant", value: 100 - occupancyRate },
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
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const totalUnits = 20;
  const unitChange = 0.21;
  const formattedTotalUnits = (totalUnits / 1000).toFixed(2) + "k";
  const formattedUnitChange = Math.abs(unitChange * 100).toFixed(0) + "%";
  const changeDirection = unitChange >= 0 ? "up" : "down";
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center justify-between h-0">
        <div>
          <CardTitle>{MainLabel}</CardTitle>
        </div>
        <div className="text-sm text-primary cursor-pointer">Details</div>
      </CardHeader>
      <Separator />
      <CardHeader className="items-center pb-0">
        <CardTitle>{SubLabel}</CardTitle>
        {/* <CardDescription>{data}</CardDescription> */}
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-5  pb-0">
        {/* Donut Chart */}

        {/* Center Text */}

        <div className="flex h-5 items-center space-x-4 text-sm">
          {/* <Separator orientation="vertical" /> */}
          <div>
            <p>30</p>
            <p>Today</p>
          </div>
          <Separator orientation="vertical" />
          <div>
            <p>10</p>
            <p>Vacant</p>
          </div>
          <Separator orientation="vertical" />
          <div className="flex-1 text-right">
            <div className="text-md font-bold flex items-center justify-end">
              {formattedTotalUnits}
              {/* Change Badge */}
              <Badge
                className={`ml-2 text-xs font-medium ${
                  changeDirection === "up"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-100 text-red-700 hover:bg-red-100"
                }`}
              >
                {unitChange >= 0 ? "▲" : "▼"} {formattedUnitChange}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Total Units</p>
          </div>
        </div>
        {/* <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
              <Separator orientation="vertical" />
              <div>
                <p>10 </p>
                <p>in 2 Days</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p>20</p>
                <p>in 3 Days</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p>3</p>
                <p>in 5 Days</p>
              </div>
            </div> */}

        <ChartContainer config={chartConfig} className="w-[300px] h-[200px] ">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="desktop"
              fill="var(--primary-foreground)"
              radius={4}
            />
            <Bar dataKey="mobile" fill="var(--primary-foreground)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RentalV;
