import { Card, CardContent } from "@/components/ui/card";
import { processSteps } from "@/lib/site";

export function ProcessTimeline() {
  return (
    <section className="section-shell bg-gray-50">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
            How it works
          </p>
          <h2 className="section-title mt-3">
            A simple process that keeps decisions organized.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {processSteps.map((item) => (
            <Card key={item.step} className="border border-gray-200 bg-card">
              <CardContent className="p-8">
                <p className="text-sm font-normal uppercase tracking-[0.2em] text-primary">
                  {item.step}
                </p>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-4 text-base font-light leading-7 text-gray-700">
                  {item.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
