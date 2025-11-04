"use client";

import * as React from "react";
import { useController, Control } from "react-hook-form";
import { Check, ChevronRight, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Portal } from "@radix-ui/react-portal";

export interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  treeData: TreeNode[];
  disabled?: boolean;
}

export function TreeSelect({
  control,
  name,
  placeholder,
  treeData,
  ...otherProps
}: TreeSelectProps) {
  const { field } = useController({ name, control });

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const toggleExpand = (value: string) => {
    setExpanded((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => {
      const isLeaf = !node.children || node.children.length === 0;
      const isProperty = node.value.startsWith("property-");
      const isUnit = node.value.startsWith("unit-");
      const isRoom = node.value.startsWith("room-");

      // Only leaf nodes can be selected (leaf units or rooms)
      // If a unit has children (rooms), it should expand instead of being selected
      const canSelect = (isUnit && isLeaf) || isRoom;
      const canExpand = (isProperty || isUnit) && !isLeaf;
      // Disable properties that have no units
      const isDisabled =
        isProperty && (!node.children || node.children.length === 0);

      return (
        <div key={node.value} className="ml-2">
          <CommandItem
            onSelect={() => {
              if (canSelect) {
                // ✅ Select leaf units or rooms only
                field.onChange(node.value);
                setOpen(false);
              } else if (canExpand) {
                // ✅ Toggle expand for properties with units or units with rooms
                toggleExpand(node.value);
              }
            }}
            disabled={isDisabled}
            className={`flex items-center ${
              canExpand ? "cursor-pointer font-medium" : ""
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {/* Icon section */}
            {node.children ? (
              <span className="mr-2">
                {expanded.includes(node.value) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            ) : (
              <span className="mr-6" />
            )}

            {/* Selected icon */}
            {field.value === node.value && <Check className="mr-2 h-4 w-4" />}

            {/* Label */}
            <span>{node.label}</span>
          </CommandItem>

          {/* Render children when expanded */}
          {node.children && expanded.includes(node.value) && (
            <div className="ml-4 border-l pl-2">
              {renderTree(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  const getLabel = (value: string | null): string => {
    if (!value) return "";

    const search = (nodes: TreeNode[]): string | null => {
      for (const node of nodes) {
        if (node.value === value) return node.label;
        if (node.children) {
          const childLabel = search(node.children);
          if (childLabel) return childLabel;
        }
      }
      return null;
    };

    return search(treeData) || "";
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between rounded-[6px] bg-gray-100 text-gray-500 font-normal"
          {...otherProps}
        >
          {field.value
            ? getLabel(field.value)
            : placeholder || "Select item..."}
        </Button>
      </PopoverTrigger>

      <Portal>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 z-[9999]"
          side="bottom"
          align="start"
        >
          {/* ✅ Rely on CommandList native scrolling to fix wheel events */}
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandList
              className="max-h-[300px] overflow-y-auto overscroll-auto touch-pan-y"
              onWheelCapture={(e) => {
                const el = e.currentTarget;
                if (el.scrollHeight > el.clientHeight) {
                  e.stopPropagation();
                }
              }}
            >
              <CommandGroup>{renderTree(treeData)}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
