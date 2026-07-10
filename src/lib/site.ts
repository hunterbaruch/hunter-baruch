export const siteConfig = {
  name: "Hunter Baruch Financial",
  tagline: "Financial clarity when it matters most",
  description:
    "Personalized financial planning and patient advocacy services to help you navigate complex decisions with confidence.",
  url: "https://hunterbaruchfinancial.com",
  logo: "/hb-logo-real.svg",
  contact: {
    phone: "(555) 123-4567",
    email: "hello@hunterbaruchfinancial.com",
    address: "123 Financial District, Suite 400\nNew York, NY 10001",
    hours: "Monday to Friday, 8:30 AM to 5:30 PM",
  },
  /**
   * COMPLIANCE: Hunter must supply the real Georgia insurance license number
   * and/or National Producer Number (NPN) before launch. Placeholders must not
   * ship as final public copy.
   */
  licensing: {
    producerName: "Hunter Baruch Financial",
    georgiaLicenseNumber: "[GEORGIA LICENSE # — PENDING FROM HUNTER]",
    npn: "[NPN — PENDING FROM HUNTER]",
  },
  /**
   * COMPLIANCE ASSUMPTION: Standard non-affiliation line for Medicare /
   * health-adjacent insurance marketing. Confirm with counsel whether this
   * wording should be adjusted for Hunter's specific product lines.
   */
  governmentDisclaimer:
    "This website is not connected with or endorsed by the United States government, the federal Medicare program, or any state insurance department.",
  /**
   * Shown near quote estimator output. Confirm exact wording with compliance
   * if carrier or E&O guidance requires different language.
   */
  estimateDisclaimer:
    "This is an estimate only and not a final quote, offer of coverage, or guarantee of insurability. Actual rates are determined by the insurance carrier upon full underwriting.",
  disclosure:
    "Investment advisory services offered through Hunter Baruch Financial. This website is for informational purposes only and does not constitute financial, legal, or medical advice. Past performance is not indicative of future results.",
  legalLinks: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    {
      href: "/do-not-sell",
      label: "Do Not Sell or Share My Personal Information",
    },
  ] as const,
};

