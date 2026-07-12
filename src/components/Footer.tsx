import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  const { licensing, contact } = siteConfig;
  const phoneDigits = contact.phone.replace(/\D/g, "");

  return (
    <footer className="mt-auto border-t border-border bg-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <img
            src={siteConfig.logo}
            alt={siteConfig.name}
            className="h-14 w-auto brightness-0 invert"
          />
          <p className="mt-3 text-sm text-white/85">{siteConfig.tagline}</p>

          {/* Producer license disclosure — prominent, verifiable */}
          <div className="mt-5 rounded-lg border border-white/15 bg-white/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              Licensed producer
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {licensing.producerName}
            </p>
            <p className="mt-1 text-sm leading-6 text-white/90">
              Licensed in {licensing.licensedIn}
              <br />
              Georgia License No. {licensing.georgiaLicenseNumber}
              <br />
              National Producer Number (NPN): {licensing.npn}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/70">
              Verify licenses via the Georgia Office of Commissioner of Insurance
              producer lookup or NIPR/Sircon using the NPN above.
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
            Navigation
          </p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            <li>
              <a
                href={`tel:${phoneDigits}`}
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {contact.email}
              </a>
            </li>
            <li className="whitespace-pre-line">{contact.address}</li>
            <li className="text-white/75">{contact.hours}</li>
          </ul>
        </div>
      </div>

      {/* Compliance / disclaimer band — all pages via root layout */}
      <div className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto max-w-6xl space-y-3 text-xs leading-relaxed text-white/85">
          <p>{siteConfig.disclosure}</p>
          <p>{siteConfig.eoDisclaimer}</p>
          <p>{siteConfig.governmentDisclaimer}</p>
          <p>
            Estimates and illustrations generated on this site are not final
            quotes. {siteConfig.estimateDisclaimer}
          </p>
        </div>

        <p className="mx-auto mt-5 max-w-6xl text-xs text-white/85">
          {siteConfig.legalLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? " · " : null}
              <Link
                href={link.href}
                className="underline-offset-2 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            </span>
          ))}
          {" · "}
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
