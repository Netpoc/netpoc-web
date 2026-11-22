/**
 * FuelPay product page — all copy and configuration in one place.
 *
 * Source: "FuelPay Product Page — Website Content & Developer Brief", 29 Oct 2026.
 *
 * Placeholder convention: anything wrapped in [SQUARE BRACKETS] is rendered on
 * the page as a visible coral "to confirm" chip (see `components/fuelpay/TbcCopy.vue`).
 * Before go-live, `grep -n "\[" src/content/fuelpay.ts` must return only real
 * values. Replace a placeholder by editing the string — no template changes needed.
 */

import { ADDRESS_LINE, COMPANY } from './company'

export type Segment = 'towers' | 'enterprise' | 'tractors'
export const SEGMENTS: Segment[] = ['towers', 'enterprise', 'tractors']

export function isSegment(value: unknown): value is Segment {
  return typeof value === 'string' && (SEGMENTS as string[]).includes(value)
}

/* ------------------------------------------------------------------ */
/* Links & contact — drop real values in here                          */
/* ------------------------------------------------------------------ */

export const FUELPAY_LINKS = {
  /** Demo sign-up. `segment` + UTM params are appended automatically. */
  demoSignup: '[DEMO_APP_URL]/signup',
  appLogin: '[APP_LOGIN_URL]',
  supportedDevices: '[LINK: supported devices list]',
  calendar: '[CALENDAR_LINK]',
  privacy: '[PRIVACY_POLICY_URL]',
  terms: '[TERMS_URL]',
  dataProtection: '[NDPA_PAGE_URL]',
  canonical: '[netpoc-domain]/fuelpay',
}

export const CONTACT = {
  phone: COMPANY.phone,
  email: '[SALES_EMAIL]',
  whatsapp: '[WHATSAPP_NUMBER]',
  address: ADDRESS_LINE,
  rc: '[CAC number]',
}

/** True when a value is still a [PLACEHOLDER] and must not be used as a real href. */
export function isPlaceholder(value: string) {
  return /\[[^\]]+\]/.test(value)
}

/* ------------------------------------------------------------------ */
/* One descriptor and one diesel price, used everywhere on the site     */
/* ------------------------------------------------------------------ */

/** The product's one-line descriptor: SEO title, hero pill, sticky bar, Home. */
export const PRODUCT_DESCRIPTOR = 'Diesel, Power & Tractor Monitoring'

/**
 * The single diesel price quoted on the site (segment proof lines and the
 * calculator default). CFO: update monthly, and change `asOf` + `source` with it.
 */
export const DIESEL_PRICE = {
  perLitre: 1700,
  asOf: 'Oct 2026',
  source: 'Dangote refinery diesel price, 7 Oct 2026',
}
const dieselNaira = `₦${DIESEL_PRICE.perLitre.toLocaleString('en-NG')}`

/* ------------------------------------------------------------------ */
/* SEO (§8)                                                            */
/* ------------------------------------------------------------------ */

export const SEO = {
  title: `FuelPay: ${PRODUCT_DESCRIPTOR} in Nigeria · Netpoc`,
  description:
    'Stop diesel theft and track power and tractors across all your sites. FuelPay by Netpoc: live alerts, audit-ready reports. Book a PoC.',
  /** 1200×630 social preview (public/og-image.png). */
  ogImage: '/og-image.png',
}

/* ------------------------------------------------------------------ */
/* §4.1 Hero                                                           */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: 'FuelPay by Netpoc',
  /** H1 split so the last phrase can carry the Ankara gradient. */
  title: ['Every litre. Every kilowatt.', 'Every hectare.', 'Accounted for.'],
  sub: 'FuelPay monitors generator diesel, electricity and tractors across all your locations. It alerts you the moment fuel goes missing and gives your finance and audit teams the evidence they need.',
  primary: 'Book a PoC',
  secondary: 'Try the Demo, free',
  trust: [
    'Built in Nigeria for Nigerian sites',
    'Works with your existing trackers',
    'NDPA-compliant data handling',
  ],
  alert: {
    title: 'Possible siphoning',
    body: '112 L drop at Ikeja Tower 04',
    meta: '02:14 · generator OFF',
  },
}

