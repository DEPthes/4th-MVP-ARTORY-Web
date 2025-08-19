import { useEffect, useId } from "react";

type Props = {
  open: boolean;
  title: string;
  cancelText?: string;
  confirmText?: string;
  destructive?: boolean; // 삭제 등 위험 액션이면 true
  onClose: () => void; // 바깥 클릭/ESC/취소
  onConfirm: () => void; // 확인/삭제
  className?: string; // (선택) 추가 클래스
};

const ConfirmModal = ({
  open,
  title,
  cancelText = "취소",
  confirmText = "삭제",
  destructive = true,
  onClose,
  onConfirm,
  className,
}: Props) => {
  const titleId = useId();

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={[
          // 카드
          "w-full max-w-md mx-4  bg-white shadow-xl border border-gray-200",
          // 살짝 등장 애니메이션
          "transition-transform duration-150 ease-out motion-safe:scale-100 motion-reduce:transition-none",
          className || "",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단: 제목 */}
        <div className="px-8 pt-8 pb-6">
          <h3 id={titleId} className="text-xl font-semibold text-center">
            {title}
          </h3>
        </div>

        {/* 구분선 */}
        <div className="border-t border-neutral-200" />

        {/* 하단 2분할 버튼 (세로선은 divide-x로 처리) */}
        <div className="flex divide-x divide-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-5 text-lg text-gray-500 hover:bg-gray-50 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-5 text-lg hover:bg-gray-50 hover:cursor-pointer focus:outline-none focus:ring-2 ${
              destructive
                ? "text-rose-600 focus:ring-rose-200"
                : "text-blue-600 focus:ring-blue-200"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
