"use client";

import { useEffect, useMemo, useState } from "react";
import { Combobox } from "@/components/ui/custom/Combobox";
import { useClients } from "@/hooks/useClients";
import { apiOptions } from "@/lib/selectOptions";

const PAGE_SIZE = 50;
const DEBOUNCE_MS = 300;

type ClientComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  /** Keep showing the current selection even if it's outside the loaded page. */
  selectedLabel?: string;
  onSelectedLabelChange?: (label: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function ClientCombobox({
  value,
  onChange,
  selectedLabel,
  onSelectedLabelChange,
  placeholder = "انتخاب مراجع",
  searchPlaceholder = "جستجوی نام یا تلفن…",
  disabled,
  className,
}: ClientComboboxProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isFetching } = useClients(1, PAGE_SIZE, debouncedSearch);

  const options = useMemo(() => {
    const list = apiOptions(data?.data ?? []);
    if (
      value &&
      selectedLabel &&
      !list.some((item) => String(item.value) === String(value))
    ) {
      return [{ value: String(value), label: selectedLabel }, ...list];
    }
    return list.map((item) => ({
      ...item,
      value: String(item.value),
    }));
  }, [data?.data, value, selectedLabel]);

  return (
    <Combobox
      data={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      value={value}
      selectedLabel={selectedLabel}
      isLoading={isFetching}
      disabled={disabled}
      className={className}
      emptyMessage={
        debouncedSearch
          ? "مراجعی با این جستجو یافت نشد."
          : "مراجعی یافت نشد. برای جستجو تایپ کنید."
      }
      onSearchChange={setSearchInput}
      onChange={(next) => {
        const id = String(next);
        const option = options.find((item) => String(item.value) === id);
        onChange(id);
        if (option?.label) onSelectedLabelChange?.(option.label);
      }}
    />
  );
}
