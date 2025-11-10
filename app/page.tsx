"use client";
// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ClipboardList, Clock, Gauge, LoaderCircle, Lock } from "lucide-react";

// import ActiveInformationSection from "@/components/Dashboard/ActiveInformationSection";
// import InvoiceChart from "@/components/Dashboard/InvoiceChart";
// import OccupancyChart from "@/components/Dashboard/OccupancyVacancyOverview";
// import RentalCollectionChart from "@/components/Dashboard/RentalCollectionChart";
// import { TenancyExpiryPipeline } from "@/components/Dashboard/TenencyV";
// import ResultTopUp from "@/components/Navbar/ResultTopUp";

// import useGetDashboard from "@/lib/services/hooks/useGetDashboard";
// import useGetInvoicesList from "@/lib/services/hooks/useGetInvoices";
// import useGetMetersList from "@/lib/services/hooks/useGetMeterList";
// import useGetLatestAgreement from "@/lib/services/hooks/useGetAgrementsList";

// import { AgreementType } from "@/types/AgreementType";
// import { Invoice } from "@/types/InvoiceType";
// import { cn, formatDate } from "@/lib/utils";
// import { useAuthStore } from "@/lib/stores/authStore";

// export default function Home() {
//   const searchParams = useSearchParams();
//   const status = searchParams.get("status");
//   const message = searchParams.get("message");
//   const order_id = searchParams.get("order_id");
//   const router = useRouter();
//   const { user_role } = useAuthStore();
//   const [isOpen, setIsOpen] = useState(false);
//   const [paymentData, setPaymentData] = useState({
//     status: "",
//     message: "",
//     order_id: "",
//   });

//   useEffect(() => {
//     if (status) {
//       setPaymentData({
//         status: status ?? "",
//         message: message ?? "",
//         order_id: order_id ?? "",
//       });
//       setIsOpen(true);
//     }
//   }, [status, message, order_id]);

//   const { data, isPending } = useGetDashboard();
//   const { data: meterData } = useGetMetersList();
//   const { data: invoiceData } = useGetInvoicesList();
//   const { data: agreementData } = useGetLatestAgreement();

//   if (isPending) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <LoaderCircle className="animate-spin text-emerald-700 w-10 h-10" />
//       </div>
//     );
//   }

//   /** ---------- UTILITIES ---------- **/
//   const daysRemaining = (endIso: string) => {
//     const today = new Date();
//     const end = new Date(endIso);
//     const diff = Math.ceil(
//       (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     return diff;
//   };

//   /** ---------- COMPONENTS ---------- **/
//   const AgreementCard = ({ agreement }: { agreement: AgreementType }) => {
//     const days = daysRemaining(agreement.end_date);
//     return (
//       <article className="bg-white rounded-2xl shadow-sm p-5 mt-4 md:mt-6 border">
//         <div className="flex justify-between gap-4">
//           <div className="flex-1">
//             <p className="text-sm text-gray-500 ">Tenancy Period</p>
//             <p className="text-sm font-medium mt-1">
//               {formatDate(agreement.start_date)} –{" "}
//               {formatDate(agreement.end_date)}
//             </p>
//             <p className="text-sm text-gray-500 mt-3">Rental Fee</p>
//             <p className="font-medium text-sm">RM {agreement.rental_amount}</p>
//             <button className="mt-5 bg-emerald-700 text-white px-3 py-1 rounded-full">
//               Set up Auto Debit
//             </button>
//           </div>
//           <div className="flex-shrink-0 flex flex-col items-end justify-between">
//             <button className="bg-gray-100 text-sm px-2 py-1 rounded-md">
//               View Details
//             </button>
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">Tenancy Remaining</p>
//               <div className="mt-2 bg-gray-100 text-sm px-2 py-1 rounded-md text-emerald-700 font-semibold">
//                 {days} Days
//               </div>
//             </div>
//           </div>
//         </div>
//       </article>
//     );
//   };

//   const SmartMeterCard = ({ meter }: { meter: Meter }) => (
//     <section className="mt-6">
//       <div className="flex items-center justify-between">
//         <h4 className="font-semibold text-lg">Smart Meter</h4>
//         <div
//           className="text-emerald-700 text-sm"
//           onClick={() => router.push("/smart-home/meter")}
//         >
//           View All
//         </div>
//       </div>
//       <div className="bg-white border rounded-xl p-4 mt-3 flex items-center justify-between shadow-sm">
//         <div className="flex items-start gap-4">
//           <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
//             <Gauge className="text-emerald-700" />
//           </div>
//           <div>
//             <div className="font-bold">
//               {meter.meterable?.property_name},{" "}
//               {meter.meterable?.address_line_1}
//             </div>
//             <div className="text-sm text-gray-500 mt-1">
//               Balance: {meter.balance_unit} unit
//             </div>
//             <div className="text-sm text-gray-400 mt-1">
//               Last Update: {formatDate(meter.updated_at)}{" "}
//               {new Date(meter.updated_at).toLocaleTimeString()}
//             </div>
//             <div className="flex gap-2 mt-3">
//               <span className="px-2 py-1 border rounded-md text-sm bg-emerald-50">
//                 Wifi Connected
//               </span>
//               <span className="px-2 py-1 border rounded-md text-sm bg-emerald-50">
//                 Power On
//               </span>
//             </div>
//           </div>
//         </div>
//         <div>›</div>
//       </div>
//     </section>
//   );

