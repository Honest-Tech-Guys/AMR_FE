"use client";
interface Props {
  title: string;
}
const HeaderPage = ({ title }: Props) => {
  return (
    <div className="w-full p-3 font-bold rounded-[6px] bg-white shadow-xs">
      {title}
    </div>
  );
};

export default HeaderPage;
