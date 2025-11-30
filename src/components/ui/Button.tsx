
import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    
    // Variant Styles
    const variants = {
      default: "bg-cb-primary text-cb-navy hover:bg-cb-primary-soft shadow-cb-button hover:shadow-cb-glow border border-transparent",
      destructive: "bg-red-900/80 text-white hover:bg-red-800 border border-red-500/30",
      outline: "bg-transparent border border-white/20 text-cb-text hover:bg-white/5 hover:border-cb-primary/50 hover:text-cb-primary",
      secondary: "bg-white/10 text-cb-text hover:bg-white/20 border border-white/5",
      ghost: "hover:bg-white/5 text-cb-text hover:text-white",
      link: "text-cb-primary underline-offset-4 hover:underline",
    };

    // Size Styles
    const sizes = {
      default: "h-11 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-14 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium font-raleway ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
