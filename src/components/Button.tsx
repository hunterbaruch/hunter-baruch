import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark shadow-sm",
  secondary:
    "bg-primary text-white hover:bg-primary-light shadow-sm",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
