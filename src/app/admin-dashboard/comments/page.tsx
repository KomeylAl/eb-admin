"use client";

import {
  useApproveComment,
  useComments,
  useDeleteComment,
  useUnapproveComment,
} from "@/hooks/useComments";
import { useModal } from "@/hooks/useModal";
import { debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { commentsColumns } from "@/lib/columns";
import toast from "react-hot-toast";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CommentsAdminPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [approved, setApproved] = useState("");
  const [commentableType, setCommentableType] = useState("");
  const [commentId, setCommentId] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useComments(
    page,
    pageSize,
    search,
    approved,
    commentableType
  );

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(
    () => {
      closeDelete();
      refetch();
    }
  );

  const onModerationSuccess = () => {
    setLoadingId(null);
    refetch();
  };

  const { mutate: approveComment, isPending: isApproving } = useApproveComment(
    onModerationSuccess
  );
  const { mutate: unapproveComment, isPending: isUnapproving } =
    useUnapproveComment(onModerationSuccess);

  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const debouncedSearch = useCallback(
    debounce(() => {
      refetch();
    }, 300),
    [refetch]
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    debouncedSearch();
  };

  const columns = useMemo(
    () =>
      commentsColumns(
        (id) => {
          setLoadingId(id);
          approveComment(id);
        },
        (id) => {
          setLoadingId(id);
          unapproveComment(id);
        },
        isApproving || isUnapproving,
        loadingId
      ),
    [approveComment, unapproveComment, isApproving, isUnapproving, loadingId]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={onSearchChange} isShowSearch />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-2xl">مدیریت نظرات</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                dir="rtl"
                value={approved || "all"}
                onValueChange={(v) => {
                  setApproved(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="true">تأیید شده</SelectItem>
                  <SelectItem value="false">در انتظار</SelectItem>
                </SelectContent>
              </Select>

              <Select
                dir="rtl"
                value={commentableType || "all"}
                onValueChange={(v) => {
                  setCommentableType(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="نوع هدف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه اهداف</SelectItem>
                  <SelectItem value="doctor">درمانگر</SelectItem>
                  <SelectItem value="post">مقاله</SelectItem>
                  <SelectItem value="workshop">کارگاه</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                data={data.data ?? []}
                columns={columns}
                currentPage={data.meta?.current_page ?? page}
                pageSize={data.meta?.per_page ?? pageSize}
                showActions
                totalItems={data.meta?.total ?? 0}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
                onDelete={(item: any) => {
                  setCommentId(item.id);
                  openDelete();
                }}
                onEdit={() =>
                  toast.error("برای ویرایش از تأیید / لغو تأیید استفاده کنید.")
                }
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteComment(commentId)}
          isDeleting={isDeleting}
          onCancel={() => closeDelete()}
        />
      </Modal>
    </div>
  );
};

export default CommentsAdminPage;
