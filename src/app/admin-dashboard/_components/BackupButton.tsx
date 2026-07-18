import { ArrowLeft } from "lucide-react";
import { PuffLoader } from "react-spinners";

interface BackupButtonProps {
  text: string;
  isLoading: boolean;
  backupFn: () => void;
}

const BackupButton = ({ text, isLoading, backupFn }: BackupButtonProps) => {
  return (
    <div className="w-full flex items-center justify-between">
      <p>{text}</p>
      {isLoading ? (
        <PuffLoader size={20} className="text-blue-700" />
      ) : (
        <ArrowLeft
          size={20}
          className={`text-blue-700 ${
            isLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => backupFn()}
        />
      )}
    </div>
  );
};

export default BackupButton;
