import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-white hover:bg-slate-850",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-transparent bg-red-100 text-red-800 border-red-200",
        outline: "text-slate-950 border-slate-200",
        success:
          "border-[#09C899]/30 bg-[#09C899]/10 text-[#0AA793]",
        warning:
          "border-[#FBAE0C]/30 bg-[#FBAE0C]/10 text-[#F78424]",
        blue:
          "border-[#099BE9]/30 bg-[#099BE9]/10 text-[#099BE9]",
        purple:
          "border-[#8647E2]/30 bg-[#8647E2]/10 text-[#8647E2]",
        algoBlue:
          "border-[#099BE9]/30 bg-[#099BE9]/10 text-[#099BE9]",
        algoTeal:
          "border-[#09C899]/30 bg-[#09C899]/10 text-[#0AA793]",
        algoPurple:
          "border-[#8647E2]/30 bg-[#8647E2]/10 text-[#8647E2]",
        algoOrange:
          "border-[#FBAE0C]/30 bg-[#FBAE0C]/10 text-[#F78424]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
