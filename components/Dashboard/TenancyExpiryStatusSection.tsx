import { InfoCard } from "../InfoCard";

type TenancyExpiry = {
  in_7_days: number;
  in_14_days: number;
  in_30_days?: number;
  in_60_days?: number;
};

type TenancyExpiryStatusSectionProps = {
  tenancy_expiry: TenancyExpiry;
};

const TenancyExpiryStatusSection = ({
  tenancy_expiry,
}: TenancyExpiryStatusSectionProps) => {
  const expiryData = [
    { title: "In 7 Days", value: tenancy_expiry.in_7_days.toString() },
    { title: "In 14 Days", value: tenancy_expiry.in_14_days.toString() },
    {
      title: "In 30 Days",
      value: tenancy_expiry.in_30_days?.toString() ?? "0",
    },
    {
      title: "In 60 Days",
      value: tenancy_expiry.in_60_days?.toString() ?? "0",
    },
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