/* ------------------------------------------------------------------ */
/* §4.2 Problem strip                                                  */
/* ------------------------------------------------------------------ */

export const PROBLEM = {
  title: 'Diesel and power are your biggest costs, and the least visible',
  stats: [
    {
      value: 40,
      prefix: '',
      suffix: 'M+',
      unit: 'litres',
      line: "of diesel burned by Nigeria's telecom networks every month",
      source: 'Africa Finance Corporation, 2025, via Premium Times',
    },
    {
      value: 50,
      prefix: '45–',
      suffix: '%',
      unit: '',
      line: 'of telecom operating cost goes on energy',
      source: 'WBN / The Guardian Nigeria',
    },
    {
      value: 2000,
      prefix: '',
      suffix: '',
      unit: 'tractors',
      line: 'in the federal NAMP programme, each needing a tracker and per-hectare billing',
      source: 'Bank of Agriculture / NAN, Feb 2026',
    },
  ],
  footnote:
    "When fuel is bought centrally and burned in hundreds of remote places, losses hide in the gaps: short deliveries, siphoning, generators running when they shouldn't, tractors working jobs nobody billed.",
}

/* ------------------------------------------------------------------ */
/* §4.3 Segment switcher                                               */
/* ------------------------------------------------------------------ */

export interface SegmentRow {
  problem: string
  /** Bold feature name, then the rest of the sentence. */
  feature: string
  detail: string
  outcome: string
}

export interface SegmentContent {
  id: Segment
  label: string
  headline: string
  who: string
  rows: SegmentRow[]
  proof: string
  proofSource: string
  connect?: string
  smallPrint?: string
  cta: string
  demoCta: string
}

export const SOLUTIONS = {
  title: 'Built for the way you run',
  intro: 'Choose your operation to see the problems we solve and how.',
  columns: ['The problem', 'What FuelPay does', 'What you get'] as const,
}