export const navLinks = [
  { href: "/life", label: "Life" },
  { href: "/health", label: "Health" },
  { href: "/patient-advocacy", label: "Patient Advocacy" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;

export const featuredCarriers = [
  "Regional Life Network",
  "SecureCare Medicare",
  "Family Shield",
  "Advantage Mutual",
] as const;

export const coreServices = [
  {
    title: "Life Insurance",
    href: "/life",
    body: "Protect income, preserve savings, and choose coverage that matches your family stage.",
    bullets: [
      "Term and permanent options explained clearly",
      "Carrier comparison based on goals and budget",
      "Help reviewing underwriting expectations",
    ],
    action: "Start a life quote",
    image: "https://c.animaapp.com/mrcdjiw8FSusfK/img/ai_2.png",
    alt: "Couple speaking with insurance advisor",
  },
  {
    title: "Medicare Guidance",
    href: "/health",
    body: "Understand enrollment timing, supplement choices, and plan fit without pressure.",
    bullets: [
      "Review Parts A, B, C and D in plain language",
      "Check plan fit for doctors, prescriptions, and travel",
      "Guidance for annual review and switching windows",
    ],
    action: "Explore Medicare",
    image: "https://c.animaapp.com/mrcdjiw8FSusfK/img/ai_4.png",
    alt: "Older couple walking with advisor",
  },
  {
    title: "Patient Advocacy",
    href: "/patient-advocacy",
    body: "Get support when care coordination, bills, or insurance questions become overwhelming.",
    bullets: [
      "Clarify care pathways and next steps",
      "Support during billing and claim questions",
      "A personal advocate for complex situations",
    ],
    action: "Request advocacy",
    image: "https://c.animaapp.com/mrcdjiw8FSusfK/img/ai_5.png",
    alt: "Patient advocate with client in clinic",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Tell us your needs",
    body: "Share the kind of coverage or support you need, your timeline, and what matters most.",
  },
  {
    step: "02",
    title: "Compare plans and carriers",
    body: "We narrow available options and explain tradeoffs in straightforward terms you can evaluate.",
  },
  {
    step: "03",
    title: "Enroll with guided support",
    body: "Move forward with help on paperwork, follow-up questions, and post-enrollment clarity.",
  },
] as const;

export const carrierCategories = ["All", "Life", "Medicare", "Advocacy"] as const;

export const carrierDirectory = [
  { name: "Regional Life Network", category: "Life" },
  { name: "SecureCare Medicare", category: "Medicare" },
  { name: "Family Shield", category: "Life" },
  { name: "Advantage Mutual", category: "Medicare" },
  { name: "CarePath Advocacy", category: "Advocacy" },
  { name: "Heritage Life Partners", category: "Life" },
] as const;

export const aboutStats = [
  { value: "12+", label: "Years in business" },
  { value: "18", label: "Licensed states" },
  { value: "3", label: "Core service lines" },
] as const;

export const faqs = [
  {
    id: "faq-1",
    question: "How fast can I get a quote?",
    answer:
      "Most quote requests receive an initial response within one business day, and many start the same day depending on the request type.",
  },
  {
    id: "faq-2",
    question: "Do you represent multiple carriers?",
    answer:
      "Yes. We compare options across available carrier appointments so you can evaluate fit instead of being limited to one company.",
  },
  {
    id: "faq-3",
    question: "Do I pay extra for advocacy?",
    answer:
      "Advocacy support can vary by case and engagement type. We explain scope and any fees clearly before moving forward.",
  },
  {
    id: "faq-4",
    question: "Can I switch plans later?",
    answer:
      "In many cases, yes, depending on enrollment windows, state rules, underwriting, and your product category. We can review the timing with you.",
  },
] as const;

export const videoTestimonials = [
  {
    id: "testimonial-1",
    clientName: "Maria",
    context: "Medicare client",
    videoUrl: "/ai_1.mp4",
    posterUrl: "/ai_1-poster.png",
    transcriptSnippet:
      "They broke down my options, checked my doctors, and helped me enroll without making the process feel rushed.",
    starRating: 5,
  },
  {
    id: "testimonial-2",
    clientName: "James",
    context: "Life insurance client",
    videoUrl: "/ai_1.mp4",
    posterUrl: "/ai_1-poster.png",
    transcriptSnippet:
      "I finally understood which policy fit our budget and what would protect my family if something changed.",
    starRating: 5,
  },
  {
    id: "testimonial-3",
    clientName: "Elaine",
    context: "Advocacy client",
    videoUrl: "/ai_1.mp4",
    posterUrl: "/ai_1-poster.png",
    transcriptSnippet:
      "The advocacy support helped us navigate billing and follow-up care during a stressful time.",
    starRating: 5,
  },
] as const;

export const lifeServices = [
  {
    title: "Life Insurance Planning",
    description:
      "Identify the right type and amount of coverage to protect your family's income, debts, and long-term goals.",
  },
  {
    title: "Income Protection",
    description:
      "Disability and income-replacement strategies so an unexpected illness or injury doesn't derail your finances.",
  },
  {
    title: "Retirement & Longevity",
    description:
      "Build a sustainable plan for retirement income, Social Security timing, and multi-decade cash flow.",
  },
  {
    title: "Estate & Legacy",
    description:
      "Coordinate beneficiaries, ownership, and legacy intentions so your wishes are clear and funded.",
  },
] as const;

export const healthServices = [
  {
    title: "Health Coverage Review",
    description:
      "Compare plans, networks, and out-of-pocket exposure so you choose coverage that fits how you actually use care.",
  },
  {
    title: "Medicare Guidance",
    description:
      "Navigate enrollment windows, supplements, Advantage options, and common pitfalls with plain-language advice.",
  },
  {
    title: "Long-Term Care Planning",
    description:
      "Explore funding strategies for extended care so your family isn't forced into crisis decisions later.",
  },
  {
    title: "Benefits Optimization",
    description:
      "Make sense of employer benefits, HSAs, FSAs, and supplemental policies as part of your broader plan.",
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
