"use client";
import { ChartBarLabelCustom } from "@/components/BarCharts";
import ActiveInformationSection from "@/components/Dashboard/ActiveInformationSection";
import { GeneralSection } from "@/components/Dashboard/GeneralSection";
import InvoiceChart from "@/components/Dashboard/InvoiceChart";
import MyRentableSpaceSection from "@/components/Dashboard/MyRentableSpaceSection";
import RentalCollectionChart from "@/components/Dashboard/RentalCollectionChart";
import RentalCollectionSection from "@/components/Dashboard/RentalCollectionSection";
import TenancyExpiryStatusSection from "@/components/Dashboard/TenancyExpiryStatusSection";
import useGetDashboard from "@/lib/services/hooks/useGetDashboard";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const { data, isPending } = useGetDashboard();
  if (isPending) {
    return <LoaderCircle className="animate-spin" />;
  }
  return (
    <>
      <ActiveInformationSection general={data?.top_stats as never} />
      <div className="grid grid-cols-1 md:grid-cols-2  w-full  gap-5">
        <GeneralSection general={data?.general as never} />
        <MyRentableSpaceSection
          rentable_space={data?.rentable_space as never}
        />
        <TenancyExpiryStatusSection
          tenancy_expiry={data?.tenancy_expiry as never}
        />

        <RentalCollectionSection
          rental_collection={data?.rental_collection as never}
        />

        <RentalCollectionChart
          rental_collection={data?.pie_charts.rental_collection as never}
          month={data?.pie_charts.month as never}
        />
        <InvoiceChart
          payment_status={data?.pie_charts.payment_status as never}
          month={data?.pie_charts.month as never}
        />

        {/* <ChartBarLabelCustom /> */}
      </div>
    </>
  );
}
