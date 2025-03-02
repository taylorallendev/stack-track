import { cn } from "~/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <svg
      width="240"
      height="336"
      viewBox="0 0 240 336"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
    >
      {children}
    </svg>
  );
}
