import * as React from "react";
import { Badge } from "./badge";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export type SubmissionStatus =
  | "QUEUED"
  | "RUNNING"
  | "TESTING"
  | "BENCHMARKING"
  | "COMPLETED"
  | "FAILED"
  | "TIMEOUT"
  | "ERROR";

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  switch (status) {
    case "QUEUED":
      return (
        <Badge variant="secondary" className="gap-1.5 font-normal">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Queued</span>
        </Badge>
      );
    case "RUNNING":
    case "TESTING":
    case "BENCHMARKING":
      return (
        <Badge variant="blue" className="gap-1.5 font-normal animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="capitalize">{status.toLowerCase()}</span>
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="success" className="gap-1.5 font-medium">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Verified</span>
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive" className="gap-1.5 font-medium">
          <XCircle className="w-3 h-3 text-red-600" />
          <span>Failed</span>
        </Badge>
      );
    case "TIMEOUT":
    case "ERROR":
      return (
        <Badge variant="warning" className="gap-1.5 font-medium">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span className="capitalize">{status.toLowerCase()}</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
