"use client";

import React from "react";
import { Label, PieChart, Pie, Cell } from "recharts";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type OccupancyStats = {
  total: number;
  vacant: number;
  occupied: number;
};

interface OccupancyChartProps {
  data: OccupancyStats;
  MainLabel: string;
  SubLabel: string;
}

const OccupancyChart = ({ data, MainLabel, SubLabel }: OccupancyChartProps) => {
  const COLORS = ["#88BD23", "#E8ECEF"]; // Green (Occupied) and light gray (Vacant)

  // ✅ Automatically calculate occupancy rate
  const occupancyRate = data.total > 0 ? (data.occupied / data.total) * 100 : 0;

  const pieData = [
    { name: "Occupied", value: data.occupied },
    { name: "Vacant", value: data.vacant },
  ];

  const chartConfig = {
    occupied: {
      label: "Occupied",
      color: "#88BD23",
    },
    vacant: {
      label: "Vacant",
      color: "#E8ECEF",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      {/* Header */}
      <CardHeader className="flex items-center justify-between h-0">
        <CardTitle>{MainLabel}</CardTitle>
        <div className="text-sm text-primary cursor-pointer">Details</div>
      </CardHeader>
      <Separator />

      {/* Sub Header */}
      <CardHeader className="items-center h-0">
        <CardTitle>{SubLabel}</CardTitle>
      </CardHeader>

      {/* Chart + Stats */}
      <CardContent className="flex items-center justify-between gap-4 pb-0">
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
              data={pieData}
              dataKey="value"
              innerRadius={40}
              outerRadius={65}
              strokeWidth={5}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
              <Label
                position="center"
                className="text-md font-semibold fill-foreground"
              >
                {occupancyRate.toFixed(1)}%
              </Label>
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Summary Stats */}
        <div className="text-sm">
          <div className="flex flex-col  ">
            <div className="flex gap-3  justify-between">
              <p className="text-muted-foreground text-xs">Occupied</p>
              <p className=" font-semibold">{data.occupied}</p>
            </div>
            {/* <Separator orientation="vertical" className="h-8" /> */}
            <div className="flex gap-3 justify-between">
              <p className="text-muted-foreground text-xs">Vacant</p>
              <p className=" font-semibold">{data.vacant}</p>
            </div>
            {/* <Separator orientation="vertical" className="h-8" /> */}
            <div className="flex gap-3 justify-between">
              <p className="text-muted-foreground text-xs">Total</p>
              <p className=" font-semibold">{data.total}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;
