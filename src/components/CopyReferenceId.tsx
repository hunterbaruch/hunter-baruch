"use client";

import { useState } from "react";

export function CopyReferenceId({
  referenceId,
  className,
}: {
  referenceId: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className={className}>
      <span className="font-mono text-sm text-foreground">{referenceId}</span>
      <button
        type="button"
        onClick={copy}
        className="ml-3 text-sm font-normal text-primary underline-offset-2 hover:underline"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
