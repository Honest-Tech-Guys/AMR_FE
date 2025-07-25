"use client";

import { Separator } from "./ui/separator";

interface Props {
  title: string;
}
const HeaderSection = ({ title }: Props) => {
  return (
    <div className="w-full my-3 font-bold rounded-[6px] bg-white ">
      <p className="mb-3">{title}</p>
      <Separator />
    </div>
  );
};

export default HeaderSection;
