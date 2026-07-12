import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-sm font-medium text-foreground">
            Hunter Baruch Financial — Admin
          </p>
          <AdminSessionActions />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}

async function AdminSessionActions() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <form
      action={async () => {
        "use server";
        const { signOut } = await import("@/lib/auth");
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button
        type="submit"
        className="text-sm text-primary underline-offset-2 hover:underline"
      >
        Sign out ({session.user.email})
      </button>
    </form>
  );
}
