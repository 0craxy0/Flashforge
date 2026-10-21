import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    default: "bg-zinc-100 text-zinc-900 hover:bg-white shadow-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
    secondary: "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700",
    outline: "border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 hover:border-zinc-700",
    ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
    destructive: "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20",
  }[variant];

  const sizeStyles = {
    default: "h-9 px-3.5 py-2 text-xs",
    sm: "h-8 rounded-md px-2.5 text-xs",
    lg: "h-10 rounded-md px-6 text-sm",
    icon: "h-8 w-8 rounded-md",
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
