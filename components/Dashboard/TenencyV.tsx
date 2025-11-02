"use client";

import { Bar, BarChart, XAxis, YAxis, LabelList, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "../ui/separator";

type TenancyExpiryData = {
  in_7_days: number;
  in_14_days: number;
  in_30_days: number;
  in_60_days: number;
  in_90_days: number;
};

const tenancyChartConfig = {
  urgent: { label: "0-7 Days", color: "#D9534F" }, // red
  short: { label: "8-14 Days", color: "#F0AD4E" }, // orange
  mid: { label: "15-30 Days", color: "#5BC0DE" }, // blue
  long: { label: "31-60 Days", color: "#5CB85C" }, // green
  too_long: { label: "61-90 Days", color: "#6D948E" }, // gray-green
} satisfies ChartConfig;

interface Props {
  data: TenancyExpiryData;
}

export function TenancyExpiryPipeline({ data }: Props) {
  const total =
    data.in_7_days +
    data.in_14_days +
    data.in_30_days +
    data.in_60_days +
    data.in_90_days;

  const tenancyData = [
    { timeframe: "0-7 Days", value: data.in_7_days },
    { timeframe: "8-14 Days", value: data.in_14_days },
    { timeframe: "15-30 Days", value: data.in_30_days },
    { timeframe: "31-60 Days", value: data.in_60_days },
    { timeframe: "61-90 Days", value: data.in_90_days },
  ];

  const formatPercentage = (value: number) => {
    if (!total) return "";
    const percent = (value / total) * 100;
    return percent > 0 ? `${percent.toFixed(1)}%` : "";
  };
  const getColor = (value: number) => {
    if (!total) return "#ccc";
    const percent = (value / total) * 100;
    if (percent < 10) return "#D9534F"; // 🔴 red
    if (percent < 30) return "#F0AD4E"; // 🟠 orange
    if (percent < 50) return "#007BFF"; // 🔵 blue
    return "#88bd23"; // 🟢 green
  };
  return (
    <Card className="w-full py-0 gap-3">
      <CardHeader className="flex items-center justify-between mt-4">
        <CardTitle className="h-full">Tenancy Expiry Pipeline</CardTitle>
        <div className="text-sm text-primary cursor-pointer">Details</div>
      </CardHeader>
      <Separator />

      <CardContent>
        <ChartContainer
          config={tenancyChartConfig}
          className="min-h-[150px] h-[220px] w-full"
        >
          <BarChart
            data={tenancyData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <YAxis
              dataKey="timeframe"
              type="category"
              tickLine={false}
              axisLine={false}
              className="font-medium text-sm"
            />
            <XAxis type="number" hide />

            <Bar dataKey="value" barSize={25}>
              <LabelList
                dataKey="value"
                position="inside"
                formatter={(v: number) => formatPercentage(v)}
                className="fill-white text-xs font-semibold"
              />
              {tenancyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
