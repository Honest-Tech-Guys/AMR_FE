import { InfoCard } from "../InfoCard";

type General = {
  credit_balance: string;
  auto_collection: number;
};

type GeneralSectionProps = {
  general: General;
};

export function GeneralSection({ general }: GeneralSectionProps) {
  const items = [
    { title: "Credit Balance", value: general.credit_balance },
    { title: "Auto Collection", value: general.auto_collection.toString() },
  ];

  return <InfoCard title="General" items={items} className="grid-cols-2" />;
}
