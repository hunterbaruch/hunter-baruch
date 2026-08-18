import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CopyReferenceId } from "@/components/CopyReferenceId";
import {
  updateLeadNotesAction,
  updateLeadStatusAction,
} from "@/app/admin/leads/actions";
import {
  formatLeadSource,
  formatLeadStatus,
  LEAD_STATUSES,
  phoneHref,
} from "@/lib/leadDisplay";
import { getLeadForAdmin } from "@/lib/leadsAdmin";
import { formatCoverage } from "@/lib/quoteEstimate";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const lead = await getLeadForAdmin(id, session.user.id);
  if (!lead) notFound();

  const tel = phoneHref(lead.phone);

  return (
    <div>
      <p className="text-sm font-light text-gray-600">
        <Link href="/admin/leads" className="text-primary hover:underline">
          ← All leads
        </Link>
      </p>

      <h1 className="mt-4 text-3xl font-medium text-gray-900">
        Lead{" "}
        <CopyReferenceId referenceId={lead.referenceId} />
      </h1>
      <p className="mt-2 text-sm font-light text-gray-600">
        Viewed by {session.user.email} — this access was written to the audit log.
      </p>

      <dl className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        <Field label="Name" value={lead.name} />
        <Field
          label="Email"
          value={lead.email}
          href={`mailto:${lead.email}`}
        />
        <Field
          label="Phone"
          value={lead.phone ?? "—"}
          href={tel ?? undefined}
        />
        <Field label="Source" value={formatLeadSource(lead.source)} />
        <Field label="Topic" value={lead.topic ?? "—"} />
        <Field
          label="Preferred callback"
          value={lead.preferredCallbackMethod ?? "—"}
        />
        <Field label="ZIP" value={lead.zipCode ?? "—"} />
        <Field label="Submitted" value={lead.createdAt.toLocaleString()} />
        <Field
          label="Retention expires"
          value={lead.retentionExpiresAt.toLocaleDateString()}
        />
        <Field
          label="TCPA consent"
          value={
            lead.tcpaConsentAt
              ? `${lead.tcpaConsentAt.toLocaleString()} (${lead.tcpaConsentTextVersion})`
              : "Not recorded"
          }
        />
      </dl>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-gray-900">Status</h2>
        <p className="mt-1 text-sm font-light text-gray-600">
          Current: {formatLeadStatus(lead.status)}
        </p>
        <form action={updateLeadStatusAction} className="mt-4 flex flex-wrap gap-3">
          <input type="hidden" name="id" value={lead.id} />
          <label className="sr-only" htmlFor="lead-status">
            Lead status
          </label>
          <select
            id="lead-status"
            name="status"
            defaultValue={lead.status}
            className="min-h-[44px] rounded-lg border border-input bg-card px-3 text-sm text-foreground"
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatLeadStatus(status)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="min-h-[44px] rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-secondary"
          >
            Save status
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-gray-900">Notes</h2>
        <form action={updateLeadNotesAction} className="mt-4 grid gap-3">
          <input type="hidden" name="id" value={lead.id} />
          <label className="sr-only" htmlFor="lead-notes">
            Admin notes
          </label>
          <textarea
            id="lead-notes"
            name="notes"
            defaultValue={lead.adminNotes ?? ""}
            rows={4}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            placeholder="Call notes, next step, carrier of interest…"
          />
          <button
            type="submit"
            className="min-h-[44px] w-fit rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-secondary"
          >
            Save notes
          </button>
        </form>
      </section>

      {lead.tcpaConsentText && (
        <section className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Consent text (as agreed)
          </h2>
          <p className="mt-3 text-sm font-light leading-6 text-gray-700">
            {lead.tcpaConsentText}
          </p>
        </section>
      )}

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-gray-900">Message</h2>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm font-light leading-6 text-gray-700">
          {lead.message}
        </pre>
      </section>

      {(lead.healthClass ||
        lead.quoteSummary ||
        lead.coverageAmount ||
        lead.age) && (
        <section className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Quote / health details
          </h2>
          <p className="mt-1 text-xs font-light text-gray-500">
            Health-related fields are decrypted only for authenticated admin
            views.
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {lead.coverageAmount ? (
              <Field
                label="Coverage"
                value={formatCoverage(lead.coverageAmount)}
              />
            ) : null}
            {lead.termLength ? (
              <Field label="Term" value={`${lead.termLength} years`} />
            ) : null}
            {lead.age ? <Field label="Age" value={String(lead.age)} /> : null}
            {lead.gender ? <Field label="Gender" value={lead.gender} /> : null}
            {lead.healthClass ? (
              <Field label="Health class" value={lead.healthClass} />
            ) : null}
          </dl>
          {lead.quoteSummary && (
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm font-light leading-6 text-gray-700">
              {lead.quoteSummary}
            </pre>
          )}
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">
        {href ? (
          <a
            href={href}
            className="text-primary underline-offset-2 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
