import { Button } from "./button";
import { siteConfig } from "@/lib/config/siteConfig";

type ButtonProps = {
  label: string;
  className?: string;
  onClick?: () => void;
};

export function AddButton({ label, className, onClick }: ButtonProps) {
  return (
    <Button variant="default" size="sm" className={className} onClick={onClick}>
      <svg
        xmlns={siteConfig.svg.xmlns}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-1"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      {label}
    </Button>
  );
}
