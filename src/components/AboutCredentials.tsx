import { Card, CardContent } from "@/components/ui/card";
import { aboutStats, siteConfig } from "@/lib/site";

export function AboutCredentials() {
  return (
    <section id="about" className="section-shell bg-card">
      <div className="container-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
            About the agency
          </p>
          <h2 className="section-title mt-3">
            Advice rooted in education, advocacy, and responsible guidance.
          </h2>
          <p className="body-copy mt-5">
            {siteConfig.name} was built to help clients make major coverage
            decisions without pressure or jargon. We combine multi-carrier
            insurance guidance with patient advocacy support so families can
            move forward with better clarity.
          </p>
          <p className="body-copy mt-4">
            Credentials can include AHIP training, state licensing, ongoing
            Medicare compliance education, and community partnerships with
            senior and family-support organizations.
          </p>

          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
              About our licenses
            </p>
            <p className="mt-3 text-base font-medium text-gray-900">
              {siteConfig.licensing.producerName}
            </p>
            <ul className="mt-3 space-y-1.5 text-base font-light leading-7 text-gray-700">
              <li>Licensed in {siteConfig.licensing.licensedIn}</li>
              <li>
                Georgia License No.{" "}
                {siteConfig.licensing.georgiaLicenseNumber}
              </li>
              <li>National Producer Number (NPN): {siteConfig.licensing.npn}</li>
              <li>
                Professional liability (E&amp;O):{" "}
                {siteConfig.licensing.eo.carrier}
              </li>
            </ul>
            <p className="mt-3 text-sm font-light leading-6 text-gray-600">
              License status may be verified through the Georgia Office of
              Commissioner of Insurance producer lookup or via NIPR using the
              NPN listed above.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <p className="text-3xl font-medium tracking-tight text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-light text-gray-700">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-gray-200 bg-accent p-6">
            <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
              Compliance note
            </p>
            <p className="mt-3 text-base font-light leading-7 text-gray-700">
              We provide guidance based on available appointments and plan
              information. Benefits, premiums, and eligibility vary by state,
              carrier, and applicant profile. We do not guarantee coverage,
              rates, or claim outcomes. Product availability depends on active
              carrier appointments and underwriting.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border border-gray-200 bg-card">
          <img
            src="https://c.animaapp.com/mrcdjiw8FSusfK/img/ai_6.png"
            alt="Insurance advisor standing portrait"
            loading="lazy"
            className="h-full min-h-[420px] w-full object-cover"
          />
          <CardContent className="border-t border-gray-200 p-6">
            <h3 className="text-2xl font-medium text-gray-900">
              Advisor credibility
            </h3>
            <p className="mt-3 text-base font-light leading-7 text-gray-700">
              Personalized guidance, plan comparisons, and support after
              enrollment are central to our service model.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
