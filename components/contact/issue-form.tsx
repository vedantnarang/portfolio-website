"use client";

import { useActionState, useState, useEffect } from "react";
import { submitIssue, type SubmitResult } from "@/app/actions/submit-issue";
import {
  CONTACT_TEMPLATES,
  type ContactTemplate,
} from "@/lib/contact-templates";
import { TemplateChooser } from "@/components/contact/template-chooser";
import { WritePreview } from "@/components/contact/write-preview";

/* First hydrated interactive surface of the site (PLAN Phase 4 §7.1).
   Owns template selection → body pre-fill, Write|Preview state, and
   submit progress. Server-side validation is authoritative; these are
   only the UX for it.
   Every field is controlled on purpose: React resets uncontrolled fields
   after a form action returns, which would wipe the draft (and the
   startedAt stamp) on every validation error. */

const initialState: SubmitResult | null = null;

export function IssueForm() {
  const [template, setTemplate] = useState<ContactTemplate | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contact, setContact] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [state, formAction, pending] = useActionState(submitIssue, initialState);

  /* Stamped after hydration so SSR/client DOM match; the action rejects
     submissions under 3s. Empty (no JS) skips the timing check. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount stamp
    setStartedAt(String(Date.now()));
  }, []);

  const fieldErrors = state?.error === "invalid" ? state.fieldErrors : {};
  const banner =
    state?.error === "delivery-failed"
      ? "Sending failed — the issue was not delivered. Retry in a moment, or use one of the direct links."
      : state?.error === "rate-limited"
        ? "Too many attempts too quickly — wait a minute and try again."
        : null;

  function selectTemplate(next: ContactTemplate): void {
    // Only replace bodies that are empty or still an untouched template.
    const isUnedited =
      body.trim() === "" || CONTACT_TEMPLATES.some((t) => t.body === body);
    setTemplate(next);
    if (isUnedited) setBody(next.body);
  }

  return (
    <form action={formAction} className="flex min-w-0 flex-col gap-6">
      <input type="hidden" name="startedAt" value={startedAt} />

      {/* Honeypot — offscreen, bots fill it, humans never see it. */}
      <div aria-hidden className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="min-w-0">
        <TemplateChooser
          templates={CONTACT_TEMPLATES}
          selected={template?.kind ?? null}
          onSelect={selectTemplate}
          errorId={fieldErrors.template ? "new-issue-template-error" : undefined}
          disabled={pending}
        />
        <FieldError errorId="new-issue-template-error" error={fieldErrors.template} />
      </div>

      <div className="min-w-0">
        <label htmlFor="new-issue-title" className="mb-1.5 block text-sm font-semibold">
          Title
        </label>
        <input
          id="new-issue-title"
          type="text"
          name="title"
          required
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={fieldErrors.title ? true : undefined}
          aria-describedby={fieldErrors.title ? "new-issue-title-error" : undefined}
          disabled={pending}
          placeholder="e.g. Senior backend engineer — Node, TypeScript, Postgres"
          className="block w-full rounded-md border border-line bg-canvas px-3 py-1.5 text-sm leading-7 text-ink outline-none placeholder:text-faint focus:border-link focus:ring-1 focus:ring-link"
        />
        <FieldError errorId="new-issue-title-error" error={fieldErrors.title} />
      </div>

      <div className="min-w-0">
        <label htmlFor="new-issue-body" className="mb-1.5 block text-sm font-semibold">
          Body (markdown, like any GitHub issue)
        </label>
        <WritePreview
          value={body}
          onChange={setBody}
          disabled={pending}
          errorId={fieldErrors.body ? "new-issue-body-error" : undefined}
          textareaId="new-issue-body"
        />
        <FieldError errorId="new-issue-body-error" error={fieldErrors.body} />
      </div>

      <div className="min-w-0 max-w-md">
        <label htmlFor="new-issue-contact" className="mb-1.5 block text-sm font-semibold">
          Your email or handle{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="new-issue-contact"
          type="text"
          name="contact"
          autoComplete="email"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          aria-invalid={fieldErrors.contact ? true : undefined}
          aria-describedby={fieldErrors.contact ? "new-issue-contact-error" : undefined}
          disabled={pending}
          placeholder="you@company.com or a GitHub handle"
          className="block w-full rounded-md border border-line bg-canvas px-3 py-1.5 text-sm leading-7 text-ink outline-none placeholder:text-faint focus:border-link focus:ring-1 focus:ring-link"
        />
        <FieldError errorId="new-issue-contact-error" error={fieldErrors.contact} />
      </div>

      {banner && (
        <p
          role="alert"
          className="w-fit rounded-md border border-danger bg-danger-tint px-3 py-2 text-sm text-danger"
        >
          {banner}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-btn-primary px-4 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-btn-primary/85 disabled:cursor-default disabled:opacity-60"
        >
          {pending ? "Opening issue…" : "Submit new issue"}
        </button>
      </div>
    </form>
  );
}

function FieldError({
  errorId,
  error,
}: {
  errorId: string;
  error: string | undefined;
}) {
  if (!error) return null;
  return (
    <p id={errorId} className="mt-1 text-xs leading-5 text-danger" role="alert">
      {error}
    </p>
  );
}
