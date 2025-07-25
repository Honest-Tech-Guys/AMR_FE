import React from "react";
import { ChartPieDonutText } from "../CircleChart";

const RentalCollectionChart = () => {
  const chartData = [
    { browser: "Paid", visitors: 275, fill: "#88BD23" },
    { browser: "Unpaid", visitors: 200, fill: "#EFF2F5" },
  ];
  return (
    <div className="w-full">
      <ChartPieDonutText
        chartData={chartData}
        DetailsLink=""
        MainLabel="Tenancy Expiry Status"
        SubLabel="Paid vs Unpaid"
        data="May 2025"
        labelCenter="Rental Collection"
      />
    </div>
  );
};

export default RentalCollectionChart;
