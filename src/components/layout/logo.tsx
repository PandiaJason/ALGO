import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src="/logo.png"
          alt="ALGO Logo"
          width={size}
          height={size}
          style={{ width: `${size}px`, height: `${size}px` }}
          className="transition-transform duration-200 group-hover:scale-105"
          priority
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
