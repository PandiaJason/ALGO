"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Loader2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeWishlist() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join wishlist");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/90">
      <div className="relative rounded-3xl bg-[#18181b] border border-neutral-800 text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#09C899]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#099BE9]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/10 text-[#09C899] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#09C899]" />
            <span>// ACCESS WISHLIST • PROVING GROUND</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Join the Wishlist &amp; Send a DM
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed max-w-xl mx-auto">
            Want early access to build and benchmark real infrastructure? Submit your email and send a direct message to Jason. Your request will be queued in the admin control panel and reviewed directly.
          </p>
        </div>

        <div className="relative z-10 max-w-xl mx-auto mt-8">
          {isSubmitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-[#09C899]/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#09C899]/20 border border-[#09C899]/40 flex items-center justify-center mx-auto text-[#09C899]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                You&apos;re queued in the Wishlist!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                Thank you for reaching out. Your email <strong className="text-white font-mono">{email}</strong> and direct message have been queued in the admin control panel and mailed directly to <strong className="text-white font-mono">pandiajason@gmail.com</strong>.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                    setMessage("");
                  }}
                  className="text-xs border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  Submit Another Request
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#099BE9]" />
                  <span>Your Email Address</span>
                  <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@systems.io"
                  className="w-full px-4 py-3 rounded-xl bg-[#222226] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#09C899] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#09C899]" />
                  <span>Direct Message to Jason (DM)</span>
                  <span className="text-neutral-500 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What systems are you building? (e.g. Distributed KV store, lock-free ring buffers, custom kernel sandboxes, or hiring assessment needs)"
                  className="w-full px-4 py-3 rounded-xl bg-[#222226] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#09C899] transition-colors resize-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full h-12 rounded-xl bg-[#09C899] hover:bg-[#0AA793] text-white font-bold text-sm shadow-lg shadow-[#09C899]/20 transition-all active:scale-[0.99] gap-2 flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Queueing in Wishlist...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Join Wishlist &amp; Send DM</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono px-1">
                <span>// Queued in Admin Control Panel</span>
                <span>Mailed to Jason Pandian</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
