import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "positive" | "negative" | "neutral";
  trendValue?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-lg border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between transition-all hover:border-slate-300",
        className
      )}
    >
      <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">
        {label}
      </div>
      <div className="my-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {trendValue && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded font-mono",
              trend === "positive" && "bg-emerald-50 text-emerald-700",
              trend === "negative" && "bg-red-50 text-red-700",
              trend === "neutral" && "bg-slate-100 text-slate-700"
            )}
          >
            {trendValue}
          </span>
        )}
      </div>
      {subtext && (
        <div className="text-xs text-slate-400 font-medium">{subtext}</div>
      )}
    </div>
  );
}
