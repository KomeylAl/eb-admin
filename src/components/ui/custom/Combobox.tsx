"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { EntityType } from "@/lib/types";

interface ComboboxProps {
  data: EntityType[];
  placeholder: string;
  searchPlaceholder: string;
  value: string | number;
  onChange: (value: string | number) => void;
  /** When set, filtering is done by the parent (server-side search). */
  onSearchChange?: (query: string) => void;
  isLoading?: boolean;
  /** Shown when the selected value is not in the current `data` list. */
  selectedLabel?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  data,
  placeholder,
  searchPlaceholder,
  value,
  onChange,
  onSearchChange,
  isLoading = false,
  selectedLabel,
  emptyMessage = "چیزی یافت نشد.",
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const isAsync = typeof onSearchChange === "function";

  const selected = data.find(
    (item) => String(item.value) === String(value ?? "")
  );
  const displayLabel =
    selected?.label ||
    (value ? selectedLabel : undefined) ||
    null;

  React.useEffect(() => {
    if (!open) {
      setSearch("");
      onSearchChange?.("");
    }
    // Reset search when popover closes so the next open shows the default page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    onSearchChange?.(query);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="z-1000">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">
            {displayLabel || placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0 z-1000"
        align="start"
      >
        <Command shouldFilter={!isAsync}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={isAsync ? search : undefined}
            onValueChange={isAsync ? handleSearchChange : undefined}
          />
          <CommandList>
            {isLoading && data.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال جستجو…
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground border-b">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    در حال به‌روزرسانی نتایج…
                  </div>
                )}
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={String(item.value)}
                      value={item.label}
                      onSelect={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          String(value) === String(item.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {isAsync && (
                  <p className="px-3 py-2 text-[11px] text-muted-foreground border-t">
                    نام یا تلفن را تایپ کنید تا همه نتایج جستجو شوند
                  </p>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