export const SEGMENT_CONTENT: Record<Segment, SegmentContent> = {
  towers: {
    id: 'towers',
    label: 'Telecom towers',
    headline: 'Prove where every litre of tower diesel goes',
    who: 'Tower owners, mobile network operators, O&M contractors and diesel suppliers.',
    rows: [
      {
        problem: "Diesel is your largest site cost, and you can't see it between deliveries",
        feature: 'Calibrated tank level',
        detail: ', reported continuously from every site',
        outcome: 'Live litres in every tank, on one map',
      },
      {
        problem: 'Short deliveries and siphoning are hard to prove',
        feature: 'Delivery reconciliation',
        detail: ': litres delivered vs litres actually received',
        outcome: 'Evidence for every disputed delivery',
      },
      {
        problem: 'Fuel disappears at night when nobody is on site',
        feature: 'Theft and sudden-drop alerts',
        detail: ' by SMS and email within minutes [TO CONFIRM: alert latency]',
        outcome: 'Act the same night, not at month-end',
      },
      {
        problem: 'Generators run while grid or batteries could carry the load',
        feature: 'Generator run-hours and kWh by source',
        detail: ': grid, generator, solar',
        outcome: 'Cut wasted generator hours',
      },
      {
        problem: 'No way to compare site efficiency',
        feature: 'Litres per kWh',
        detail: ' for every site, ranked',
        outcome: 'A league table of your worst sites',
      },
      {
        problem: 'Owner, contractor and supplier each hold different numbers',
        feature: 'Multi-party views',
        detail: ': each party sees only what you allow',
        outcome: 'One version of the truth',
      },
    ],
    proof:
      `At ~800 litres a site a month and ${dieselNaira} a litre, a typical tower burns about ₦${((800 * DIESEL_PRICE.perLitre) / 1e6).toFixed(1)}M of diesel monthly. Recovering just 10% pays for FuelPay several times over.`,
    proofSource: `Diesel at ${dieselNaira}/L: ${DIESEL_PRICE.source}`,
    cta: 'Book a tower PoC',
    demoCta: 'Or try the demo with a tower site',
  },
  enterprise: {
    id: 'enterprise',
    label: 'Banks & enterprises',
    headline: 'Control generator diesel and power across every branch and facility',
    who: 'Banks, hospitals, factories, hotels, schools, estates. Any organisation running generators at many locations.',
    rows: [
      {
        problem: "Fuel is bought centrally but burned at branches you can't see",
        feature: 'Branch dashboard',
        detail: ' with live tank levels at every location',
        outcome: 'HQ sees every site without phoning anyone',
      },
      {
        problem: 'Audit asks for evidence; you only have paper logs',
        feature: 'Monthly fuel and loss report',
        detail: ', refuel by refuel',
        outcome: 'Audit-ready records, automatically',
      },
      {
        problem: 'Missing diesel is found weeks later, if ever',
        feature: 'Instant alerts',
        detail: ' for sudden drops and unexplained refuels',
        outcome: 'Losses stopped early',
      },
      {
        problem: "Electricity bills don't match what you used",
        feature: 'Metered kWh',
        detail: ' by grid and generator at each board',
        outcome: 'Your own numbers to check against your DisCo bill',
      },
      {
        problem: 'No idea which locations are wasteful',
        feature: 'Cost per location',
        detail: ' and litres per kWh, compared across sites',
        outcome: 'Fix the worst sites first',
      },
      {
        problem: 'Different teams need different access',
        feature: 'Role-based views',
        detail: ': HQ, region, branch',
        outcome: 'Everyone sees only what they manage',
      },
    ],
    proof:
      `Diesel now costs ${dieselNaira} a litre or more, before delivery to your branch. A generator you can't see is a cost you can't control.`,
    proofSource: `Diesel at ${dieselNaira}/L: ${DIESEL_PRICE.source}`,
    cta: 'Book a PoC for your branches',
    demoCta: 'Or try the demo with a branch',
  },
  tractors: {
    id: 'tractors',
    label: 'Tractor programmes',
    headline:
      'Turn tractor trackers into hectares you can bill, fuel you can account for and repayments you can enforce',
    who: 'Mechanisation programmes, state agri-hubs, tractor leasing and hire companies, large farms and estates (tractors, harvesters and other farm machinery).',
    rows: [
      {
        problem: 'Pay-per-hectare billing needs a trusted record of work done',
        feature: 'Hectares worked per job',
        detail: ', from the GPS track and implement width',
        outcome: 'Invoices based on measured work, with the track kept as evidence',
      },
      {
        problem: 'Diesel goes missing from tractor tanks, or is under-filled at refuelling',
        feature: 'Tractor fuel monitoring',
        detail: ': fills, drains and consumption in litres',
        outcome: 'Fuel theft caught, with the time and place recorded',
      },
      {
        problem: 'Nobody knows what a job should burn, so over-use goes unnoticed',
        feature: 'Litres per hectare and litres per hour',
        detail: ' for each job, operation and operator',
        outcome: 'Fair fuel allowances per operation; over-consumption flagged',
      },
      {
        problem: 'Tractors are used for private jobs or outside approved areas',
        feature: 'Route history, geofence and after-hours use alerts',
        detail: '',
        outcome: 'Misuse spotted the same day',
      },
      {
        problem: 'Lease-to-own repayments slip and tractors are hard to locate',
        feature: 'Arrears & recovery view',
        detail: ': location, last active, use since last payment',
        outcome: 'Recovery teams know exactly where to go',
      },
      {
        problem: 'Breakdowns in peak season cost whole planting windows',
        feature: 'Engine health alerts',
        detail: ': RPM, coolant temperature, oil pressure',
        outcome: 'Problems caught before they become breakdowns',
      },
      {
        problem: 'Servicing goes by calendar, not by actual use',
        feature: 'Engine-hour maintenance alerts',
        detail: '',
        outcome: 'Services due by real use; fewer breakdowns',
      },
      {
        problem: 'Operators are paid by the day, not by work done',
        feature: 'Operator hours and output report',
        detail: '',
        outcome: 'Pay and incentives based on actual working hours and hectares',
      },
      {
        problem: 'Programme, states and hubs each need their own view',
        feature: 'Programme → state → hub → operator',
        detail: ' views',
        outcome: 'Each hub runs its fleet; HQ sees everything',
      },
      {
        problem: 'Billing data is re-typed by hand',
        feature: 'Billing export',
        detail: " in your app's format",
        outcome: 'No manual re-keying',
      },
    ],
    proof: '',
    proofSource: '',
    connect:
      'FuelPay Connect reads data from the trackers already fitted to your tractors. No tracker? We supply and fit one, with an optional fuel sensor (FuelPay Complete).',
    // Contractual — do not remove.
    smallPrint:
      'Remote immobilisation is available only where the tracker has a relay fitted. Fuel and engine readings need a fuel sensor or an engine-data (CAN) connection; GPS-only trackers provide location, hours and hectares.',
    cta: 'Book a tractor PoC',
    demoCta: 'Or try the demo with a tractor',
  },
}

