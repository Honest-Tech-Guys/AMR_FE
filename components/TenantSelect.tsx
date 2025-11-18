"use client";

import { useState, useEffect } from "react";
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
import useGetTenantByEmail from "@/lib/services/hooks/useGetTenantByEmail";

type OptionType = { id: string; name: string };

export function TenantSelect<T>({
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
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<OptionType | null>(null);

  // API hook
  const { data, isFetching } = useGetTenantByEmail(email);

  // Update searchResult when API returns
  useEffect(() => {
    if (data) {
      setSearchResult({
        id: data.id.toString(),
        name: data.name || data.email,
      });
    } else {
      setSearchResult(null);
    }
  }, [data]);

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
                    ? options.find((opt) => opt.id === field.value)?.name ||
                      searchResult?.name
                    : `Select ${title}`}
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent
              onTouchMove={(e) => e.stopPropagation()}
              className="w-[var(--radix-popover-trigger-width)] z-[2000] p-0"
            >
              {/* Disable internal filtering so API result always shows */}
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={`Search ${title}...`}
                  value={search}
                  onValueChange={async (val) => {
                    setSearch(val);

                    if (!val) {
                      setSearchResult(null);
                      return;
                    }

                    // Check if any local option matches
                    const match = options.some((opt) =>
                      opt.name.toLowerCase().includes(val.toLowerCase())
                    );

                    // If no local match and looks like email, search API
                    if (!match && val.includes("@") && val.includes(".com")) {
                      setEmail(val);
                    } else {
                      setSearchResult(null);
                    }
                  }}
                />

                <CommandList
                  className="max-h-[220px] sm:max-h-[250px] overflow-y-auto overscroll-contain touch-pan-y"
                  onWheelCapture={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (el.scrollHeight > el.clientHeight) e.stopPropagation();
                  }}
                >
                  {/* Show loading if API is fetching */}
                  {isFetching && <CommandEmpty>Searching...</CommandEmpty>}

                  <CommandGroup>
                    {/* Filtered local options */}
                    {options
                      .filter((opt) =>
                        opt.name.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((opt) => (
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
                              opt.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}

                    {/* API search result (always visible if exists) */}
                    {searchResult && (
                      <CommandItem
                        key={searchResult.id}
                        value={searchResult.name}
                        onSelect={() => {
                          field.onChange(searchResult.id);
                          setOpen(false);
                        }}
                      >
                        {searchResult.name}
                        <span className="text-xs text-muted-foreground ml-2">
                          (from email search)
                        </span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            searchResult.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )}
                  </CommandGroup>

                  {/* Show empty message only if nothing to show */}
                  {!isFetching &&
                    options.filter((opt) =>
                      opt.name.toLowerCase().includes(search.toLowerCase())
                    ).length === 0 &&
                    !searchResult && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
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
