import { InfoCard } from "../InfoCard";

type RentableSpace = {
  total: number;
  vacant: number;
  occupied: number;
};

type MyRentableSpaceSectionProps = {
  rentable_space: RentableSpace;
};

const MyRentableSpaceSection = ({
  rentable_space,
}: MyRentableSpaceSectionProps) => {
  const items = [
    { title: "Total", value: rentable_space.total.toString() },
    { title: "Vacant", value: rentable_space.vacant.toString() },
    { title: "Occupied", value: rentable_space.occupied.toString() },
  ];

  return (
    <InfoCard title="My Rentable Space" items={items} className="grid-cols-3" />
  );
};

export default MyRentableSpaceSection;
