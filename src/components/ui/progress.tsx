import React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)} {...props} ref={ref}>
        <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    );
  },
);
Progress.displayName = "Progress";
