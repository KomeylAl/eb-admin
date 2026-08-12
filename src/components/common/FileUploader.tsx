import { useState } from "react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  images?: any[];
  allowMultiple?: boolean;
  className?: string;
  disabled?: boolean;
}

function imageSrc(image: any): string {
  return image?.url || image?.img_path || image?.file_path || "";
}

export default function FileUploader({
  onFilesSelected,
  images = [],
  allowMultiple = true,
  className,
  disabled = false,
}: FileUploaderProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));

    if (allowMultiple) {
      setSelectedImages(imageUrls);
      onFilesSelected(imageFiles);
    } else if (imageFiles.length > 0) {
      setSelectedImages([imageUrls[0]]);
      onFilesSelected([imageFiles[0]]);
    }
  };

  return (
    <div className={`flex items-start mt-4 gap-4 ${className ?? ""}`}>
      {!disabled && (
        <label
          htmlFor="file-input"
          className="w-52 h-52 flex items-center justify-center border-2 border-dashed border-blue-500 rounded-lg bg-gray-50 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition dark:bg-gray-900"
        >
          انتخاب تصاویر
        </label>
      )}
      <input
        type="file"
        id="file-input"
        accept="image/png, image/jpeg, image/webp"
        multiple={allowMultiple}
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />
      <div className="grid grid-cols-2 gap-4">
        {selectedImages.length
          ? selectedImages.map((image, index) => (
              <div
                key={`selected-${index}`}
                className="w-24 h-24 border rounded overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          : images.map((image: any, index: number) => {
              const src = imageSrc(image);
              if (!src) return null;
              return (
                <div
                  key={image.id ?? index}
                  className="w-24 h-24 border rounded overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Record ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
}
