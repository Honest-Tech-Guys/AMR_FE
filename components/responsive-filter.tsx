"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Funnel, ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import React from "react";
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

interface FilterConfig {
  name: keyof FormFilters;
  type?: "input" | "select" | "date";
  icon: LucideIcon;
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
  Meter_and_lock?: string;
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
              "absolute top-1/2 h-3 w-3 text-muted-foreground -translate-y-1/2",
              filter.iconPosition === "right" ? "right-3" : "left-3"
            )}
          />
          <Select
            value={formFilters[filter.name] ?? ""}
            onValueChange={(val) => handleChange(filter.name, val)}
          >
            <SelectTrigger
              className={cn(
                "w-full pl-10 bg-gray-100 rounded-[6px]",
                filter.iconPosition === "right" ? "pr-10" : ""
              )}
            >
              <SelectValue placeholder={filter.placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {filter.selectItems.map((item, idx) => (
                <SelectItem key={idx} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