/* ------------------------------------------------------------------ */
/* §4.4 How it works                                                   */
/* ------------------------------------------------------------------ */

export const HOW = {
  title: 'From the tank to your phone in four steps',
  steps: [
    {
      name: 'Sense',
      icon: 'droplet',
      text: 'A calibrated fuel sensor sits in the tank, an energy meter on the power board, a tracker on the tractor.',
    },
    {
      name: 'Connect',
      icon: 'radio',
      text: 'A rugged 4G device sends readings to the cloud, storing data if the network drops. [TO CONFIRM: offline buffering behaviour]',
    },
    {
      name: 'Analyse',
      icon: 'gauge',
      text: 'FuelPay detects refuels, drops, generator runs, hectares and engine hours automatically.',
    },
    {
      name: 'Act',
      icon: 'bell',
      text: 'Alerts reach the right person by SMS, email or app. Reports go to finance and audit every month.',
    },
  ],
  offersTitle: 'Two ways to start',
  offers: [
    {
      name: 'FuelPay Complete',
      tagline: 'We do everything.',
      text: 'Sensors, installation, tank calibration and the platform.',
      best: 'Best for diesel and power sites with no monitoring today.',
    },
    {
      name: 'FuelPay Connect',
      tagline: 'Use what you already have.',
      text: 'Connect your existing trackers or sensors to FuelPay and get the reports, alerts and API.',
      best: 'Best for tractor fleets and sites with devices already fitted.',
    },
  ],
  offerNamesNote: '[TO CONFIRM: CEO approves the public names Complete / Connect]',
  dnd: 'Alerts reach your team even on DND numbers. [TO CONFIRM: once the SMS route is live]',
}

/* ------------------------------------------------------------------ */
/* §4.5 Features                                                       */
/* ------------------------------------------------------------------ */

export const FEATURES = {
  title: 'One platform for all your sites and machines',
  items: [
    { icon: 'building', name: 'Multi-company, multi-site', text: 'Group locations by region, state or hub. Give partners their own limited view.' },
    { icon: 'droplet', name: 'Calibrated fuel levels', text: "Litres, not percentages, worked out from each tank's own calibration." },
    { icon: 'alert', name: 'Theft & drop alerts', text: 'Sudden drops while the generator is off are flagged instantly.' },
    { icon: 'truck', name: 'Delivery reconciliation', text: 'Compare delivered litres with received litres for every refuel.' },
    { icon: 'zap', name: 'Power by source', text: 'kWh from grid, generator and solar, plus load and run-hours.' },
    { icon: 'gauge', name: 'Litres per kWh', text: 'The efficiency number that exposes both theft and tired generators.' },
    { icon: 'map', name: 'Hectares & tracks', text: 'Measured work per job, with the GPS track kept as evidence.' },
    { icon: 'file', name: 'Reports & exports', text: 'Monthly loss, audit and billing reports in PDF and Excel.' },
    { icon: 'shield', name: 'Secure by design', text: 'Role-based access, encrypted data, NDPA-compliant processing.' },
    { icon: 'code', name: 'Open API', text: 'Feed FuelPay data into your NOC, ERP or billing app.' },
  ],
}

