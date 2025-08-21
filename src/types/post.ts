export type EditorType = "work" | "exhibition" | "contest";
export type EditorMode = "create" | "edit";

export interface UploadedImage {
  id: string;
  file?: File;
  url: string;
  isCover: boolean;
}

export interface EditorForm {
  images: UploadedImage[];
  title: string;
  url?: string;
  description?: string;
  tags: string[];
}
