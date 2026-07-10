import { featuredCarriers } from "@/lib/site";

export function TrustStrip() {
  return (
    <section
      aria-label="Featured carrier partners"
      className="border-y border-gray-200 bg-card"
    >
      <div className="container-shell px-8 py-6 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr] lg:items-center">
          <div>
            <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
              Brokered with trusted carriers
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-center gap-6 whitespace-nowrap">
              {featuredCarriers.map((name) => (
                <div
                  key={name}
                  className="flex min-h-[56px] min-w-[180px] items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-5 py-3"
                >
                  <span className="text-sm font-normal text-foreground">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
