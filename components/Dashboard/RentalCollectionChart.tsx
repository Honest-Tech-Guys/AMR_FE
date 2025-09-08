import React from "react";
import { ChartPieDonutText } from "../CircleChart";

type PieChartData = {
  paid: number;
  unpaid: number | string;
};

type RentalCollectionChartProps = {
  rental_collection: PieChartData;
  month: string;
};

const RentalCollectionChart = ({
  rental_collection,
  month,
}: RentalCollectionChartProps) => {
  const chartData = [
    {
      browser: "Paid",
      visitors: Number(rental_collection.paid),
      fill: "#88BD23",
    },
    {
      browser: "Unpaid",
      visitors: Number(rental_collection.unpaid),
      fill: "#EFF2F5",
    },
  ];

  return (
    <div className="w-full">
      <ChartPieDonutText
        chartData={chartData}
        DetailsLink=""
        MainLabel="Rental Collection"
        SubLabel="Paid vs Unpaid"
        data={month}
        labelCenter="Rental Collection"
      />
    </div>
  );
};

export default RentalCollectionChart;
