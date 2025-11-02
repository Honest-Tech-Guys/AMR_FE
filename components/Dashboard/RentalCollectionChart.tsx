import React, { useMemo } from "react";
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
  const chartData = useMemo(
    () => [
      {
        browser: "paid",
        visitors: Number(rental_collection.paid),
        fill: "#88BD23",
      },
      {
        browser: "unpaid",
        visitors: Number(rental_collection.unpaid),
        fill: "#EFF2F5",
      },
    ],
    [rental_collection]
  );

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
