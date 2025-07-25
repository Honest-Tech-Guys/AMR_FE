"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Funnel, ChevronDown, ChevronUp } from "lucide-react";

interface ResponsiveFilterProps {
  filters: React.ReactNode[]; // Array of filter inputs
  actionButton?: React.ReactNode; // Optional button (e.g., Search)
}

export const ResponsiveFilter = ({
  filters,
  actionButton,
}: ResponsiveFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

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

      {/* Mobile Filters (Animated) */}
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
              {filters.map((filter, i) => (
                <div key={i}>{filter}</div>
              ))}
              {actionButton}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden w-full md:flex gap-2 mb-4">
        {filters.map((filter, i) => (
          <div className="w-full" key={i}>
            {filter}
          </div>
        ))}
        {actionButton}
      </div>
    </div>
  );
};
