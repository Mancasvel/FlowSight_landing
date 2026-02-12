import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        "bg-gradient-to-r from-primary-cyan to-primary-teal text-secondary-navy hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5":
                            variant === "primary",
                        "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20":
                            variant === "secondary",
                        "border-2 border-primary-cyan text-primary-cyan hover:bg-primary-cyan/10":
                            variant === "outline",
                        "text-slate-400 hover:text-white": variant === "ghost",
                        "px-4 py-2 text-sm": size === "sm",
                        "px-6 py-3 text-base": size === "md",
                        "px-8 py-4 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