/* ------------------------------------------------------------------ */
/* §4.6 Loss calculator                                                */
/* ------------------------------------------------------------------ */

export const CALCULATOR = {
  title: 'How much diesel could you be losing?',
  defaults: { sites: 20, litres: 800, price: DIESEL_PRICE.perLitre, lossPct: 10 },
  priceNote: `${DIESEL_PRICE.asOf} price`,
  line: 'A FuelPay PoC measures your real number in 60 days.',
  disclaimer: 'Estimate only. Actual losses vary by site.',
  tractorLine: 'For tractor fleets, ask us about per-hectare billing accuracy.',
}

/** sites × litres × price × loss% — raw monthly naira. */
export function monthlyLoss(sites: number, litres: number, price: number, lossPct: number) {
  return sites * litres * price * (lossPct / 100)
}

export const roundToThousand = (n: number) => Math.round(n / 1000) * 1000

export const formatNaira = (n: number) =>
  '₦' + new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(n)

/* ------------------------------------------------------------------ */
/* §4.7 PoC offer                                                      */
/* ------------------------------------------------------------------ */

export const POC = {
  title: 'See it work on your own sites in 60 days',
  intro:
    'A FuelPay Proof of Concept is a short, paid pilot on your real locations or tractors. You see measured results before you commit, and the full PoC fee is credited against your rollout.',
  sites: {
    title: 'Diesel & power sites',
    items: [
      'Sensors, installation and tank calibration on your chosen sites',
      '60 days of full FuelPay access',
      'Theft, refuel and generator alerts to your team',
      'Monthly loss report and a closing results review',
    ],
    fee: 'Fee from [₦350,000 per site], fully credited on rollout',
  },
  tractors: {
    title: 'Tractor programmes',
    items: [
      'Connection of your existing trackers (or fitted trackers where needed)',
      '60 days, up to 50 tractors in one zone or hub',
      'Hectares-worked report, checked against field-measured sample plots',
      'Weekly arrears and utilisation report',
      'Optional: fuel sensors on a sample of tractors to measure litres per hectare',
    ],
    fee: 'Fee [₦2,000,000 or "pricing on request"], fully credited on rollout',
  },
  needsTitle: 'What we need from you',
  needs: [
    'The locations (or tractors) for the pilot, with generator size and tank capacity (or tracker make and implement width).',
    'Site access for installation.',
    'One named contact on your side.',
    'Agreement on what success looks like, for example the loss found or billing accuracy.',
  ],
}

/* ------------------------------------------------------------------ */
/* §4.8 Demo                                                           */
/* ------------------------------------------------------------------ */

export const DEMO = {
  title: 'Try FuelPay now. No hardware, no sales call.',
  intro:
    'Create a free demo account and explore FuelPay with realistic simulated data in under two minutes.',
  steps: [
    { name: 'Create your company', text: 'Add your organisation and choose your industry.' },
    {
      name: 'Add a location or tractor',
      text: "A tower, branch, factory or tractor. Tell us its size and we'll simulate it.",
    },
    {
      name: 'Explore live data',
      text: 'See tank levels, a refuel, a theft alert, power use or hectares worked, just as your team would.',
    },
  ],
  cta: 'Create free demo account',
  smallPrint: 'Free for 14 days. Demo data is simulated. No card required.',
}

/* ------------------------------------------------------------------ */
/* §4.9 FAQ                                                            */
/* ------------------------------------------------------------------ */

