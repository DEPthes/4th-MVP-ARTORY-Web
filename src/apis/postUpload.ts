import type { EditorType } from "../types/post";
import type { UploadedImage } from "../types/post";

const API_BASE =
  import.meta.env.MODE === "development"
    ? ""
    : import.meta.env.VITE_API_BASE_URL ?? "";

const typeToPostType = (t: EditorType) =>
  t === "work" ? "ART" : t === "exhibition" ? "EXHIBITION" : "CONTEST";

export async function compressToFile(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bmp.width);
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob 실패"))),
      "image/jpeg",
      quality
    )
  );

  const name =
    file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")
      ? file.name
      : file.name.replace(/\.[^/.]+$/, "") + ".jpg";

  return new File([blob], name, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

const normUrlList = (url?: string | string[]) => {
  if (!url) return [] as string[];
  if (Array.isArray(url)) return url.filter(Boolean);
  return url
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

export async function createPostUpload(params: {
  type: EditorType;
  title: string;
  description?: string;
  url?: string | string[];
  images: UploadedImage[];
  tagIds?: number[];
}) {
  const googleID = localStorage.getItem("googleID") || "";
  if (!googleID) throw new Error("로그인이 필요해요(googleID 없음)");

  const fd = new FormData();

  for (const img of params.images) {
    if (!img.file) continue;
    let f = img.file;
    try {
      f = await compressToFile(img.file, 1200, 0.8);
    } catch {
      // 압축 실패시 원본 사용
    }
    fd.append("images", f, f.name);
  }

  // 텍스트 필드
  fd.append("title", params.title.trim());
  fd.append("description", params.description ?? "");
  fd.append("postType", typeToPostType(params.type));

  const urls = normUrlList(params.url);
  for (const u of urls) fd.append("url", u);

  if (params.tagIds && params.tagIds.length) {
    for (const id of params.tagIds) fd.append("tagIDs", String(id));
  }

  // 디버그용 출력
  // for (const [k, v] of fd.entries()) {
  //   console.log(k, v instanceof File ? `(file) ${v.name} ${v.type} ${v.size}` : v);
  // }

  const res = await fetch(
    `${API_BASE}/api/post/upload?googleID=${encodeURIComponent(googleID)}`,
    {
      method: "POST",
      body: fd,
      credentials: "include",
    }
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `게시물 등록 실패 (status ${res.status})`);
  }
  return res.json().catch(() => ({}));
}
