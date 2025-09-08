import React from "react";
import { ChartPieDonutText } from "../CircleChart";

type PaymentStatusData = {
  paid: number | string;
  unpaid: number | string;
  overdue: number | string;
};

type InvoiceChartProps = {
  payment_status: PaymentStatusData;
  month: string;
};

const InvoiceChart = ({ payment_status, month }: InvoiceChartProps) => {
  const chartData = [
    { browser: "Paid", visitors: Number(payment_status.paid), fill: "#EFF2F5" },
    {
      browser: "Unpaid",
      visitors: Number(payment_status.unpaid),
      fill: "#88BD23",
    },
    {
      browser: "Overdue",
      visitors: Number(payment_status.overdue),
      fill: "#CF1322",
    },
  ];

  return (
    <div className="w-full">
      <ChartPieDonutText
        chartData={chartData}
        DetailsLink=""
        MainLabel="Invoice"
        SubLabel="Payment Status"
        data={month}
        labelCenter="Payment Status"
      />
    </div>
  );
};

export default InvoiceChart;
