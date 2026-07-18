"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

interface ComboboxProps {
  data: EntityType[];
  placeholder: string;
  searchPlaceholder: string;
  dValue: string[]; // value(s)
  onChange: (value: string[]) => void;
  isMulti?: boolean;
}

export function MultiCombobox({
  data,
  placeholder,
  searchPlaceholder,
  dValue,
  onChange,
  isMulti = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: string) => {
    if (isMulti) {
      if (dValue.includes(val)) {
        onChange(dValue.filter((v) => v !== val));
      } else {
        onChange([...dValue, val]);
      }
    } else {
      onChange([val]);
      setOpen(false); // در حالت single popover ببنده
    }
  };

  const removeTag = (val: string) => {
    onChange(dValue.filter((v) => v !== val));
  };

  const selectedItems = data.filter((item) => dValue.includes(item.value));

  return (
    <div className="space-y-2 w-full mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedItems.length > 0
              ? isMulti
                ? "موارد انتخاب‌شده"
                : selectedItems[0]?.label
              : placeholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-1000">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>چیزی پیدا نشد.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => toggleValue(item.value)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        dValue.includes(item.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {isMulti && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <Badge
              key={item.value}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {item.label}
              <XIcon
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => removeTag(item.value)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
