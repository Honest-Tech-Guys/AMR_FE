import { InfoCard } from "../InfoCard";

const TenancyExpiryStatusSection = () => {
  const expiryData = [
    { title: "In 7 Days", value: 654.96 },
    { title: "In 14 Days", value: 3 },
    { title: "In 30 Days", value: 3 },
    { title: "In 60 Days", value: 3 },
  ];
  return (
    <InfoCard
      title="Tenancy Expiry Status"
      items={expiryData}
      className="grid-cols-2"
    />
  );
};

export default TenancyExpiryStatusSection;
