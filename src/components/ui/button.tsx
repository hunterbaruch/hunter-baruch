import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={cn("inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium", className)} {...props}>
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export { Button as default };