//   const InvoiceCard = ({ invoice }: { invoice: Invoice }) => (
//     <section className="mt-6">
//       <div className="flex items-center justify-between">
//         <h4 className="font-semibold text-lg">My Invoices</h4>
//         <div
//           className="text-emerald-700 text-sm"
//           onClick={() => router.push("/accounting/invoice")}
//         >
//           View All
//         </div>
//       </div>
//       <div className="bg-white border rounded-2xl p-4 mt-3 shadow-sm">
//         <div className="flex items-center gap-4">
//           <div className="w-16 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
//             Due
//           </div>
//           <div className="flex-1">
//             <div className="text-sm text-sky-600 font-bold">
//               Invoice #: {invoice.invoice_number}
//             </div>
//             <div className="mt-1">
//               Amount:{" "}
//               <span className="font-bold">RM{invoice.total_amount}</span>
//             </div>
//             <div className="text-sm text-gray-400 mt-1">
//               Due Date: {formatDate(invoice.due_date)}
//             </div>
//           </div>
//           <div>›</div>
//         </div>
//       </div>
//     </section>
//   );

//   const QuickAccess = () => {
//     const items = [
//       {
//         title: "Agreement",
//         icon: <ClipboardList className="text-emerald-700" />,
//         url: "/tenancy/Agreement",
//       },
//       {
//         title: "Smart Lock",
//         icon: <Lock className="text-emerald-700" />,
//         url: "/smart-home/lock",
//       },
//       {
//         title: "History",
//         icon: <Clock className="text-emerald-700" />,
//         url: "/",
//       },
//     ];
//     return (
//       <section className="mt-6">
//         <h4 className="font-semibold text-lg">Quick Access</h4>
//         <div className="grid grid-cols-3 gap-4 mt-4">
//           {items.map((it) => (
//             <div
//               key={it.title}
//               className="bg-white border rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm"
//               onClick={() => router.push(it.url)}
//             >
//               <div className="text-2xl">{it.icon}</div>
//               <div className="text-sm">{it.title}</div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   };

//   /** ---------- MAIN JSX ---------- **/
//   return (
//     <>
//       {user_role === "Tenant" && (
//         <main className="max-w-3xl mx-auto px-4 md:px-6">
//           {agreementData && <AgreementCard agreement={agreementData} />}
//           <QuickAccess />
//           {meterData?.[0] && <SmartMeterCard meter={meterData[0]} />}
//           {invoiceData?.[0] && <InvoiceCard invoice={invoiceData[0]} />}
//           <div className="h-24" />
//         </main>
//       )}

//       {/* Desktop Dashboard Visuals */}
//       <div className={cn(user_role === "Tenant" ? "hidden md:block" : null)}>
//         <ActiveInformationSection general={data?.top_stats as never} />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <OccupancyChart
//             data={data?.rentable_space as never}
//             MainLabel="Occupancy Overview"
//             SubLabel="Current Tenancy Status"
//           />
//           <RentalCollectionChart
//             rental_collection={data?.pie_charts?.rental_collection as never}
//             month={data?.pie_charts?.month as never}
//           />
//           <TenancyExpiryPipeline data={data?.tenancy_expiry as never} />
//           <InvoiceChart
//             payment_status={data?.pie_charts?.payment_status as never}
//             month={data?.pie_charts?.month as never}
//           />
//         </div>
//         <ResultTopUp
//           paymentData={paymentData}
//           isOpen={isOpen}
//           setIsOpen={setIsOpen}
//         />
//       </div>
//     </>
//   );
// }

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

const COLORS = ["#7cb342", "#e9ecef"];

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
  const occupied = dashboard.rentable_space.occupied;
  const vacant = dashboard.rentable_space.vacant;
  const total = dashboard.rentable_space.total || 1;
  const occupiedPercent = ((occupied / total) * 100).toFixed(1);

  const occupancyData = [
    { name: "Occupied", value: occupied },
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
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Occupancy Overview</CardTitle>
            <span className="text-green-600 text-sm font-semibold cursor-pointer hover:bg-green-50 rounded-md px-2 py-1">
              Details
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-800 mb-6">
              Current Tenancy Status
            </h3>

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
                  { label: "Occupied", value: occupied },
                  { label: "Vacant", value: vacant },
                  { label: "Total", value: total },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-green-50 transition"
                  >
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                    <span className="font-bold text-gray-900 text-lg">
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
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Rental Collection</CardTitle>
            <span className="text-green-600 text-sm font-semibold cursor-pointer hover:bg-green-50 rounded-md px-2 py-1">
              Details
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-800 mb-2">Paid vs Unpaid</h3>
            <p className="text-gray-500 text-sm mb-6">{month}</p>

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
                  className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
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
          <CardHeader className="flex flex-row justify-between items-center p-0 mb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Tenancy Expiry Pipeline
            </CardTitle>
            <span className="text-green-600 text-sm font-semibold cursor-pointer hover:text-green-700">
              Details
            </span>
          </CardHeader>

          <CardContent className="space-y-5 p-0">
            {tenancyData.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                {/* Label */}
                <span className="text-sm text-gray-600 w-24">{item.label}</span>

                {/* Bar background */}
                <div className="relative w-full bg-gray-100 h-6 rounded-full overflow-hidden">
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
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Monthly Payment Status</CardTitle>
            <span className="text-green-600 text-sm font-semibold cursor-pointer hover:bg-green-50 rounded-md px-2 py-1">
              Details
            </span>
          </CardHeader>
          <CardContent className="text-center space-y-8">
            <p className="text-gray-600 text-sm">{month}</p>
            <div className="flex justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { value: Number(paidPercent) },
                      { value: 100 - Number(paidPercent) },
                    ]}
                    innerRadius={70}
                    outerRadius={90}
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
            </div>

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
                  className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
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
    </div>
  );
}
