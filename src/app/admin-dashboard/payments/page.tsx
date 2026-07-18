"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { useCallback, useState } from "react";
import { usePayments } from "@/hooks/usePayments";
import { debounce } from "lodash";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { paymentColumns } from "@/lib/columns";

const Payments = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = usePayments(
    page,
    pageSize,
    search
  );

  const debouncedSearch = useCallback(
    debounce((text) => {
      refetch();
    }, 300),
    [refetch]
  );

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={onSearchChange} isShowSearch />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl">پرداخت ها</h2>
            <Link
              href="/admin/invoices"
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              فاکتور ها
            </Link>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            {isLoading && <PuffLoader size={60} color="#3e86fa" />}

            {error && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-rose-500">خطا در دریافت اطلاعات</p>
              </div>
            )}

            {data && (
              <Table
                data={data.data}
                columns={paymentColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
