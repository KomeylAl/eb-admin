export type MediaItem = {
  id: string;
  disk: string;
  path: string;
  collection: string;
  folder_id: string | null;
  original_name: string;
  name: string;
  mime: string | null;
  size: number;
  visibility: string;
  url: string;
  is_image: boolean;
  created_at?: string;
};

export type MediaFolder = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
};

export type MediaCollection = {
  key: string;
  label: string;
  max_kb?: number;
  extensions?: string[];
};

export async function prepareImageUpload(file: File): Promise<File> {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const type = (file.type || "").toLowerCase();

  if (
    ext === "heic" ||
    ext === "heif" ||
    type === "image/heic" ||
    type === "image/heif"
  ) {
    throw new Error(
      "فرمت HEIC آیفون پشتیبانی نمی‌شود. عکس را به JPG یا PNG تبدیل کنید."
    );
  }

  const isImage =
    type.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext);

  if (!isImage || type === "image/gif" || ext === "gif") {
    return file;
  }

  if (file.size <= 2 * 1024 * 1024) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1920;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
