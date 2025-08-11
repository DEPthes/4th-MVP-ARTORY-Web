import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/classname";

export interface BackNavigateProps {
  pathname: string;
  text: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const BackNavigate: React.FC<BackNavigateProps> = ({
  pathname,
  text,
  variant = "primary",
  className,
}) => {
  const navigate = useNavigate();

  const variantClasses = {
    primary: "bg-stone-800/60 text-white hover:bg-stone-900/60",
    secondary:
      "bg-[linear-gradient(90deg,#EAEBED_0%,#F4F5F6_28.37%)] text-zinc-900 hover:bg-gray-300",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        "w-full flex px-20 py-6",
        className
      )}
    >
      <button
        className="flex items-center gap-2 font-semibold text-xl cursor-pointer"
        onClick={() => navigate(pathname)}
      >
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.1665 2.16797L5.83317 10.5013L14.1665 18.8346"
            stroke={variant === "primary" ? "white" : "#1D1E20"}
            stroke-width="1.25"
          />
        </svg>
        {text}
      </button>
    </div>
  );
};

export default BackNavigate;
