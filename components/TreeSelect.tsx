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
}

export function TreeSelect({
  control,
  name,
  placeholder,
  treeData,
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
    return nodes.map((node) => (
      <div key={node.value} className="ml-2">
        <CommandItem
          onSelect={() => {
            field.onChange(node.value); // ✅ select any node (parent or child)
            setOpen(false);
          }}
        >
          {node.children ? (
            <span
              className="mr-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering select
                toggleExpand(node.value);
              }}
            >
              {expanded.includes(node.value) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          ) : (
            <span className="mr-6" />
          )}

          {field.value === node.value && <Check className="mr-2 h-4 w-4" />}
          <span>{node.label}</span>
        </CommandItem>

        {node.children && expanded.includes(node.value) && (
          <div className="ml-4 border-l pl-2">{renderTree(node.children)}</div>
        )}
      </div>
    ));
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between rounded-[6px] bg-gray-100 text-gray-500 font-normal"
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
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandList>
              <CommandGroup>{renderTree(treeData)}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
