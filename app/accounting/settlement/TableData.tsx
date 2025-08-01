"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import React from "react";
import { Minus, Plus } from "lucide-react";

export default function SettlementTable() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const toggleRow = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };
  const data = [
    {
      settlement_date: "01 Jun 2025",
      settlement_ID: "MD282000120250601",
      currency: "MRY",
      gross: "1000.00",
      MDR: "10.00",
      commission: "20.00",
      Net: "970.00",
      Net_payex: "950.00",
      net_others: "20.00",
      subItems: [
        {
          invoice_number: "INV-001",
          tenant: "John Doe",
          property: "Sunrise Apartments",
          description: "Monthly Rent",
          transaction_id: "TXN-1001",
          invoice_amount: "1000.00",
          gross: "1000.00",
          MDR: "10.00",
          commission: "20.00",
          net: "970.00",
          net_payex: "950.00",
          net_others: "20.00",
          p_datetime: "2025-06-01 10:00:00",
        },
        {
          invoice_number: "INV-002",
          tenant: "Jane Smith",
          property: "Sunset Villas",
          description: "Security Deposit",
          transaction_id: "TXN-1002",
          invoice_amount: "500.00",
          gross: "500.00",
          MDR: "5.00",
          commission: "10.00",
          net: "485.00",
          net_payex: "475.00",
          net_others: "10.00",
          p_datetime: "2025-06-01 11:00:00",
        },
      ],
    },
    {
      settlement_date: "02 Jun 2025",
      settlement_ID: "MD282000120250602",
      currency: "MRY",
      gross: "2000.00",
      MDR: "20.00",
      commission: "40.00",
      Net: "1940.00",
      Net_payex: "1900.00",
      net_others: "40.00",
      subItems: [
        {
          invoice_number: "INV-003",
          tenant: "Alice Lee",
          property: "Greenfield Homes",
          description: "Monthly Rent",
          transaction_id: "TXN-1003",
          invoice_amount: "2000.00",
          gross: "2000.00",
          MDR: "20.00",
          commission: "40.00",
          net: "1940.00",
          net_payex: "1900.00",
          net_others: "40.00",
          p_datetime: "2025-06-02 09:30:00",
        },
      ],
    },
  ];
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 text-xs">
            <TableHead></TableHead>
            <TableHead>Settlement Date</TableHead>
            <TableHead>Settlement ID</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>MDR</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Net</TableHead>
            <TableHead>Net (Payex)</TableHead>
            <TableHead>Net (Others)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <React.Fragment key={item.settlement_ID}>
              <TableRow
                className={`[&>*]:transition-all  [&>*]:duration-300 ${
                  expandedRows.includes(index)
                    ? "bg-muted/20 [&>*]:py-4"
                    : "[&>*]:py-2"
                }`}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRow(index)}
                  >
                    {expandedRows.includes(index) ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  {item.settlement_date}
                </TableCell>
                <TableCell>{item.settlement_ID}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.gross}</TableCell>
                <TableCell>{item.MDR}</TableCell>
                <TableCell>{item.commission}</TableCell>
                <TableCell>{item.Net}</TableCell>
                <TableCell>{item.Net_payex}</TableCell>
                <TableCell>{item.net_others}</TableCell>
              </TableRow>
              {expandedRows.includes(index) && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice Number</TableHead>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Invoice Amount</TableHead>
                          <TableHead>Gross</TableHead>
                          <TableHead>MDR</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Net</TableHead>
                          <TableHead>Net(Payex)</TableHead>
                          <TableHead>Net (Others)</TableHead>
                          <TableHead>P.Datetime</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.subItems.map((subItem) => (
                          <TableRow key={subItem.invoice_number}>
                            <TableCell className="font-medium">
                              {subItem.invoice_number}
                            </TableCell>
                            <TableCell>{subItem.tenant}</TableCell>
                            <TableCell className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {subItem.property}
                            </TableCell>
                            <TableCell className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {subItem.description}
                            </TableCell>
                            <TableCell>{subItem.transaction_id}</TableCell>
                            <TableCell>${subItem.invoice_amount}</TableCell>
                            <TableCell>${subItem.gross}</TableCell>
                            <TableCell>${subItem.MDR}</TableCell>
                            <TableCell>${subItem.commission}</TableCell>
                            <TableCell>${subItem.net}</TableCell>
                            <TableCell>${subItem.net_payex}</TableCell>
                            <TableCell>${subItem.net_others}</TableCell>
                            <TableCell>{subItem.p_datetime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
