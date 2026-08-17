import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isAuthConfigured() {
  return Boolean(process.env.AUTH_SECRET && process.env.DATABASE_URL);
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const configured = isAuthConfigured();

  async function loginAction(formData: FormData) {
    "use server";

    if (!isAuthConfigured()) {
      redirect("/admin/login?error=config");
    }

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin/leads",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=credentials");
      }
      throw error;
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8">
      <h1 className="text-2xl font-medium text-gray-900">Admin sign in</h1>
      <p className="mt-2 text-sm font-light text-gray-600">
        Authorized staff only. Lead records require an authenticated session.
      </p>

      <form action={loginAction} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-normal text-foreground">Email</span>
          <Input
            name="email"
            type="email"
            className="min-h-[48px]"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-normal text-foreground">Password</span>
          <Input
            name="password"
            type="password"
            className="min-h-[48px]"
            required
            minLength={8}
          />
        </label>

        {!configured || params.error === "config" ? (
          <p className="text-sm font-normal text-warning">
            Admin sign-in is not configured on this host. Set{" "}
            <code>AUTH_SECRET</code> and <code>DATABASE_URL</code> on the
            deployment, then redeploy.
          </p>
        ) : params.error ? (
          <p className="text-sm font-normal text-warning">
            Invalid email or password.
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={!configured}
          className="bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-600"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}
