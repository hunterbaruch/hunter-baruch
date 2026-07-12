/**
 * Bootstrap script: create an authorized admin user for lead dashboard access.
 *
 * Usage:
 *   npx tsx scripts/create-admin-user.ts
 *
 * Requires DATABASE_URL and reads ADMIN_EMAIL / ADMIN_PASSWORD from env
 * (or prompts via argv).
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? process.argv[2] ?? "")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? process.argv[3] ?? "";
  const name = process.env.ADMIN_NAME ?? process.argv[4] ?? "Admin";

  if (!email || !password || password.length < 8) {
    console.error(
      "Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... (min 8 chars) npx tsx scripts/create-admin-user.ts",
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      role: "admin",
    },
    update: {
      name,
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