export const FAQ = {
  title: 'Frequently asked questions',
  items: [
    {
      id: 'hardware',
      q: 'Do I need to buy new hardware?',
      a: 'For diesel and power sites with no monitoring, yes: we supply, install and calibrate it (FuelPay Complete). If your tractors or sites already have supported trackers, FuelPay Connect works with them.',
    },
    {
      id: 'devices',
      q: 'Which trackers and sensors do you support?',
      a: "Leading telematics devices including Teltonika and Ruptela, and Escort fuel sensors. Send us your make and model and we'll confirm. [LINK: supported devices list]",
    },
    {
      id: 'accuracy',
      q: 'How accurate are the fuel readings?',
      a: 'Every tank is calibrated on installation, so FuelPay reports litres rather than a rough percentage. [TO CONFIRM: published accuracy figure, e.g. ±X%]',
    },
    {
      id: 'offline',
      q: 'What happens when the network is down?',
      a: 'The device stores readings and sends them when the signal returns, so no data is lost. [TO CONFIRM]',
    },
    {
      id: 'alerts',
      q: 'How quickly do alerts arrive, and to whom?',
      a: 'Within minutes, by SMS, email or in-app, to the people you choose for each site. Alerts use a business SMS route that reaches DND numbers. [TO CONFIRM: latency]',
    },
    {
      id: 'partners',
      q: 'Can our contractors or suppliers see the data?',
      a: 'Only if you allow it. You can give each partner a limited view of the sites they serve.',
    },
    {
      id: 'data',
      q: 'Who owns the data and is it secure?',
      a: 'You own your data. We process it under a data processing agreement that meets the Nigeria Data Protection Act 2023, with role-based access and encryption.',
    },
    {
      id: 'install',
      q: 'How long does installation take?',
      a: '[TO CONFIRM: e.g. "Most sites are installed and calibrated in one visit of about X hours."]',
    },
    {
      id: 'cost',
      q: 'What does a PoC cost?',
      a: "PoCs are paid and the full fee is credited when you roll out. Site PoCs start from [₦350,000 per site]. Book a call and we'll scope yours.",
    },
    {
      id: 'tractor-fuel',
      q: 'Can FuelPay monitor fuel on tractors and harvesters, not just location?',
      a: 'Yes, when the machine has a fuel sensor or an engine-data connection. You then see fills, drains, litres per hectare and engine health. GPS-only trackers still give location, hours and hectares worked.',
    },
    {
      id: 'demo-data',
      q: 'Is the demo real data?',
      a: 'No. The demo uses realistic simulated data so you can explore safely. A PoC shows your real numbers.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* §4.10 Final CTA                                                     */
/* ------------------------------------------------------------------ */

export const FINAL_CTA = {
  title: 'Find your missing litres before the next delivery.',
  sub: 'Book a 60-day PoC on your own sites or tractors, or explore the demo today.',
}

/* ------------------------------------------------------------------ */
/* §5.1 PoC form options                                               */
/* ------------------------------------------------------------------ */

export type FormSegment = Segment | 'other'

export const FORM_SEGMENTS: { value: FormSegment; label: string }[] = [
  { value: 'towers', label: 'Telecom towers' },
  { value: 'enterprise', label: 'Bank or enterprise' },
  { value: 'tractors', label: 'Tractor programme or fleet' },
  { value: 'other', label: 'Other' },
]

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
]

export const SITE_BANDS = ['1–5', '6–20', '21–100', '101–500', '500+']
export const GENERATOR_SIZES = ['<20 kVA', '20–60 kVA', '60–200 kVA', '200+ kVA', 'Mixed']
export const INTERESTS = ['Diesel monitoring', 'Power monitoring', 'Both']
export const TRACTOR_BANDS = ['1–49', '50–199', '200–999', '1,000+']
export const TRACKERS_FITTED = ['Yes', 'No', 'Some', 'Not sure']
export const PROBLEMS = [
  'Fuel theft',
  'Short deliveries',
  'Power costs',
  'Audit evidence',
  'Per-hectare billing',
  'Tractor fuel use',
  'Machine misuse',
  'Repayments & recovery',
  'Maintenance & breakdowns',
  'Operator pay',
  'Other',
]
export const START_OPTIONS = ['This month', 'Next 1–3 months', 'Later', 'Just exploring']
export const HEARD_FROM = ['LinkedIn', 'Referral', 'Event', 'Search', 'Other']
