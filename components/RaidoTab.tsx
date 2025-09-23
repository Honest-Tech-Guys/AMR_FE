"use client";
import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

interface Props {
  options: { value: string; label: string; count: string }[];
  value: string; // current selected value
  onChange: (value: string) => void; // callback to update filter
}

const RadioCardsDemo = ({ options, value, onChange }: Props) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className=" w-full flex flex-wrap gap-3 text-[10px] sm:text-lg"
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="py-1 px-3 cursor-pointer border-transparent text-gray-500 
            data-[state=checked]:text-primary 
            data-[state=checked]:border-b-2 
            data-[state=checked]:border-b-primary"
        >
          <span className="font-semibold  ">
            {option.label}
            {option.value !== "all" ? <>({option.count})</> : null}
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default RadioCardsDemo;
