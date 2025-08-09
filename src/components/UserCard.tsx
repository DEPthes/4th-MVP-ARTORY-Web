import {
  UserJobDescription,
  UserJobImages,
  type UserJobType,
} from "../types/user";
import { cn } from "../utils/classname";
import Checkbox from "./Checkbox/Checkbox";

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

  const handleCheckboxChange = () => {
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
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              label=""
              checked={isSelected}
              onChange={handleCheckboxChange}
            />
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
