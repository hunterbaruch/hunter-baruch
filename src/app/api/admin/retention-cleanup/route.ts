import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runRetentionCleanup } from "@/lib/leadRetentionCleanup";

/**
 * Manually-triggered retention cleanup for expired lead records.
 * Requires an authenticated admin session.
 *
 * For scheduled runs, call runRetentionCleanup() from a cron job
 * (e.g. Vercel Cron) that authenticates via CRON_SECRET instead.
 */
export async function POST(request: Request) {
  const session = await auth();
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const isCron =
    cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isCron && (!session?.user?.id || session.user.role !== "admin")) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await runRetentionCleanup();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[retention] Cleanup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Cleanup failed." },
      { status: 500 },
    );
  }
}
