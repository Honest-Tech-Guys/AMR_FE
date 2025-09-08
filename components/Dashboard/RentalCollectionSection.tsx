import { InfoCard } from "../InfoCard";

type RentalCollection = {
  today: number;
  tomorrow: number;
  in_3_days?: number;
  in_7_days?: number;
};

type RentalCollectionSectionProps = {
  rental_collection: RentalCollection;
};

const RentalCollectionSection = ({
  rental_collection,
}: RentalCollectionSectionProps) => {
  const expiryData = [
    { title: "Today", value: rental_collection.today.toString() },
    { title: "Tomorrow", value: rental_collection.tomorrow.toString() },
    {
      title: "In 3 Days",
      value: rental_collection.in_3_days?.toString() ?? "0",
    },
    {
      title: "In 7 Days",
      value: rental_collection.in_7_days?.toString() ?? "0",
    },
  ];

  return (
    <InfoCard
      title="Rental Collection"
      items={expiryData}
      className="grid-cols-2"
    />
  );
};

export default RentalCollectionSection;
