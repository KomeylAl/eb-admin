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
