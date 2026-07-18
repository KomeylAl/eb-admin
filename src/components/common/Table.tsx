import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cellClassName?: (row: T) => string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  showActions?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

function Table<T>({
  columns = [],
  data = [],
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange = () => {},
  showActions = false,
  onEdit = () => {},
  onDelete = () => {},
}: TableProps<T>) {
  const safePageSize = pageSize || 10;
  const totalPages = Math.ceil(totalItems / safePageSize);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 2;
    const minVisible = Math.max(2, currentPage - range);
    const maxVisible = Math.min(totalPages - 1, currentPage + range);

    pages.push(1);
    if (minVisible > 2) pages.push("...");

    for (let i = minVisible; i <= maxVisible; i++) {
      pages.push(i);
    }

    if (maxVisible < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages.map((page, index) => {
      if (typeof page === "number" && page > totalPages) return null;
      if (page === "...") {
        return (
          <span key={`dots-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          onClick={() => onPageChange?.(page as number)}
          className={cn(
            "px-4 py-1 rounded-md text-lg",
            currentPage === page
              ? "bg-indigo-100 dark:bg-gray-900 dark:text-white text-blue-600"
              : "text-gray-700 dark:text-gray-500 dark:hover:bg-gray-900 hover:bg-gray-200"
          )}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-md relative">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-white dark:bg-gray-700 text-left border-b dark:border-gray-800">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-6 py-6 text-sm font-medium text-gray-700 dark:text-white text-right"
              >
                {col.header}
              </th>
            ))}
            {showActions && (
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-white text-right">
                اقدامات
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 text-sm text-right ${
                    col.cellClassName
                      ? col.cellClassName(row)
                      : "text-gray-800 dark:text-gray-300 dark:text-shelfish"
                  }`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row as any)[col.accessor]}
                </td>
              ))}
              {showActions && (
                <td className="px-6 py-4 text-sm text-gray-800 space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="w-full flex items-center justify-between px-4 bg-white dark:bg-gray-800 py-6">
          <Button
            variant="outline"
            size="lg"
            disabled={currentPage === 1}
            onClick={() => {
              if (currentPage > 1) {
                onPageChange?.(currentPage - 1);
              }
            }}
          >
            قبلی
          </Button>

          <div className="flex items-center gap-1">{renderPageNumbers()}</div>

          <Button
            variant="outline"
            size="lg"
            disabled={currentPage === totalPages + 1}
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange?.(currentPage + 1);
              }
            }}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}

export default Table;
