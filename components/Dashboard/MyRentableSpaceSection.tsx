import { InfoCard } from "../InfoCard";

const MyRentableSpaceSection = () => {
  const items = [
    { title: "Total", value: "654.96" },
    { title: "Vacant", value: "3" },
    { title: "Occupied", value: "3" },
  ];
  return (
    <InfoCard title="My Rentable Space" items={items} className="grid-cols-3" />
  );
};

export default MyRentableSpaceSection;
