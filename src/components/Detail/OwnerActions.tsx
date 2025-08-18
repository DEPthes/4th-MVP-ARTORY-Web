// src/components/Detail/OwnerActions.tsx
type OwnerActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
};

const OwnerActions = ({ onEdit, onDelete, className }: OwnerActionsProps) => {
  return (
    <div className={`flex justify-end gap-4 ${className ?? ''}`}>
      <button
        type="button"
        onClick={onEdit}
        className="text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full px-3 py-1.5 hover:cursor-pointer"
      >
        수정
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full px-3 py-1.5 hover:cursor-pointer"
      >
        삭제
      </button>
    </div>
  );
};

export default OwnerActions;
