"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  updateLeadNotesForAdmin,
  updateLeadStatusForAdmin,
} from "@/lib/leadsAdmin";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/admin/login");
  }
  return session.user.id;
}

export async function updateLeadStatusAction(formData: FormData) {
  const userId = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) redirect("/admin/leads");

  await updateLeadStatusForAdmin({ id, status, userId });
  redirect(`/admin/leads/${id}`);
}

export async function updateLeadNotesAction(formData: FormData) {
  const userId = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (!id) redirect("/admin/leads");

  await updateLeadNotesForAdmin({ id, notes, userId });
  redirect(`/admin/leads/${id}`);
}
