"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTemplate, CONTACT_TEMPLATES } from "@/lib/contact-templates";
import { sendIssueEmail } from "@/lib/email";

export type SubmitResult =
  | { ok: false; error: "invalid"; fieldErrors: Record<string, string> }
  | { ok: false; error: "rate-limited" }
  | { ok: false; error: "delivery-failed" };

const MIN_BODY = 10;
const MAX_BODY = 10_000;
const MIN_TITLE = 3;
const MAX_TITLE = 120;
const MIN_SUBMIT_MS = 3_000;

export async function submitIssue(
  _prev: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  const template = getTemplate(String(formData.get("template") ?? ""));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("startedAt") ?? 0);

  /* Bots trip the honeypot or submit faster than a human can type —
     hand them the success flow without emailing anything. */
  const botLike =
    honeypot.length > 0 ||
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < MIN_SUBMIT_MS ||
    Date.now() - startedAt > 86_400_000;
  if (botLike) {
    await setSuccessCookie(title);
    redirect("/issues/new/success");
  }

  const fieldErrors: Record<string, string> = {};
  if (!template) fieldErrors.template = "Choose a template.";
  if (title.length < MIN_TITLE || title.length > MAX_TITLE) {
    fieldErrors.title = `Title must be ${MIN_TITLE}–${MAX_TITLE} characters.`;
  }
  if (body.length < MIN_BODY || body.length > MAX_BODY) {
    fieldErrors.body = `Body must be ${MIN_BODY}–${MAX_BODY} characters.`;
  }
  if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9-]+$/.test(contact)) {
    fieldErrors.contact = "Enter an email address or a handle.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "invalid", fieldErrors };
  }

  const delivered = await sendIssueEmail({
    template: template ?? CONTACT_TEMPLATES[0],
    title,
    body,
    contact: contact || undefined,
  });
  if (!delivered.ok) {
    return { ok: false, error: "delivery-failed" };
  }

  await setSuccessCookie(title);
  redirect("/issues/new/success");
}

async function setSuccessCookie(title: string): Promise<void> {
  const store = await cookies();
  store.set("new-issue-title", title.slice(0, MAX_TITLE), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
}
