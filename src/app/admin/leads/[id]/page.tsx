import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLeadForAdmin } from "@/lib/leadsAdmin";

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

  return (
    <div>
      <p className="text-sm font-light text-gray-600">
        <Link href="/admin/leads" className="text-primary hover:underline">
          ← All leads
        </Link>
      </p>

      <h1 className="mt-4 text-3xl font-medium text-gray-900">
        Lead {lead.referenceId}
      </h1>
      <p className="mt-2 text-sm font-light text-gray-600">
        Viewed by {session.user.email} — this access was written to the audit log.
      </p>

      <dl className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        <Field label="Name" value={lead.name} />
        <Field label="Email" value={lead.email} />
        <Field label="Phone" value={lead.phone ?? "—"} />
        <Field label="Source" value={lead.source} />
        <Field label="Topic" value={lead.topic ?? "—"} />
        <Field
          label="Preferred callback"
          value={lead.preferredCallbackMethod ?? "—"}
        />
        <Field label="Status" value={lead.status} />
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

      {(lead.healthClass || lead.quoteSummary) && (
        <section className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Quote / health details
          </h2>
          <p className="mt-1 text-xs font-light text-gray-500">
            Health-related fields are decrypted only for authenticated admin
            views.
          </p>
          {lead.healthClass && (
            <p className="mt-3 text-sm font-light text-gray-700">
              Health class: {lead.healthClass}
            </p>
          )}
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}
