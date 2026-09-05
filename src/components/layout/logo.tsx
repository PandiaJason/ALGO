import React from "react";
import Link from "next/link";
import { AlgoLogoIcon } from "./algo-logo-icon";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textColor?: string;
  textClassName?: string;
}

export function Logo({
  size = 32,
  showText = true,
  className = "",
  textColor = "text-slate-900",
  textClassName = "",
}: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <AlgoLogoIcon
          size={size}
          className="transition-transform duration-200 group-hover:scale-105 drop-shadow-2xs"
        />
      </div>
      {showText && (
        <span
          className={`font-black tracking-wider text-lg transition-colors ${textColor} ${textClassName}`}
        >
          ALGO
        </span>
      )}
    </Link>
  );
}
