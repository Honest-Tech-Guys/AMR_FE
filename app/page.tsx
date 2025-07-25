import { ChartBarLabelCustom } from "@/components/BarCharts";
import ActiveInformationSection from "@/components/Dashboard/ActiveInformationSection";
import { GeneralSection } from "@/components/Dashboard/GeneralSection";
import InvoiceChart from "@/components/Dashboard/InvoiceChart";
import MyRentableSpaceSection from "@/components/Dashboard/MyRentableSpaceSection";
import RentalCollectionChart from "@/components/Dashboard/RentalCollectionChart";
import RentalCollectionSection from "@/components/Dashboard/RentalCollectionSection";
import TenancyExpiryStatusSection from "@/components/Dashboard/TenancyExpiryStatusSection";

export default function Home() {
  return (
    <>
      <ActiveInformationSection />
      <div className="grid grid-cols-1 md:grid-cols-2  w-full  gap-5">
        <GeneralSection />
        <MyRentableSpaceSection />
        <TenancyExpiryStatusSection />
        <RentalCollectionSection />
        <RentalCollectionChart />
        <InvoiceChart />
        <ChartBarLabelCustom />
      </div>
    </>
  );
}
