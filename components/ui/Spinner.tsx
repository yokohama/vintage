"use client";

interface SpinnerProps {
  title?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const Spinner = ({
  size = "md",
  text = "読込中",
  className = "",
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex justify-center items-center h-64 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-[#7a6b59]`}
        ></div>
        {text && (
          <div className="absolute inset-0 flex items-center justify-center text-[#5c4d3c] font-serif">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Spinner;
