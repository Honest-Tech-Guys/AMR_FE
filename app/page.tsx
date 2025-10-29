"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList, Clock, Gauge, LoaderCircle, Lock } from "lucide-react";

import ActiveInformationSection from "@/components/Dashboard/ActiveInformationSection";
import InvoiceChart from "@/components/Dashboard/InvoiceChart";
import OccupancyChart from "@/components/Dashboard/OccupancyVacancyOverview";
import RentalCollectionChart from "@/components/Dashboard/RentalCollectionChart";
import { TenancyExpiryPipeline } from "@/components/Dashboard/TenencyV";
import ResultTopUp from "@/components/Navbar/ResultTopUp";

import useGetDashboard from "@/lib/services/hooks/useGetDashboard";
import useGetInvoicesList from "@/lib/services/hooks/useGetInvoices";
import useGetMetersList from "@/lib/services/hooks/useGetMeterList";
import useGetLatestAgreement from "@/lib/services/hooks/useGetAgrementsList";

import { AgreementType } from "@/types/AgreementType";
import { Invoice } from "@/types/InvoiceType";
import { cn, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

export default function Home() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const order_id = searchParams.get("order_id");
  const router = useRouter();
  const { user_role } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    status: "",
    message: "",
    order_id: "",
  });

  useEffect(() => {
    if (status) {
      setPaymentData({
        status: status ?? "",
        message: message ?? "",
        order_id: order_id ?? "",
      });
      setIsOpen(true);
    }
  }, [status, message, order_id]);

  const { data, isPending } = useGetDashboard();
  const { data: meterData } = useGetMetersList();
  const { data: invoiceData } = useGetInvoicesList();
  const { data: agreementData } = useGetLatestAgreement();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-emerald-700 w-10 h-10" />
      </div>
    );
  }

  /** ---------- UTILITIES ---------- **/
  const daysRemaining = (endIso: string) => {
    const today = new Date();
    const end = new Date(endIso);
    const diff = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  /** ---------- COMPONENTS ---------- **/
  const AgreementCard = ({ agreement }: { agreement: AgreementType }) => {
    const days = daysRemaining(agreement.end_date);
    return (
      <article className="bg-white rounded-2xl shadow-sm p-5 mt-4 md:mt-6 border">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 ">Tenancy Period</p>
            <p className="text-sm font-medium mt-1">
              {formatDate(agreement.start_date)} –{" "}
              {formatDate(agreement.end_date)}
            </p>
            <p className="text-sm text-gray-500 mt-3">Rental Fee</p>
            <p className="font-medium text-sm">RM {agreement.rental_amount}</p>
            <button className="mt-5 bg-emerald-700 text-white px-3 py-1 rounded-full">
              Set up Auto Debit
            </button>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end justify-between">
            <button className="bg-gray-100 text-sm px-2 py-1 rounded-md">
              View Details
            </button>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Tenancy Remaining</p>
              <div className="mt-2 bg-gray-100 text-sm px-2 py-1 rounded-md text-emerald-700 font-semibold">
                {days} Days
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const SmartMeterCard = ({ meter }: { meter: Meter }) => (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">Smart Meter</h4>
        <div
          className="text-emerald-700 text-sm"
          onClick={() => router.push("/smart-home/meter")}
        >
          View All
        </div>
      </div>
      <div className="bg-white border rounded-xl p-4 mt-3 flex items-center justify-between shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <Gauge className="text-emerald-700" />
          </div>
          <div>
            <div className="font-bold">
              {meter.meterable?.property_name},{" "}
              {meter.meterable?.address_line_1}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Balance: {meter.balance_unit} unit
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Last Update: {formatDate(meter.updated_at)}{" "}
              {new Date(meter.updated_at).toLocaleTimeString()}
            </div>
            <div className="flex gap-2 mt-3">
              <span className="px-2 py-1 border rounded-md text-sm bg-emerald-50">
                Wifi Connected
              </span>
              <span className="px-2 py-1 border rounded-md text-sm bg-emerald-50">
                Power On
              </span>
            </div>
          </div>
        </div>
        <div>›</div>
      </div>
    </section>
  );

  const InvoiceCard = ({ invoice }: { invoice: Invoice }) => (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">My Invoices</h4>
        <div
          className="text-emerald-700 text-sm"
          onClick={() => router.push("/accounting/invoice")}
        >
          View All
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-4 mt-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
            Due
          </div>
          <div className="flex-1">
            <div className="text-sm text-sky-600 font-bold">
              Invoice #: {invoice.invoice_number}
            </div>
            <div className="mt-1">
              Amount:{" "}
              <span className="font-bold">RM{invoice.total_amount}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Due Date: {formatDate(invoice.due_date)}
            </div>
          </div>
          <div>›</div>
        </div>
      </div>
    </section>
  );

  const QuickAccess = () => {
    const items = [
      {
        title: "Agreement",
        icon: <ClipboardList className="text-emerald-700" />,
        url: "/tenancy/Agreement",
      },
      {
        title: "Smart Lock",
        icon: <Lock className="text-emerald-700" />,
        url: "/smart-home/lock",
      },
      {
        title: "History",
        icon: <Clock className="text-emerald-700" />,
        url: "/",
      },
    ];
    return (
      <section className="mt-6">
        <h4 className="font-semibold text-lg">Quick Access</h4>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="bg-white border rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm"
              onClick={() => router.push(it.url)}
            >
              <div className="text-2xl">{it.icon}</div>
              <div className="text-sm">{it.title}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /** ---------- MAIN JSX ---------- **/
  return (
    <>
      {user_role === "Tenant" && (
        <main className="max-w-3xl mx-auto px-4 md:px-6">
          {agreementData && <AgreementCard agreement={agreementData} />}
          <QuickAccess />
          {meterData?.[0] && <SmartMeterCard meter={meterData[0]} />}
          {invoiceData?.[0] && <InvoiceCard invoice={invoiceData[0]} />}
          <div className="h-24" />
        </main>
      )}

      {/* Desktop Dashboard Visuals */}
      <div className={cn(user_role === "Tenant" ? "hidden md:block" : null)}>
        <ActiveInformationSection general={data?.top_stats as never} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <OccupancyChart
            data={data?.rentable_space as never}
            MainLabel="Occupancy Overview"
            SubLabel="Current Tenancy Status"
          />
          <RentalCollectionChart
            rental_collection={data?.pie_charts?.rental_collection as never}
            month={data?.pie_charts?.month as never}
          />
          <TenancyExpiryPipeline data={data?.tenancy_expiry as never} />
          <InvoiceChart
            payment_status={data?.pie_charts?.payment_status as never}
            month={data?.pie_charts?.month as never}
          />
        </div>
        <ResultTopUp
          paymentData={paymentData}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
}
