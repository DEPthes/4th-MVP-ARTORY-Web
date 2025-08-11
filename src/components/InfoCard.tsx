import { UserJobImages, type UserJobType } from "../types/user";
import { cn } from "../utils/classname";
import { RxDotFilled } from "react-icons/rx";

export interface InfoCardProps {
  job: UserJobType;
  nickname?: string;
  profileImage?: string;
  description1?: string;
  description2?: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  job,
  nickname,
  description1,
  description2,
  className,
}) => {
  const imageSrc = UserJobImages[job];

  return (
    <div
      className={cn(
        "w-full flex flex-col bg-gray-100 rounded-lg transition-all",
        className
      )}
    >
      <div className="flex flex-col flex-1 items-start px-10 py-8 gap-14">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="font-semibold text-xl text-zinc-900">{job}</div>
            {nickname && (
              <div className="text-sm text-zinc-600 mt-1">{nickname}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-zinc-900 text-xl mb-10">
          <div className="flex items-center gap-2  px-6">
            <RxDotFilled className="size-5" />
            {description1}
          </div>
          <div className="flex items-center gap-2 px-6">
            <RxDotFilled className="size-5" />
            {description2}
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <img src={imageSrc} alt={job} className="w-full h-auto rounded-b-lg" />
      </div>
    </div>
  );
};

export default InfoCard;
