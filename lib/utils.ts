import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
type FormatDateOptions = {
  withTime?: boolean;
};
export const formatDate = (
  input: string | number | Date | null | undefined,
  options?: FormatDateOptions
): string => {
  if (!input) return "-";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "-"; // invalid date

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!options?.withTime) return datePart;

  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} ${timePart}`;
};
