import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, className = "", ...props },
  ref,
) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={[
          "w-full border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100",
          "placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-300/30",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-400/30" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
});
