"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  children?: ReactNode;
}
const HeaderPage = ({ title, children }: Props) => {
  return (
    <div className="w-full flex justify-between p-3 font-bold rounded-[6px] bg-white shadow-xs">
      {title}
      {children}
    </div>
  );
};

export default HeaderPage;
