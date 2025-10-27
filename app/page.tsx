"use client";
import { ChartBarLabelCustom } from "@/components/BarCharts";
import ActiveInformationSection from "@/components/Dashboard/ActiveInformationSection";
import { GeneralSection } from "@/components/Dashboard/GeneralSection";
import InvoiceChart from "@/components/Dashboard/InvoiceChart";
import MyRentableSpaceSection from "@/components/Dashboard/MyRentableSpaceSection";
import OccupancyVacancyOverview from "@/components/Dashboard/OccupancyVacancyOverview";
import RentalCollectionChart from "@/components/Dashboard/RentalCollectionChart";
import RentalCollectionSection from "@/components/Dashboard/RentalCollectionSection";
import RentalCollectionForecast from "@/components/Dashboard/RentalV";
import RentalV from "@/components/Dashboard/RentalV";
import TenancyExpiryStatusSection from "@/components/Dashboard/TenancyExpiryStatusSection";
import { TenancyExpiryPipeline } from "@/components/Dashboard/TenencyV";
import DateRangePicker from "@/components/DatePickerRanger";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useGetDashboard from "@/lib/services/hooks/useGetDashboard";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, isPending } = useGetDashboard();
  const [range, setRange] = useState("This Month");
  interface ChartData {
    timeframe: string; // e.g., 'Today', '1 Day', '7 Days'
    percentage: number; // The percentage value for the bar height
    amount: number; // The corresponding monetary amount (optional, mainly for tooltip)
  }

  // // Define the structure for the component props
  // interface RentalForecastProps {
  //   todayCollections: number;
  //   vacantUnits: number;
  //   totalUnits: number;
  //   unitChange: number; // e.g., 0.21 for 21%
  //   totalRentMYR: number;
  //   chartData: ChartData[];
  // }
  // const forecastProps = {
  //   todayCollections: 577,
  //   vacantUnits: 333,
  //   totalUnits: 28050,
  //   unitChange: 0.21,
  //   totalRentMYR: 1522,
  //   chartData: rentalForecastData, // The detailed data array
  // };
  const MOCK_CHART_DATA: ChartData[] = [
    // This is a minimal set; your actual data will be much larger.
    { timeframe: "Today", percentage: 1.2, amount: 5000 },
    { timeframe: "1 Day", percentage: 3.0, amount: 12000 },
    { timeframe: "1 Day", percentage: 2.7, amount: 10000 },
    { timeframe: "1 Day", percentage: 2.0, amount: 8000 },
    { timeframe: "1 Day", percentage: 3.8, amount: 16000 },
    // ... and so on based on your image
  ];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // add background when user scrolls 10px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (isPending) {
    return <LoaderCircle className="animate-spin" />;
  }
  return (
    <>
      <div className="flex justify-end ">
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
      </div>
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
        <OccupancyVacancyOverview
          occupancyRate={50.3}
          MainLabel="General"
          SubLabel="Occupancy and Vacancy OverView"
        />

        {/* <RentalCollectionChart
          rental_collection={data?.pie_charts.rental_collection as never}
          month={data?.pie_charts.month as never}
        /> */}
        <InvoiceChart
          payment_status={data?.pie_charts.payment_status as never}
          month={data?.pie_charts.month as never}
        />
        <TenancyExpiryPipeline />
        <RentalV
          occupancyRate={50.3}
          MainLabel="Rental Collection Forecast"
          SubLabel=""
        />
        {/* <ChartBarLabelCustom /> */}
      </div>
    </>
  );
}
