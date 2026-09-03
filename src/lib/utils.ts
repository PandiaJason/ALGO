import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatThroughput(opsSec: number | string): string {
  const num = typeof opsSec === "string" ? parseFloat(opsSec) : opsSec;
  if (isNaN(num)) return "—";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M ops/s`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K ops/s`;
  }
  return `${Math.round(num)} ops/s`;
}

export function formatLatency(ms: number | string): string {
  const num = typeof ms === "string" ? parseFloat(ms) : ms;
  if (isNaN(num)) return "—";
  if (num < 1) {
    return `${(num * 1000).toFixed(0)}µs`;
  }
  return `${num.toFixed(2)}ms`;
}
