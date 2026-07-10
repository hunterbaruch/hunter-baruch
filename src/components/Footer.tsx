import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
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
          <p className="mt-4 text-sm leading-6 text-white/85">
            {siteConfig.licensing.producerName}
            <br />
            {/* COMPLIANCE: replace pending placeholders with real license / NPN */}
            Georgia License: {siteConfig.licensing.georgiaLicenseNumber}
            <br />
            NPN: {siteConfig.licensing.npn}
          </p>
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
                href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="whitespace-pre-line">{siteConfig.contact.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs leading-relaxed text-white/85">
          {siteConfig.disclosure}
        </p>
        <p className="mx-auto mt-3 max-w-6xl text-xs leading-relaxed text-white/85">
          {siteConfig.governmentDisclaimer}
        </p>
        <p className="mx-auto mt-4 max-w-6xl text-xs text-white/85">
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
