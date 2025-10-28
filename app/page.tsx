"use client";
import ActiveInformationSection from "@/components/Dashboard/ActiveInformationSection";
import InvoiceChart from "@/components/Dashboard/InvoiceChart";
import OccupancyVacancyOverview from "@/components/Dashboard/OccupancyVacancyOverview";
import RentalV from "@/components/Dashboard/RentalV";
import { TenancyExpiryPipeline } from "@/components/Dashboard/TenencyV";
import ResultTopUp from "@/components/Navbar/ResultTopUp";
import useGetDashboard from "@/lib/services/hooks/useGetDashboard";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RentalCollectionChart from "@/components/Dashboard/RentalCollectionChart";
import OccupancyChart from "@/components/Dashboard/OccupancyVacancyOverview";
export default function Home() {
  const searchParams = useSearchParams(); // 👈
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const order_id = searchParams.get("order_id");
  console.log(status);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    status: "",
    message: "",
    order_id: "",
  });
  useEffect(() => {
    if (status) {
      setPaymentData({
        status: status as string,
        message: message as string,
        order_id: order_id as string,
      });
      setIsOpen(true);
    }
  }, [status]);
  const { data, isPending } = useGetDashboard();
  const [range, setRange] = useState("This Month");
  interface ChartData {
    timeframe: string; // e.g., 'Today', '1 Day', '7 Days'
    percentage: number; // The percentage value for the bar height
    amount: number; // The corresponding monetary amount (optional, mainly for tooltip)
  }

  const MOCK_CHART_DATA: ChartData[] = [
    // This is a minimal set; your actual data will be much larger.
    { timeframe: "Today", percentage: 1.2, amount: 5000 },
    { timeframe: "1 Day", percentage: 3.0, amount: 12000 },
    { timeframe: "1 Day", percentage: 2.7, amount: 10000 },
    { timeframe: "1 Day", percentage: 2.0, amount: 8000 },
    { timeframe: "1 Day", percentage: 3.8, amount: 16000 },
    // ... and so on based on your image
  ];

  if (isPending) {
    return <LoaderCircle className="animate-spin" />;
  }
  return (
    <>
      {/* <div className="flex justify-end ">
        <ToggleGroup
          variant="outline"
          type="single"
          value={range}
          onValueChange={(val) => setRange(val)}
        >
          <ToggleGroupItem value="This Month" aria-label="This Month">
            This Month
          </ToggleGroupItem>
          <ToggleGroupItem value="Last Quarter" aria-label="Last Quarter">
            Last Quarter
          </ToggleGroupItem>
          <ToggleGroupItem
            value="Custom Range"
            aria-label="Custom Range"
            className="md:w-[420px]"
          >
            <DateRangePicker
              // value={
              //   formFilters.date_range
              //     ? JSON.parse(formFilters.date_range)
              //     : undefined
              // }
              // onChange={(range) =>
              //   handleChange(filter.name, JSON.stringify(range))
              // }
              placeholder={"Custom Range"}
              className="rounded-none  bg-transparent border-0 h-[5px] shadow-none"
            />
          </ToggleGroupItem>
        </ToggleGroup>
      </div> */}
      <ActiveInformationSection general={data?.top_stats as never} />
      <div className="grid grid-cols-1 md:grid-cols-2  w-full  gap-5">
        {/* <GeneralSection general={data?.general as never} />
        <MyRentableSpaceSection
          rentable_space={data?.rentable_space as never}
        />
        <TenancyExpiryStatusSection
          tenancy_expiry={data?.tenancy_expiry as never}
        />

        <RentalCollectionSection
          rental_collection={data?.rental_collection as never}
        /> */}
        <OccupancyChart
          data={data?.rentable_space as never}
          MainLabel="Occupancy Overview"
          SubLabel="Current Tenancy Status"
        />

        <RentalCollectionChart
          rental_collection={data?.pie_charts.rental_collection as never}
          month={data?.pie_charts.month as never}
        />
        <TenancyExpiryPipeline data={data?.tenancy_expiry as never} />
        <InvoiceChart
          payment_status={data?.pie_charts.payment_status as never}
          month={data?.pie_charts.month as never}
        />
        {/* <RentalV
          occupancyRate={50.3}
          MainLabel="Rental Collection Forecast"
          SubLabel=""
        /> */}
        {/* <ChartBarLabelCustom /> */}
      </div>
      <ResultTopUp
        paymentData={paymentData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
