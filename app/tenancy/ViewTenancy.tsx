"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicTap from "./Tabs/Basic";
import PaymentScheduleTap from "./Tabs/PaymentSchedule";
import InvoiceTap from "./Tabs/Invoice";
import SmartHomeTap from "./Tabs/SmartHome";
import DocumentsTap from "./Tabs/Documents";
import AuditLogsTap from "./Tabs/AuditLogs";
import { Tenancy } from "@/types/TenancyType";
import { FileText } from "lucide-react";

const tabItems = [
  { label: "Basic", value: "basic" },
  { label: "Payment Schedule", value: "payment_schedule" },
  { label: "Invoice", value: "invoice" },
  { label: "Smart Home", value: "smart_home" },
  { label: "Documents", value: "documents" },
  { label: "Audit Logs", value: "audit_logs" },
];
interface Props {
  tenancy: Tenancy;
}
const ViewTenancy = ({ tenancy }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full cursor-pointer  justify-center  bg-gradient-to-r from-primary to-primary/80  text-white px-6 py-3 rounded-xl text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
          <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
          View More
        </button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-[200] md:p-10 h-[95vh] overflow-y-auto">
        <DialogHeader>
          <h2 className="text-2xl font-bold">View Tenancy</h2>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="gap-4 bg-transparent flex-wrap">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className=" cursor-pointer data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="basic">
            <BasicTap tenancy={tenancy} />
          </TabsContent>
          <TabsContent value="payment_schedule">
            <PaymentScheduleTap />
          </TabsContent>
          <TabsContent value="invoice">
            <InvoiceTap tenancy={tenancy} />
          </TabsContent>
          <TabsContent value="smart_home">
            <SmartHomeTap />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTap tenancy={tenancy} />
          </TabsContent>
          <TabsContent value="audit_logs">
            <AuditLogsTap tenancy={tenancy} />
          </TabsContent>

          {/* Placeholder for other tab contents if needed later */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTenancy;
