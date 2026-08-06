"use client";

import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { convertBaseDate } from "@/lib/utils";
import { DateObject } from "react-multi-date-picker";

/**
 * Persian calendar picker that keeps API value as Gregorian YYYY-MM-DD.
 */
export default function AccountingDateField({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (apiDate: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="w-full [&_.rmdp-container]:w-full [&_input]:w-full">
      <CustomDatePicker
        value={value || undefined}
        onChange={(date: DateObject | null) => {
          if (!date) {
            onChange("");
            return;
          }
          onChange(convertBaseDate(date));
        }}
      />
      {!value && placeholder ? (
        <span className="sr-only">{placeholder}</span>
      ) : null}
    </div>
  );
}
