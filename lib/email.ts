import "server-only";
import { site } from "@/data/site";
import type { ContactTemplate } from "@/lib/contact-templates";

/* Resend delivery via the raw REST API — no SDK, server-only module.
   RESEND_API_KEY lives only here and in the server action; it must never
   reach a client chunk. */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubmissionPayload {
  template: ContactTemplate;
  title: string;
  body: string;
  contact?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bodyToHtml(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export async function sendIssueEmail(
  payload: SubmissionPayload,
): Promise<{ ok: true } | { ok: false }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact delivery disabled");
    return { ok: false };
  }

  const subject = `[${site.repo}] ${payload.template.name}: ${payload.title}`;
  const meta = [
    `Template: ${payload.template.name}`,
    `Contact: ${payload.contact || "not provided"}`,
  ].join("\n");
  const text = `${meta}\n\n${payload.title}\n\n${payload.body}`;
  const html = `<p style="color:#656d76;font-size:12px">${escapeHtml(meta)}</p><h2 style="font-family:sans-serif">${escapeHtml(payload.title)}</h2>${bodyToHtml(payload.body)}`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "onboarding@resend.dev",
        to: site.email,
        reply_to:
          payload.contact && EMAIL_RE.test(payload.contact)
            ? payload.contact
            : undefined,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend delivery failed:", res.status, await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error("Resend delivery error:", error);
    return { ok: false };
  }
}
