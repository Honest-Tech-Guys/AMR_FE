"use client";
import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

interface Props {
  options: { value: string; label: string }[];
}
const RadioCardsDemo = ({ options }: Props) => {
  return (
    <RadioGroup.Root
      defaultValue={options[0].value}
      className="max-w-sm w-full grid grid-cols-2 md:grid-cols-3 gap-3"
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="py-1 px-3 cursor-pointer  border-transparent text-gray-500 data-[state=checked]:text-primary data-[state=checked]:border-b-2 data-[state=checked]:border-b-primary"
        >
          <span className="font-semibold tracking-tight whitespace-nowrap">
            {option.label}
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};
export default RadioCardsDemo;
