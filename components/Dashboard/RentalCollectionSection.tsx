import { InfoCard } from "../InfoCard";

const RentalCollectionSection = () => {
  const expiryData = [
    { title: "Today", value: 654.96 },
    { title: "Tomorrow", value: 3 },
    { title: "In 3 Days", value: 3 },
    { title: "In 7 Days", value: 3 },
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
