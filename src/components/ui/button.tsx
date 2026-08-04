import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-charcoal-900 text-cream-50 hover:bg-charcoal-800 dark:bg-luxury-500 dark:text-charcoal-950 dark:hover:bg-luxury-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
        luxury:
          "luxury-gradient text-charcoal-950 hover:scale-105 active:scale-95 shadow-luxury hover:shadow-luxury-lg font-semibold",
        outline:
          "border-2 border-border text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        link: "text-primary  underline-offset-4 hover:underline hover:text-primary ",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

export default Button;
