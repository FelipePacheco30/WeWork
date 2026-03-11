import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-900 text-white hover:bg-brand-700 focus-visible:ring-brand-900/35 shadow-panel",
  secondary:
    "bg-white text-brand-900 border border-brand-300 hover:bg-brand-50 focus-visible:ring-brand-700/35",
  ghost: "bg-transparent text-brand-900 hover:bg-brand-50 focus-visible:ring-brand-700/30",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/35",
};

export function Button({ variant = "primary", className = "", leftIcon, children, ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
        "transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClassMap[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
