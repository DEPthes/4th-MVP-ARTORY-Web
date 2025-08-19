// src/components/Detail/OwnerActions.tsx
type OwnerActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
};

const OwnerActions = ({ onEdit, onDelete, className }: OwnerActionsProps) => {
  return (
    <div className={`flex justify-end gap-4 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onEdit}
        className="text-xl text-zinc-900 hover:bg-gray-50 rounded-full px-3 py-1.5 cursor-pointer"
      >
        수정
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-xl text-red-600 hover:bg-red-50 rounded-full px-3 py-1.5 cursor-pointer"
      >
        삭제
      </button>
    </div>
  );
};

export default OwnerActions;
