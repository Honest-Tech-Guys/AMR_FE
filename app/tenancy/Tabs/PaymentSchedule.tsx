import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const PaymentScheduleTap = () => {
  return (
    <div className="flex flex-col gap-5 min-h-[70vh]">
      {" "}
      <div className="border-1 w-full">
        <div className="flex w-full items-center p-3 justify-between border-b-1">
          <span>Schedule Information</span>
        </div>
        <div className="grid grid-cols-4 w-full p-3 gap-5">
          <div>
            <p>Tenancy</p>
            <p>AuntieMichelle-T25000212</p>
          </div>
          <div>
            <p>Auto Direct Debit</p>
            <p>Auto Pay Not Activated</p>
          </div>
          <div>
            <p>Debit Type</p>
            <p>-</p>
          </div>
          <div>
            <p>Total Term</p>
            <p>12</p>
          </div>
          <div>
            <p>ENRP Status Updated At</p>
            <p>-</p>
          </div>
          <div>
            <p>Invoice Date</p>
            <p>Every 1st of the month</p>
          </div>
          <div>
            <p>Next Invoice Date</p>
            <p>01 Jul 2025</p>
          </div>
        </div>
      </div>
      <div className="border-1 w-full">
        <div className="flex w-full items-center p-3 justify-between border-b-1">
          <span>Schedules</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-xs">
              <TableHead>Send Date</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex gap-2">25 May 2025 </TableCell>
              <TableCell>25 May 2025</TableCell>
              <TableCell>1</TableCell>
              <TableCell>120</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>Cancel</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentScheduleTap;
