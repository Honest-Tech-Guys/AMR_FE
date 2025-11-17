"use client";

import { capitalize } from "@/lib/utilities/Capitalize";
import { ReactNode } from "react";

interface Props {
  title: string;
  children?: ReactNode;
}
const HeaderPage = ({ title, children }: Props) => {
  return (
    <div className="w-full flex justify-between p-3 font-bold rounded-[6px] bg-white normal-case ">
      {capitalize(title)}
      {children}
    </div>
  );
};

export default HeaderPage;
