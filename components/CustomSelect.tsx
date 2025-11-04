"use client";

import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

type OptionType = { id: string; name: string };

export function SelectWithForm<T>({
  name,
  title,
  options,
}: {
  name: (keyof T & string) | string;
  title?: string;
  options: OptionType[];
}) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {title && <FormLabel>{title}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between rounded-[6px] mt-0.5",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find((opt) => opt.id === field.value)?.name
                    : `Select ${title}`}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              onTouchMove={(e) => {
                e.stopPropagation();
              }}
              className="w-[var(--radix-popover-trigger-width)] z-[2000] p-0"
            >
              <Command>
                <CommandInput placeholder={`Search ${title}...`} />
                <CommandList
                  className="max-h-[220px] sm:max-h-[250px] overflow-y-auto overscroll-contain touch-pan-y"
                  onWheelCapture={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (el.scrollHeight > el.clientHeight) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.id}
                        value={opt.name}
                        onSelect={() => {
                          field.onChange(opt.id);
                          setOpen(false);
                        }}
                      >
                        {opt.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            opt.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
