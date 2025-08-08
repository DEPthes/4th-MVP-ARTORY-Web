import {
  UserJobDescription,
  UserJobImages,
  type UserJobType,
} from "../types/user";
import { cn } from "../utils/classname";

export interface UserCardProps {
  job: UserJobType;
  onSelect?: (job: UserJobType) => void;
  isSelected?: boolean;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  job,
  onSelect,
  isSelected = false,
  className,
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(job);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(job);
    }
  };

  const description = UserJobDescription[job];
  const imageSrc = UserJobImages[job];

  return (
    <div
      className={cn(
        "w-full flex flex-col border-2 border-gray-100 bg-gray-100 rounded-lg cursor-pointer transition-all",
        className,
        isSelected
          ? "border-2 border-red-600"
          : "hover:bg-red-200 hover:border-red-200"
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col flex-1 items-start px-10 py-8 gap-14">
        <div className="flex items-center gap-4">
          {/* 커스텀 체크박스 */}
          <div className="relative">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <div
              className={`size-6 rounded-[0.3rem] border-2 flex items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-red-600 border-red-600"
                  : "bg-neutral-200 border-neutral-200"
              }`}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M2 10.1004L8.15833 16.1004L18 4.90039"
                    stroke="white"
                    stroke-width="1.8"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="font-semibold text-xl text-zinc-900">{job}</div>
        </div>
        <div className="text-zinc-900 text-xl px-6 text-center">
          {description}
        </div>
      </div>
      <div className="flex justify-center w-full">
        <img src={imageSrc} alt={job} className="w-full h-auto rounded-b-lg" />
      </div>
    </div>
  );
};

export default UserCard;
