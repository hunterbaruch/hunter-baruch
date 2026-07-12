import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Lightweight health check for uptime monitors (UptimeRobot, Better Stack, etc.).
 * Point a monitor at GET /api/health — expect HTTP 200 and ok: true.
 *
 * Does not expose PII. DB check is a cheap connectivity probe only.
 */
export async function GET() {
  const checkedAt = new Date().toISOString();

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, checkedAt, database: "unconfigured" },
      { status: 503 },
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      checkedAt,
      database: "up",
    });
  } catch (error) {
    console.error("[health] Database probe failed:", error);
    return NextResponse.json(
      { ok: false, checkedAt, database: "down" },
      { status: 503 },
    );
  }
}
