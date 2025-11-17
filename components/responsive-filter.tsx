"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Funnel,
  ChevronDown,
  ChevronUp,
  LucideIcon,
  ChevronsUpDown,
  Check,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { InputWithIcon } from "./InpuWithIcon";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // import the responsive date range picker
import DateRangePicker from "./DatePickerRanger";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface FilterConfig {
  name: keyof FormFilters;
  type?: "input" | "select" | "date";
  icon: LucideIcon;
  isMulti?: boolean;
  iconPosition?: "left" | "right";
  placeholder?: string;
  selectItems?: { label: string; value: string }[];
}

interface FormFilters {
  property_name?: string;
  tenant_name?: string;
  owner_name?: string;
  unit_name?: string;
  rental_type?: string;
  Meter_and_lock?: string[];
  status?: string;
  date_range?: string; // store as stringified JSON or formatted string
  page: string;
  per_page: string;
}

interface ResponsiveFilterProps {
  filters: FilterConfig[];
  actionButton?: React.ReactNode;

  formFilters: FormFilters;
  setFormFilters: React.Dispatch<React.SetStateAction<FormFilters>>;
}

export const ResponsiveFilter = ({
  filters,
  actionButton,
  formFilters,
  setFormFilters,
}: ResponsiveFilterProps) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleChange = (name: keyof FormFilters, value: string) => {
    setFormFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderFilter = (filter: FilterConfig, i: number) => {
    if (filter.type === "select" && filter.selectItems) {
      return (
        <div key={i} className="w-full relative">
          <filter.icon
            className={cn(
              "absolute z-2 top-1/2 h-3 w-3 text-muted-foreground -translate-y-1/2",
              filter.iconPosition === "right" ? "right-3" : "left-3"
            )}
          />
          <SmartSelect
            isMulti={filter.isMulti}
            value={formFilters[filter.name] as never}
            onChange={(val) => handleChange(filter.name, val as never)}
            selectItems={filter.selectItems}
            placeholder={filter.placeholder}
          />
        </div>
      );
    }

    if (filter.type === "date") {
      return (
        <div key={i} className="w-full relative">
          <DateRangePicker
            value={
              formFilters.date_range
                ? JSON.parse(formFilters.date_range)
                : undefined
            }
            onChange={(range) =>
              handleChange(filter.name, JSON.stringify(range))
            }
            placeholder={filter.placeholder ?? "Select date range"}
          />
        </div>
      );
    }

    return (
      <div key={i} className="w-full">
        <InputWithIcon
          icon={filter.icon}
          iconPosition={filter.iconPosition}
          placeholder={filter.placeholder}
          value={formFilters[filter.name]}
          onChange={(e) => handleChange(filter.name, e.target.value)}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="mb-3 w-full md:hidden flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowFilters((prev) => !prev)}
          className="rounded-[6px] px-4 py-2"
        >
          <Funnel className="mr-2" />
          Filter {showFilters ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            key="filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full overflow-hidden"
          >
            <div className="grid w-full gap-2 mb-4">
              {filters.map(renderFilter)}
              {actionButton}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden w-full md:flex gap-2 mb-4">
        {filters.map(renderFilter)}
        {actionButton}
      </div>
    </div>
  );
};
export interface SelectItemType {
  label: string;
  value: string;
}

export interface SelectItemType {
  label: string;
  value: string;
}

export interface SmartSelectProps {
  isMulti?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  selectItems: SelectItemType[];
  placeholder?: string;
}

export function SmartSelect({
  isMulti = false,
  value,
  onChange,
  selectItems,
  placeholder = "Select...",
}: SmartSelectProps) {
  const currentValue = Array.isArray(value) ? value : value ? [value] : [];
  const [open, setOpen] = useState(false);

  const toggle = (val: string) => {
    if (!isMulti) {
      onChange(val);
      setOpen(false);
      return;
    }
    if (currentValue.includes(val)) {
      onChange(currentValue.filter((x) => x !== val));
    } else {
      onChange([...currentValue, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className=" rounded-[6px]">
        <Button
          variant="outline"
          className="w-full pl-10 justify-between bg-gray-100"
        >
          {currentValue.length > 0 ? (
            <div className="flex pl-5 gap-1">
              {currentValue.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-500 rounded flex items-center gap-1"
                >
                  {selectItems.find((x) => x.value === item)?.label}

                  {/* Remove tag */}
                  <button
                    type="button"
                    onPointerDownCapture={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(currentValue.filter((x) => x !== item));
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="pl-8 text-gray-500 font-normal">
              {placeholder}
            </span>
          )}

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results.</CommandEmpty>
          <CommandList>
            {selectItems.map((item) => (
              <CommandItem key={item.value} onSelect={() => toggle(item.value)}>
                <Check
                  className={`mr-2 h-4 w-4 ${
                    currentValue.includes(item.value)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
