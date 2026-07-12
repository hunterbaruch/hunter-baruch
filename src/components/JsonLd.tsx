/**
 * Renders schema.org JSON-LD for search engines.
 * Escapes `<` to reduce XSS risk if any field is ever user-influenced.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
