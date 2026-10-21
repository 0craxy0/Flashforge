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
    default: "border-transparent bg-zinc-100 text-zinc-900 shadow-sm",
    secondary: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700",
    outline: "border-zinc-700/80 text-zinc-300 hover:border-zinc-500",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15",
    destructive: "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15",
  }[variant];

  return (
    <div
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium font-mono transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-zinc-400 select-none ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
