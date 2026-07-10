import Link from "next/link";

/** Visible privacy + terms links near form submit buttons. */
export function PrivacyPolicyLink() {
  return (
    <p className="text-sm font-light text-gray-700">
      By submitting, you acknowledge our{" "}
      <Link
        href="/privacy-policy"
        className="font-normal text-primary underline-offset-2 hover:underline"
      >
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link
        href="/terms-of-service"
        className="font-normal text-primary underline-offset-2 hover:underline"
      >
        Terms of Service
      </Link>
      .
    </p>
  );
}
