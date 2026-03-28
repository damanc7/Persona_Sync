import { motion } from 'framer-motion'
import { ShieldCheck, ExternalLink, ChevronDown, ChevronUp, Scale, Globe, Flag } from 'lucide-react'
import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

interface Platform {
  name: string
  logo: string
  steps: string[]
  requestUrl: string
  note?: string
}

const platforms: Platform[] = [
  {
    name: 'Google',
    logo: 'G',
    steps: [
      'Go to myaccount.google.com and sign in.',
      'Click "Data & privacy" in the left-hand menu.',
      'Scroll to "Download or delete your data" and click "Download your data".',
      'Select the products you want to export (Gmail, Photos, Drive, etc.).',
      'Choose your file type, frequency, and destination, then click "Create export".',
      'Google will email you a link when the archive is ready — usually within a few hours or days.',
    ],
    requestUrl: 'https://takeout.google.com',
    note: 'Google Takeout is available to all account holders worldwide.',
  },
  {
    name: 'Amazon',
    logo: 'A',
    steps: [
      'Sign in to amazon.com and hover over "Account & Lists".',
      'Click "Account", then find "Request My Data" under the "Data and Privacy" section.',
      'Select the data categories you want (purchase history, browsing, Alexa, etc.).',
      'Submit your request — Amazon will email you within 30 days.',
      'You can also contact Amazon customer service directly to expedite your request.',
    ],
    requestUrl: 'https://www.amazon.com/hz/privacy-central/data-requests/preview.html',
    note: 'Amazon processes requests within 30 days under GDPR and CCPA obligations.',
  },
  {
    name: 'Meta (Facebook & Instagram)',
    logo: 'M',
    steps: [
      'On Facebook: go to Settings & privacy → Settings → Your Facebook information → Download your information.',
      'On Instagram: go to Settings → Account → Download data.',
      'Select the date range and file format (HTML or JSON).',
      'Click "Request a download" — Meta will notify you when it is ready.',
      'For formal GDPR/CCPA requests, use the dedicated privacy request form linked below.',
    ],
    requestUrl: 'https://www.facebook.com/help/contact/180237885820953',
    note: 'Separate requests may be needed for Facebook and Instagram data.',
  },
  {
    name: 'Apple',
    logo: '',
    steps: [
      'Visit privacy.apple.com and sign in with your Apple ID.',
      'Click "Get a copy of your data".',
      'Choose which data categories to include (App Store, iCloud, Apple Music, Health, etc.).',
      'Submit the request — Apple will notify you when the archive is available.',
      'Downloads are available for 7 days once Apple emails you the link.',
    ],
    requestUrl: 'https://privacy.apple.com',
    note: 'Apple provides data for accounts in the US, EU, and other supported regions.',
  },
  {
    name: 'Microsoft',
    logo: 'Ms',
    steps: [
      'Sign in at account.microsoft.com.',
      'Go to Privacy → Privacy dashboard.',
      'Use the dashboard to view and export browsing, search, location, and Cortana data.',
      'For a full account data export, go to account.microsoft.com → Privacy → Data export.',
      'Microsoft will prepare a downloadable archive and email you when it is ready.',
    ],
    requestUrl: 'https://account.microsoft.com/privacy',
    note: "Microsoft's privacy dashboard gives real-time access to many data categories.",
  },
  {
    name: 'X (formerly Twitter)',
    logo: 'X',
    steps: [
      'Go to Settings and Support → Settings and privacy → Your account.',
      'Click "Download an archive of your data".',
      'Verify your identity when prompted.',
      'X will notify you (usually within 24 hours) when your archive is ready to download.',
    ],
    requestUrl: 'https://twitter.com/settings/download_your_data',
    note: 'The archive includes tweets, DMs, account info, and more.',
  },
  {
    name: 'LinkedIn',
    logo: 'in',
    steps: [
      'Click your profile picture → Settings & Privacy.',
      'Go to Data privacy → Get a copy of your data.',
      'Choose "Want something in particular?" to select specific categories, or request all data.',
      'Click "Request archive" — LinkedIn will email you within 24 hours.',
    ],
    requestUrl: 'https://www.linkedin.com/mypreferences/d/download-my-data',
  },
]

interface Law {
  name: string
  jurisdiction: string
  icon: React.ReactNode
  summary: string
  rights: string[]
}

