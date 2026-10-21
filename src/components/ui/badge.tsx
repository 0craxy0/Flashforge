import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-zinc-100 text-zinc-900",
    secondary: "border-zinc-800 bg-zinc-900 text-zinc-300",
    outline: "border-zinc-700/80 text-zinc-300",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    destructive: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  }[variant];

  return (
    <div
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium font-mono transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
