import React from "react";
import Link from "next/link";
import { AlgoLogoIcon } from "./algo-logo-icon";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <AlgoLogoIcon
          size={size}
          className="transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      {showText && (
        <span className="font-semibold tracking-wider text-slate-900 text-lg group-hover:text-black transition-colors">
          ALGO
        </span>
      )}
    </Link>
  );
}
