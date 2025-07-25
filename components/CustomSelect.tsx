// components/SelectWithForm.tsx
"use client";

import { SelectHTMLAttributes } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type OptionType = {
  id: string;
  name: string;
};

type SelectWithFormProps<T> = {
  name: keyof T & string;
  title?: string;
  className?: string;
  options: OptionType[];
} & Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "onValueChange" | "value" | "defaultValue" | "dir"
>;

export function SelectWithForm<T>({
  name,
  title,
  className,
  options,
  ...props
}: SelectWithFormProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {title && <FormLabel>{title}</FormLabel>}
          <Select value={field.value} onValueChange={field.onChange} {...props}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  "aria-[invalid=true]:border-destructive rounded-[6px] bg-gray-100 aria-[invalid=true]:ring-destructive w-full",
                  className
                )}
              >
                <SelectValue placeholder={`Select ${title}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={`${name}_${item.id}`} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
