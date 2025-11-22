import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: "sm" | "md" | "lg" | "xl";
  }
>(({ className, src, alt, fallback, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-primary/10 overflow-hidden",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || ""}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold">
          {fallback?.charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };

