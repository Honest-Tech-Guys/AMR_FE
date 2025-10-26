"use client";
import React from "react";
import { Label, PieChart, Pie, Cell } from "recharts";
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

type OccupancyChartProps = {
  occupancyRate: number; // e.g. 95.6
  MainLabel: string;
  SubLabel: string;
};

const OccupancyChart = ({
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
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center justify-between h-0 ">
        <div>
          <CardTitle>{MainLabel}</CardTitle>
        </div>
        <div className="text-sm text-primary cursor-pointer">Details</div>
      </CardHeader>
      <Separator />
      <CardHeader className="items-center  h-0">
        <CardTitle>{SubLabel}</CardTitle>
        {/* <CardDescription>{data}</CardDescription> */}
      </CardHeader>

      <CardContent className="flex items-center  pb-0">
        {/* Donut Chart */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto flex-1 aspect-square max-h-[150px]"
        >
          <PieChart width={150} height={150}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              // innerRadius={50}
              // outerRadius={65}
              dataKey="value"
              innerRadius={40}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
              <Label
                position="center"
                className="text-md font-semibold fill-foreground "
              >
                {occupancyRate.toFixed(1)}%
              </Label>
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Center Text */}

        <div>
          <div>
            <div className="flex h-5 items-center space-x-4 text-sm">
              <Separator orientation="vertical" />
              <div>
                <p>30</p>
                <p>Occupied</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p>10</p>
                <p>Vacant</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p>20</p>
                <p>Total Units</p>
              </div>
            </div>
            <Separator className="my-4" />
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;
