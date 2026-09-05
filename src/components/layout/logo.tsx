import React from "react";
import Link from "next/link";
import { AlgoLogoIcon } from "./algo-logo-icon";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textColor?: string;
  textClassName?: string;
  useFourColours?: boolean;
}

export function Logo({
  size = 32,
  showText = true,
  className = "",
  textColor,
  textClassName = "",
  useFourColours = true,
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
        useFourColours ? (
          <span className={`font-black tracking-wider text-lg inline-flex items-center gap-[0.5px] ${textClassName}`}>
            <span className="text-[#099BE9] transition-transform duration-150 group-hover:translate-y-[-1px]">A</span>
            <span className="text-[#09C899] transition-transform duration-150 group-hover:translate-y-[-1px]">L</span>
            <span className="text-[#8647E2] transition-transform duration-150 group-hover:translate-y-[-1px]">G</span>
            <span className="text-[#F78424] transition-transform duration-150 group-hover:translate-y-[-1px]">O</span>
          </span>
        ) : (
          <span className={`font-black tracking-wider text-lg transition-colors ${textColor || "text-slate-900"} ${textClassName}`}>
            ALGO
          </span>
        )
      )}
    </Link>
  );
}
