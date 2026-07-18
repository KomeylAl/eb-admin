import { Button } from "../ui/button";

interface DeleteModalProps {
  onCancel: () => void;
  isDeleting: boolean;
  deleteFn: () => void;
  description?: string;
}

const DeleteModal = ({
  onCancel,
  isDeleting,
  deleteFn,
  description,
}: DeleteModalProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-between p-10 space-y-4">
      <p className="text-lg">آیا از حذف این مورد اطمینان دارید؟</p>
      <p className="text-sm">{description}</p>
      <div className="w-full flex items-center justify-end gap-4">
        <Button
          variant="destructive"
          disabled={isDeleting}
          size="lg"
          className={`cursor-pointer ${
            isDeleting ? "bg-rose-400" : "bg-rose-600"
          }`}
          onClick={deleteFn}
        >
          {isDeleting ? "در حال حذف..." : "حذف"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="cursor-pointer"
          onClick={onCancel}
        >
          بازگشت
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
