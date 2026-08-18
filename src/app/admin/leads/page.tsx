import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { formatLeadSource, formatLeadStatus } from "@/lib/leadDisplay";
import { listLeadsForAdmin } from "@/lib/leadsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { q } = await searchParams;
  const leads = await listLeadsForAdmin(q);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">Leads</h1>
          <p className="mt-2 text-sm font-light text-gray-600">
            Authenticated access only. Opening a record writes an audit log
            entry. Update status after you call or book.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            const session = await auth();
            if (!session?.user?.id || session.user.role !== "admin") {
              redirect("/admin/login");
            }
            const { runRetentionCleanup } = await import(
              "@/lib/leadRetentionCleanup"
            );
            await runRetentionCleanup();
            redirect("/admin/leads");
          }}
        >
          <button
            type="submit"
            className="text-sm text-primary underline-offset-2 hover:underline"
          >
            Run retention cleanup
          </button>
        </form>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" action="/admin/leads">
        <label className="sr-only" htmlFor="lead-search">
          Search leads
        </label>
        <input
          id="lead-search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email, phone, or reference"
          className="min-h-[44px] min-w-[240px] flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        />
        <button
          type="submit"
          className="min-h-[44px] rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-secondary"
        >
          Search
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Callback</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {q?.trim() ? "No matching leads." : "No leads yet."}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-mono text-primary hover:underline"
                    >
                      {lead.referenceId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">
                    <div>{lead.email}</div>
                    {lead.phone ? (
                      <div className="text-gray-600">{lead.phone}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{formatLeadSource(lead.source)}</td>
                  <td className="px-4 py-3">{lead.topic ?? "—"}</td>
                  <td className="px-4 py-3">
                    {lead.preferredCallbackMethod ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{formatLeadStatus(lead.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
