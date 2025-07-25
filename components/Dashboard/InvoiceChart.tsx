import React from "react";
import { ChartPieDonutText } from "../CircleChart";

const InvoiceChart = () => {
  const chartData = [
    { browser: "Coming Due", visitors: 275, fill: "#88BD23" },
    { browser: "Overdue", visitors: 200, fill: "#CF1322" },
    { browser: "Paid", visitors: 200, fill: "#EFF2F5" },
  ];
  return (
    <div className="w-full">
      <ChartPieDonutText
        chartData={chartData}
        DetailsLink=""
        MainLabel="Invoice"
        SubLabel="Payment Status"
        data="May 2025"
        labelCenter="Payment Status"
      />
    </div>
  );
};

export default InvoiceChart;
