"use client";

import Table from "@/components/common/Table";
import { usePosts } from "@/hooks/usePosts";
import { postColumns } from "@/lib/columns";
import React, { useState } from "react";
import { PuffLoader } from "react-spinners";
import Link from "next/link";
import Header from "@/components/layout/Header";

const Posts = () => {
  const [page, setPage] = useState(1); // API page از 0 شروع میشه
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [item, setItem] = useState();
  const [id, setId] = useState("");

  const { data, isLoading, error, refetch } = usePosts(page, pageSize, search);
  console.log(data);
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl">مطالب</h2>
            <Link
              href={"/dashboard/posts/create"}
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              افزودن مطلب
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
                columns={postColumns}
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

export default Posts;