const laws: Law[] = [
  {
    name: 'GDPR',
    jurisdiction: 'European Union',
    icon: <Globe className="h-4 w-4" />,
    summary:
      'The General Data Protection Regulation (2018) is the world\'s most comprehensive data privacy law. It applies to any organisation that processes data of EU residents, regardless of where the organisation is based.',
    rights: [
      'Right of access — obtain a copy of all personal data held about you.',
      'Right to rectification — correct inaccurate or incomplete data.',
      'Right to erasure ("right to be forgotten") — request deletion of your data.',
      'Right to data portability — receive your data in a machine-readable format.',
      'Right to object — object to processing based on legitimate interests or direct marketing.',
      'Rights related to automated decision-making and profiling.',
    ],
  },
  {
    name: 'CCPA / CPRA',
    jurisdiction: 'California, USA',
    icon: <Flag className="h-4 w-4" />,
    summary:
      'The California Consumer Privacy Act (2020) and its amendment the California Privacy Rights Act (2023) give California residents broad rights over their personal data. The CPRA created the California Privacy Protection Agency (CPPA) to enforce the law.',
    rights: [
      'Right to know — request disclosure of personal data collected, used, shared, or sold.',
      'Right to delete — request deletion of your personal data.',
      'Right to opt-out — opt out of the sale or sharing of your personal data.',
      'Right to correct — correct inaccurate personal information.',
      'Right to limit use of sensitive personal information.',
      'Right to non-discrimination for exercising your privacy rights.',
    ],
  },
  {
    name: 'UK GDPR',
    jurisdiction: 'United Kingdom',
    icon: <Flag className="h-4 w-4" />,
    summary:
      'After Brexit, the UK retained the GDPR framework as UK GDPR, enforced by the Information Commissioner\'s Office (ICO). Rights are broadly the same as EU GDPR, adapted for UK law.',
    rights: [
      'Right to be informed about how your data is used.',
      'Right of access via a Subject Access Request (SAR).',
      'Right to rectification of inaccurate data.',
      'Right to erasure of your personal data.',
      'Right to data portability.',
      'Right to object to processing.',
    ],
  },
  {
    name: 'PIPEDA',
    jurisdiction: 'Canada',
    icon: <Flag className="h-4 w-4" />,
    summary:
      'The Personal Information Protection and Electronic Documents Act applies to private-sector organisations that collect, use, or disclose personal information in the course of commercial activity.',
    rights: [
      'Right to know what personal information an organisation holds about you.',
      'Right to access your personal information.',
      'Right to challenge the accuracy of your data.',
      'Right to withdraw consent to data collection or use.',
      'Right to complain to the Office of the Privacy Commissioner of Canada.',
    ],
  },
]

function AccordionItem({ platform }: { platform: Platform }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 bg-[var(--color-bg-surface)] hover:bg-white/5 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[var(--color-accent-violet)]/15 text-[var(--color-accent-violet-bright)] text-xs font-bold shrink-0">
            {platform.logo}
          </span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{platform.name}</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 bg-[var(--color-bg-elevated)] space-y-3">
          <ol className="space-y-2 list-none">
            {platform.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[var(--color-accent-violet)]/20 text-[var(--color-accent-violet-bright)] text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {platform.note && (
            <p className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)] pt-2">
              {platform.note}
            </p>
          )}
          <a
            href={platform.requestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent-violet-bright)] hover:underline"
          >
            Open {platform.name} data request page
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}

export function DataRights() {
  return (
    <div>
      <TopBar title="Data Rights" />
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero */}
        <motion.section variants={sectionVariants}>
          <Card className="p-5 flex gap-4 items-start">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--color-accent-violet)]/15 text-[var(--color-accent-violet-bright)] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
                You have the right to your data
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Privacy laws in the EU, UK, USA, Canada, and many other countries give you the right to request a
                copy of all personal data that companies hold about you. Use the guides below to submit requests
                to the biggest data holders, and learn which laws protect you.
              </p>
            </div>
          </Card>
        </motion.section>

        {/* How to request your data */}
        <motion.section variants={sectionVariants} className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
            How to request your data
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Each platform below has a step-by-step guide. Click a platform to expand the instructions.
          </p>
          <div className="space-y-2">
            {platforms.map((p) => (
              <AccordionItem key={p.name} platform={p} />
            ))}
          </div>
        </motion.section>

        {/* Laws & regulations */}
        <motion.section variants={sectionVariants} className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[var(--color-accent-violet-bright)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
              Laws &amp; regulations
            </h3>
          </div>
          <div className="space-y-3">
            {laws.map((law) => (
              <Card key={law.name} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{law.name}</span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        {law.icon}
                        {law.jurisdiction}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{law.summary}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {law.rights.map((right, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="text-[var(--color-accent-violet-bright)] mt-px">•</span>
                      {right}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Tips */}
        <motion.section variants={sectionVariants}>
          <Card className="p-4 bg-[var(--color-accent-violet)]/5 border-[var(--color-accent-violet)]/20 space-y-2">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Tips for data requests</h4>
            <ul className="space-y-1.5">
              {[
                'Keep a record of when you submitted each request — companies must respond within legal deadlines (30 days for GDPR/CCPA, up to 30 days for PIPEDA).',
                'If a company ignores your request, you can escalate to the relevant regulator (e.g. ICO in the UK, CPPA in California, your national DPA in the EU).',
                'Requests are free of charge in most jurisdictions. Companies cannot charge you for an initial data access request.',
                'You do not need to give a reason for your request. Simply state that you are exercising your right of access.',
                'If you receive your data, check it for accuracy and submit a rectification request for anything that is wrong.',
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-accent-violet-bright)] mt-px shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </motion.section>
      </motion.div>
    </div>
  )
}
