import { cn } from "@/shared/utils/css";

interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: 24 | 32 | 48 | 64 | 96;
  className?: string;
}

export function LoadingSpinner({
  size = 32,
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Loading..."
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
