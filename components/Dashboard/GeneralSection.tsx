import { InfoCard } from "../InfoCard";

export function GeneralSection() {
  const items = [
    { title: "Credit Balance", value: "654.96" },
    { title: "Auto Collection", value: "3" },
  ];
  return <InfoCard title="General" items={items} className="grid-cols-2" />;
}
