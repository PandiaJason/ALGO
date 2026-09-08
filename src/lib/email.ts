/**
 * Email notification utility for ALGO
 * Sends alerts for new wishlist requests and direct messages.
 */

const TARGET_EMAIL = "pandiajason@gmail.com";

interface WishlistEmailPayload {
  email: string;
  message?: string;
  submittedAt?: Date;
  ipAddress?: string;
}

export async function sendWishlistNotificationEmail({
  email,
  message,
  submittedAt = new Date(),
  ipAddress,
}: WishlistEmailPayload): Promise<{ sent: boolean; provider: string; error?: string }> {
  const subject = `🔥 [ALGO Wishlist] New Access Request & DM: ${email}`;
  const timestampStr = submittedAt.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  });

  const textContent = `
New Wishlist & Early Access Request on ALGO

Email: ${email}
Direct Message (DM): ${message ? message : "(No message provided)"}
Submitted At: ${timestampStr} (IST)
IP: ${ipAddress || "Unknown"}

---
Review and manage this applicant in your Admin Control Panel:
https://algo-by-jason.vercel.app/admin/whitelist
`.trim();

  const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #141416; color: #f3f4f6; border-radius: 12px; border: 1px solid #27272a;">
  <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
    <span style="font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #09C899;">// ACCESS NOTIFICATION</span>
    <h2 style="margin: 8px 0 0 0; font-size: 20px; color: #ffffff; font-weight: 800;">New ALGO Wishlist Request &amp; DM</h2>
  </div>

  <div style="background: #1c1c20; padding: 18px; border-radius: 8px; border: 1px solid #3f3f46; margin-bottom: 20px;">
    <div style="margin-bottom: 12px;">
      <span style="font-size: 12px; color: #a1a1aa; font-family: monospace; text-transform: uppercase;">Applicant Email:</span>
      <div style="font-size: 16px; font-weight: bold; color: #099BE9; font-family: monospace; margin-top: 4px;">${email}</div>
    </div>

    <div style="margin-bottom: 12px;">
      <span style="font-size: 12px; color: #a1a1aa; font-family: monospace; text-transform: uppercase;">Direct Message (DM):</span>
      <div style="font-size: 14px; color: #e4e4e7; background: #141416; padding: 12px; border-radius: 6px; border: 1px solid #27272a; margin-top: 4px; white-space: pre-wrap; line-height: 1.5;">${
        message ? message : '<span style="color: #71717a; font-style: italic;">No message provided</span>'
      }</div>
    </div>

    <div style="font-size: 12px; color: #71717a; font-family: monospace;">
      Submitted At: ${timestampStr}
    </div>
  </div>

  <div style="text-align: center; margin-top: 24px;">
    <a href="https://algo-by-jason.vercel.app/admin/whitelist" style="display: inline-block; background: #09C899; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-size: 13px; font-weight: bold;">
      Open Admin Wishlist Control →
    </a>
  </div>
</div>
`.trim();

  // 1. Try Resend API if RESEND_API_KEY is available
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ALGO Alerts <notifications@resend.dev>",
          to: [TARGET_EMAIL],
          subject,
          text: textContent,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        console.log(`[Email] Wishlist notification successfully sent to ${TARGET_EMAIL} via Resend.`);
        return { sent: true, provider: "resend" };
      } else {
        const errData = await res.text();
        console.error("[Email] Resend API error:", errData);
      }
    } catch (err: any) {
      console.error("[Email] Resend dispatch failed:", err);
    }
  }

  // 2. Fallback / Server Log Notification
  console.log(`\n======================================================`);
  console.log(`📬 [WISHLIST ALERT] TO: ${TARGET_EMAIL}`);
  console.log(`SUB: ${subject}`);
  console.log(`EMAIL: ${email}`);
  console.log(`DM: ${message || "(none)"}`);
  console.log(`TIME: ${timestampStr}`);
  console.log(`======================================================\n`);

  return { sent: false, provider: "server_log", error: "RESEND_API_KEY not configured in env" };
}
