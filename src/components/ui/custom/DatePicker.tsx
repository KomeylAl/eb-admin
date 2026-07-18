import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

interface CustomDatePickerProps {
  value?: string;
  onChange?: (date: DateObject | null) => void;
}

const CustomDatePicker = ({ value, onChange }: CustomDatePickerProps) => {
  return (
    <DatePicker
      calendar={persian}
      locale={fa}
      format="YYYY-MM-DD"
      value={value}
      onChange={onChange}
      inputClass="w-full bg-white h-9 px-3 py-1 text-base shadow-xs rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-2"
      className=""
    />
  );
};

export default CustomDatePicker;
