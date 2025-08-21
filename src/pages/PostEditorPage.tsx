import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TagSelector from "../components/Form/TagSelector";
import ImageUploader from "../components/Form/ImageUploader";
import TextInput from "../components/Form/TextInput";
import TextArea from "../components/Form/TextArea";
import type { EditorForm, EditorMode, EditorType } from "../types/post";
import { Header } from "../components";
import BackNavigate from "../components/Layouts/BackNavigate";
import Button from "../components/Button/Button";

// 타입 가드(허용값 외 접근 시 홈으로 보냄)
const isValidType = (t: string | undefined): t is EditorType =>
  t === "work" || t === "exhibition" || t === "contest";

export default function PostEditorPage({ mode }: { mode: EditorMode }) {
  const { type: rawType, id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: Partial<EditorForm> };
  const [submitting, setSubmitting] = useState(false);

  const TAG_OPTIONS = [
    "회화",
    "조각",
    "공예",
    "건축",
    "사진",
    "미디어아트",
    "인테리어",
    "기타",
  ];

  const type = useMemo<EditorType | null>(() => {
    if (!isValidType(rawType)) return null;
    return rawType;
  }, [rawType]);

  const [form, setForm] = useState<EditorForm>({
    images: [] as { id: string; url: string; file?: File; isCover: boolean }[],
    title: "",
    url: "",
    description: "",
    tags: [] as string[],
  });

  // 수정 모드
  useEffect(() => {
    if (mode === "edit") {
      // const data = await getPostDetail(...);
      // setForm(s => ({ ...s, tags: data.tags ?? [] }));
    }
  }, [mode]);

  useEffect(() => {
    if (!type) {
      // 타입이 이상하면 홈으로
      navigate("/", { replace: true });
    }
  }, [type, navigate]);

  const onSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      // TODO: API 연동 시 여기서 호출
      await new Promise((r) => setTimeout(r, 600)); // 임시 딜레이
      if (mode === "create") {
        // 생성 후 이동
        navigate("/profile/me");
      } else {
        // 수정 후 이동
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = useMemo(
    () =>
      form.title.trim().length > 0 &&
      form.images.length > 0 &&
      form.tags.length > 0,
    [form.title, form.images.length, form.tags.length]
  );

  return (
    <div className="flex flex-col items-center">
      <Header />
      <BackNavigate
        back
        text={mode === "create" ? "게시물 등록" : "게시물 수정"}
        variant="secondary"
      />
      <div className="mx-auto max-w-5xl px-4 mt-20 my-40">
        <ImageUploader
          value={form.images}
          onChange={(v) => setForm((s) => ({ ...s, images: v }))}
        />

        <div className="flex flex-col gap-10">
          <TextInput
            placeholder="해당 게시물과 관련된 URL을 입력해주세요."
            value={form.url ?? ""}
            onChange={(v) => setForm((s) => ({ ...s, url: v }))}
          />

          <TextInput
            label="제목"
            required
            placeholder="작품명/전시 제목/공모전명 중 하나를 입력해주세요."
            value={form.title}
            onChange={(v) => setForm((s) => ({ ...s, title: v }))}
          />

          <TextArea
            label="설명"
            placeholder="작품/전시/공모전에 대한 설명을 입력해주세요."
            value={form.description ?? ""}
            onChange={(v) => setForm((s) => ({ ...s, description: v }))}
          />

          <TagSelector
            options={TAG_OPTIONS}
            value={form.tags}
            onChange={(next) => setForm((s) => ({ ...s, tags: next }))}
            selectMode="multi"
            required
          />
        </div>

        <div className="mt-30 flex justify-center gap-5">
          <Button
            variant="neutral"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-55.5"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!isValid}
            loading={submitting}
            onClick={onSubmit}
            className="w-55.5"
          >
            {mode === "create" ? "등록" : "수정"}
          </Button>
        </div>
      </div>
    </div>
  );
}
