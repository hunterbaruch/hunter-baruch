export const siteConfig = {
  name: "Hunter Baruch Financial",
  tagline: "Financial clarity when it matters most",
  description:
    "Personalized financial planning and patient advocacy services to help you navigate complex decisions with confidence.",
  url: "https://hunterbaruchfinancial.com",
  contact: {
    phone: "(555) 123-4567",
    email: "hello@hunterbaruchfinancial.com",
    address: "123 Financial District, Suite 400\nNew York, NY 10001",
    hours: "Monday – Friday, 9:00 AM – 5:00 PM ET",
  },
  disclosure:
    "Investment advisory services offered through Hunter Baruch Financial. This website is for informational purposes only and does not constitute financial, legal, or medical advice. Past performance is not indicative of future results.",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/patient-advocacy", label: "Patient Advocacy" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    title: "Financial Planning",
    description:
      "Comprehensive planning tailored to your goals, timeline, and risk tolerance — from retirement readiness to wealth preservation.",
  },
  {
    title: "Investment Management",
    description:
      "Disciplined portfolio strategies designed to align with your objectives while managing risk across market cycles.",
  },
  {
    title: "Insurance & Risk Review",
    description:
      "Evaluate coverage gaps and protect what matters most with a coordinated approach to life, disability, and long-term care planning.",
  },
  {
    title: "Estate & Legacy Planning",
    description:
      "Structure your assets and beneficiary designations to support the people and causes you care about.",
  },
] as const;

export const advocacyPoints = [
  {
    title: "Medical Bill Review",
    description:
      "We review statements, identify billing errors, and help you understand what you owe — and why.",
  },
  {
    title: "Insurance Navigation",
    description:
      "Decode coverage terms, appeals processes, and out-of-network charges so you can make informed decisions.",
  },
  {
    title: "Care Coordination Support",
    description:
      "Get guidance on treatment options, provider networks, and financial implications before you commit.",
  },
  {
    title: "Advocacy at Every Step",
    description:
      "A dedicated partner who speaks plainly, asks the right questions, and fights for fair outcomes on your behalf.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Hunter helped us untangle a stack of medical bills we had been avoiding for months. Within weeks we had a clear plan and real savings.",
    name: "Sarah M.",
    role: "Patient Advocacy Client",
  },
  {
    quote:
      "The financial planning process felt personal, not transactional. Every recommendation was explained in terms we could actually understand.",
    name: "James & Linda R.",
    role: "Financial Planning Clients",
  },
  {
    quote:
      "When my father needed long-term care, Hunter guided our family through insurance, costs, and next steps. We never felt alone in the process.",
    name: "David K.",
    role: "Family Caregiver",
  },
] as const;
