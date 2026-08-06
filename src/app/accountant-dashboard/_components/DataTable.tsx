import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DataTable({
  columns,
  data,
  isLoading,
  emptyMessage = "داده‌ای یافت نشد",
  onRowClick,
  className,
}: {
  columns: {
    header: string;
    accessor?: string;
    render?: (row: any) => React.ReactNode;
    className?: string;
    cellClassName?: string;
  }[];
  data: any[];
  isLoading: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
  className?: string;
}) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden",
          className
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider"
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center",
          className
        )}
      >
        <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider py-4",
                  col.className
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIdx) => (
            <TableRow
              key={row.id || rowIdx}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition-colors border-slate-100 dark:border-slate-800",
                onRowClick &&
                  "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}
            >
              {columns.map((col, colIdx) => (
                <TableCell
                  key={colIdx}
                  className={cn(
                    "py-4 text-slate-800 dark:text-slate-200",
                    col.cellClassName
                  )}
                >
                  {col.render ? col.render(row) : row[col.accessor!]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
