import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import TagSelector from "../components/Form/TagSelector";
import ImageUploader from "../components/Form/ImageUploader";
import TextInput from "../components/Form/TextInput";
import TextArea from "../components/Form/TextArea";
import type {
  EditorForm,
  EditorMode,
  EditorType,
  UploadedImage,
} from "../types/post";
import { Header } from "../components";
import BackNavigate from "../components/Layouts/BackNavigate";
import Button from "../components/Button/Button";

import { createPostUpload } from "../apis/postUpload";
import { postChangeApi } from "../apis/postChange";
import { tagApi } from "../apis";

// 타입 가드(허용값 외 접근 시 홈으로 보냄)
const isValidType = (t: string | undefined): t is EditorType =>
  t === "work" || t === "exhibition" || t === "contest";

const editorTypeToTabId: Record<
  EditorType,
  "works" | "exhibition" | "contest"
> = {
  work: "works",
  exhibition: "exhibition",
  contest: "contest",
};

export default function PostEditorPage({ mode }: { mode: EditorMode }) {
  const { type: rawType, id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state } = useLocation() as { state?: Partial<EditorForm> };

  const [submitting, setSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState<{ id: number; label: string }[]>(
    []
  );

  const type = useMemo<EditorType | null>(() => {
    if (!isValidType(rawType)) return null;
    return rawType;
  }, [rawType]);

  const [form, setForm] = useState<EditorForm>({
    images: [] as UploadedImage[],
    title: "",
    url: "",
    description: "",
    tags: [] as string[],
  });

  const isValid = useMemo(
    () =>
      form.title.trim().length > 0 &&
      form.images.length > 0 &&
      form.tags.length > 0,
    [form.title, form.images.length, form.tags.length]
  );

  // 태그 목록 가져오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await tagApi.getTagList();
        const list = res.data || [];
        const opts = list.map((t) => ({ id: t.id, label: t.name }));
        if (mounted) setTagOptions(opts);
      } catch (e) {
        console.error("태그 조회 실패", e);
        if (mounted) setTagOptions([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // label → id 매핑
  const labelToId = useMemo(
    () => Object.fromEntries(tagOptions.map((t) => [t.label, t.id])),
    [tagOptions]
  );

  // 수정 모드 프리필(필요 시)
  useEffect(() => {
    if (mode === "edit" && state) {
      console.log("📝 수정 모드 데이터 로드:", state);
      setForm((s) => ({ ...s, ...state }));
    }
  }, [mode, state]);

  useEffect(() => {
    if (!type) navigate("/", { replace: true });
  }, [type, navigate]);

  const onSubmit = async () => {
    if (!isValid || !type) return;
    setSubmitting(true);

    try {
      // 서버 스펙: list<MultipartFile> → 파일 있는 항목만 전송
      const imagesOnlyFile = form.images.filter((i) => !!i.file);

      // 문자열 태그 → 숫자 ID 변환(매핑 실패 항목은 제외)
      const tagIds = form.tags
        .map((label) => labelToId[label])
        .filter((v): v is number => Number.isFinite(v));

      const urlInput: string = form.url ?? "";
      const myGoogleId = localStorage.getItem("googleID") || "";

      if (mode === "edit" && id) {
        // 수정 모드: 기존 로직
        await postChangeApi.changePost(
          { postID: Number(id), googleID: myGoogleId },
          {
            type: type as EditorType,
            title: form.title,
            description: form.description || "",
            url: urlInput,
            images: imagesOnlyFile,
            tagIds,
          }
        );

        // 수정 성공 후 관련된 모든 쿼리 무효화
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return (
              // 사용자 게시물 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "userPosts") ||
              // 메인 게시물 목록 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "mainPost") ||
              // 검색 결과 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "search") ||
              // 아카이브 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "userArchive") ||
              // 컬렉션 상세 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "collectionDetail")
            );
          },
        });

        const detailPath = `/collection/${id}`;
        navigate(detailPath, { replace: true });
      } else {
        // 생성 모드: 기존 로직
        await createPostUpload({
          type: type as EditorType,
          title: form.title,
          description: form.description,
          url: urlInput,
          images: imagesOnlyFile,
          tagIds,
        });

        const tab = editorTypeToTabId[type];
        const profilePath = myGoogleId
          ? `/profile/${myGoogleId}`
          : "/profile/me";

        // 생성 성공 후 관련된 모든 쿼리 무효화
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return (
              // 사용자 게시물 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "userPosts") ||
              // 메인 게시물 목록 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "mainPost") ||
              // 검색 결과 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "search") ||
              // 아카이브 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "userArchive")
            );
          },
        });

        navigate(`${profilePath}?tab=${tab}`, {
          replace: true,
          state: { initialTabId: tab, from: "post-create" },
        });
      }
    } catch (e: unknown) {
      console.error(e);
      const action = mode === "edit" ? "수정" : "등록";
      const errorMessage =
        e instanceof Error
          ? e.message
          : `게시물 ${action} 중 오류가 발생했어요`;
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
            options={tagOptions.map((t) => t.label)}
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
