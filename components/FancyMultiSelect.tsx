import { X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useMemo } from "react";

export type Option = { value: string; label: string };

interface FancyMultiSelectProps {
  value: Option[];
  options: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
}

export function FancyMultiSelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
}: FancyMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const handleUnselect = useCallback(
    (option: Option) => {
      onChange(value.filter((s) => s.value !== option.value));
    },
    [onChange, value]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    [value, inputValue, onChange]
  );
  const filteredOptions = useMemo(
    () =>
      options.filter((option) => !value.some((v) => v.value === option.value)),
    [options, value]
  );
  return (
    <div className="w-full">
      <Command className="overflow-visible">
        <div className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {value.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="select-none"
              >
                {option.label}
                <div onClick={() => handleUnselect(option)}>
                  <X
                    className="size-3 text-muted-foreground hover:text-foreground ml-2 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </Badge>
            ))}
            <CommandPrimitive.Input
              onKeyDown={handleKeyDown}
              onValueChange={setInputValue}
              value={inputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          <CommandList>
            {open && !!filteredOptions.length && (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                <CommandGroup className="h-full overflow-auto">
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onChange([...value, option]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            )}
          </CommandList>
        </div>
      </Command>
    </div>
  );
}
