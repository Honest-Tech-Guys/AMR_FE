"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Home, Users, Grid, BedDouble, LoaderCircle } from "lucide-react";
import useGetDashboard from "@/lib/services/hooks/useGetDashboard";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const COLORS = ["#22c55e", "#3b82f6", "#e5e7eb"];

export default function DashboardPage() {
  const { data, isPending } = useGetDashboard();
  const router = useRouter();
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  const dashboard = data as Dashboard;

  // ✅ Stats section
  const stats = [
    {
      title: "Active Tenancies",
      value: dashboard.top_stats.active_tenancies,
      icon: Users,
    },
    { title: "Properties", value: dashboard.top_stats.properties, icon: Home },
    { title: "Units", value: dashboard.top_stats.units, icon: Grid },
    { title: "Rooms", value: dashboard.top_stats.rooms, icon: BedDouble },
  ];

  // ✅ Occupancy Overview data
  const fully_occupied = dashboard.rentable_space.fully_occupied;
  const partial_occupied = dashboard.rentable_space.partial_occupied;
  const vacant = dashboard.rentable_space.vacant;
  const total = dashboard.rentable_space.total || 1;
  const occupiedPercent = (
    ((fully_occupied + partial_occupied) / total) *
    100
  ).toFixed(1);

  const occupancyData = [
    { name: "Fully_Occupied", value: fully_occupied },
    { name: "Partial_Occupied", value: partial_occupied },
    { name: "Vacant", value: vacant },
  ];

  // ✅ Tenancy expiry pipeline (convert to % of total)
  const totalExpiry =
    dashboard.tenancy_expiry.in_7_days + dashboard.tenancy_expiry.in_14_days;

  function calculatePercentages(data: Record<string, number>) {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    if (total === 0) {
      // Avoid division by zero — return all 0%
      return Object.fromEntries(Object.keys(data).map((key) => [key, 0]));
    }

    const percentages = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, (value / total) * 100])
    );

    return percentages;
  }
  const tenancyDataPercentage = calculatePercentages(dashboard.tenancy_expiry);
  const tenancyData = [
    {
      label: "in 7 Days",
      value: dashboard.tenancy_expiry.in_7_days,
      percentage: tenancyDataPercentage.in_7_days,
      color: "bg-orange-400",
    },
    {
      label: "in 14 Days",
      value: dashboard.tenancy_expiry.in_14_days,
      percentage: tenancyDataPercentage.in_14_days,
      color: "bg-green-500",
    },
    {
      label: "in 30 Days",
      value: dashboard.tenancy_expiry.in_30_days,
      percentage: tenancyDataPercentage.in_30_days,
      color: "bg-blue-500",
    },
    {
      label: "in 60 Days",
      value: dashboard.tenancy_expiry.in_60_days,
      percentage: tenancyDataPercentage.in_60_days,
      color: "bg-purple-500",
    },
    {
      label: "in 90 Days",
      value: dashboard.tenancy_expiry.in_90_days,
      percentage: tenancyDataPercentage.in_90_days,
      color: "bg-gray-500",
    },
  ];

  // ✅ Rental Collection & Payment Status
  const { paid, unpaid } = dashboard.pie_charts.rental_collection;
  const {
    paid: paidStatus,
    unpaid: unpaidStatus,
    overdue,
  } = dashboard.pie_charts.payment_status;

  const month = dashboard.pie_charts.month;

  const paidPercent =
    paidStatus + unpaidStatus + parseFloat(overdue) > 0
      ? (
          (paidStatus / (paidStatus + unpaidStatus + parseFloat(overdue))) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8">
      {/* Header */}
      {/* <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Property Management Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor your properties, tenancies, and rental collections
        </p>
      </header> */}

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={cn(
                "hover:-translate-y-1 transition-all duration-300 shadow-lg rounded-2xl",
                stat.title === "Units" || stat.title === "Rooms"
                  ? ""
                  : "cursor-pointer"
              )}
              onClick={() => {
                stat.title === "Properties"
                  ? router.push(`/property/list-view`)
                  : null;
                stat.title === "Active Tenancies"
                  ? router.push(`/tenancy?status=Active`)
                  : null;
              }}
            >
              <div className="flex justify-between items-center px-6 ">
                <div>
                  <h3 className="text-xs uppercase text-gray-500 font-semibold mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={cn(
                      " text-green-600 text-sm font-semibold mt-2 ",
                      stat.title === "Units" || stat.title === "Rooms"
                        ? "invisible"
                        : ""
                    )}
                  >
                    {"View"}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <stat.icon className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Occupancy Overview */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader className="flex flex-row justify-between ">
            <CardTitle className="mt-1">Occupancy Overview</CardTitle>
            {/* <span className="text-green-600 text-sm font-semibold cursor-pointer hover:bg-green-50 rounded-md px-2 py-1">
              Details
            </span> */}
            {/* <h3 className="font-semibold text-gray-800 ">
              Current Tenancy Status
            </h3> */}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="central"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  dy="-0.5em"
                                  className="text-3xl font-bold text-green-600"
                                >
                                  {occupiedPercent}%
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  dy="1.5em"
                                  className="text-gray-500 text-sm"
                                >
                                  Occupied
                                </tspan>
                              </text>
                            );
                          }
                          return null;
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Fully Occupied",
                    value: fully_occupied,
                    color: "bg-green-500",
                  },
                  {
                    label: "Partially Occupied",
                    value: partial_occupied,
                    color: "bg-blue-500",
                  },
                  { label: "Vacant", value: vacant, color: "bg-gray-300" },
                  { label: "Total", value: total },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition hover:cursor-pointer"
                    onClick={() => {
                      item.label === "Total"
                        ? router.push(`/property/list-view`)
                        : router.push(
                            `/property/list-view?status=${item.label}`
                          );
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${item.color} shadow-sm`}
                      ></div>
                      <span className="font-medium text-gray-800">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Collection */}
        <Card className="p-6">
          <CardHeader className="flex flex-row justify-between ">
            <CardTitle className="mt-1">Rental Collection</CardTitle>
            {/* <span className="text-green-600 text-sm font-semibold cursor-pointer hover:bg-green-50 rounded-md px-2 py-1">
              Details
            </span> */}
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <p className="text-4xl font-bold text-green-600">
                MYR {(paid + unpaid).toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">Total Collected</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "Paid",
                  value: `MYR ${paid.toLocaleString()}`,
                  color: "bg-green-500",
                },
                {
                  label: "Unpaid",
                  value: `MYR ${unpaid.toLocaleString()}`,
                  color: "bg-gray-300",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition hover:cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${item.color} shadow-sm`}
                    ></div>
                    <span className="font-medium text-gray-800">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Tenancy Expiry */}
        <Card className="p-6 shadow-sm rounded-2xl border border-gray-100">
          <CardHeader className="flex flex-row justify-between ">
            <CardTitle>Tenancy Expiry Pipeline</CardTitle>
            {/* <span className="text-green-600 text-sm font-semibold cursor-pointer hover:text-green-700">
              Details
            </span> */}
          </CardHeader>

          <CardContent className="space-y-5 p-6">
            {tenancyData.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                {/* Label */}
                <span className="text-sm text-gray-600 w-24 ">
                  {item.label}
                </span>

                {/* Bar background */}
                <div className="relative w-full bg-gray-100 h-6 rounded-full overflow-hidden hover:cursor-pointer hover:bg-gray-200">
                  {/* Filled section */}
                  {item.value > 0 && (
                    <div
                      className={`${item.color} h-6 rounded-full text-white text-center transition-all duration-700 ease-in-out`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      {item.value}
                    </div>
                  )}
                </div>

                {/* Percentage label (only if > 0) */}
                <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                  {item.percentage > 0 ? `${item.percentage.toFixed(2)}%` : ""}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Payment Status */}
        <Card className="p-6">
          <CardHeader className="flex flex-row justify-between ">
            <CardTitle>Monthly Payment Status</CardTitle>
            {/* <span className="text-green-600 text-sm font-semibold cursor-pointer hover:bg-green-50 rounded-md px-2 py-1">
              Details
            </span> */}
            {/* <p className="text-gray-600 text-sm">{month}</p> */}
          </CardHeader>
          <CardContent className="text-center ">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { value: Number(paidPercent) },
                      { value: 100 - Number(paidPercent) },
                    ]}
                    innerRadius={70}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    <Cell fill="#7cb342" />
                    <Cell fill="#e9ecef" />
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              <tspan
                                x={viewBox.cx}
                                dy="-0.5em"
                                className="text-2xl font-bold text-green-600"
                              >
                                {paidPercent}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                dy="1.5em"
                                className="text-gray-500 text-sm"
                              >
                                PAID
                              </tspan>
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {[
                  {
                    label: "Paid",
                    value: `MYR ${paidStatus.toLocaleString()}`,
                    color: "bg-green-500",
                  },
                  {
                    label: "Unpaid",
                    value: `MYR ${unpaidStatus.toLocaleString()}`,
                    color: "bg-gray-300",
                  },
                  {
                    label: "Overdue",
                    value: `MYR ${parseFloat(overdue).toLocaleString()}`,
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition hover:cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${item.color} shadow-sm`}
                      ></div>
                      <span className="font-medium text-gray-800">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
