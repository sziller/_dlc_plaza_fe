<template>
  <main class="min-h-screen text-white pt-20 md:pt-24 relative bg-page-gradient">
    <!-- Fixed background gradient layer -->
    <div class="bg-fixed-gradient" aria-hidden="true"></div>

    <!-- Header -->
    <section class="px-6 py-12 md:py-16 text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">
        {{ title || 'Terms of Service' }}
      </h1>
    </section>

    <!-- Body -->
    <section class="max-w-4xl mx-auto px-6 pb-16">
      <article class="prose prose-invert max-w-none break-words" v-html="html"></article>
    </section>
  </main>
  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

/**
 * Static Terms of Service content (no endpoint).
 * Keep the first non-empty line as the title.
 */
const RAW_TOS = `
Terms of Service for Cadena Bitcoin

Effective Date: October 1st, 2025

Welcome to Cadena Bitcoin, a non-custodial Bitcoin borrowing and lending platform. By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, you may not use the platform. Please read these Terms carefully.

1. Definitions

Platform: Refers to Cadena Bitcoin, a non-custodial service facilitating peer-to-peer Bitcoin borrowing and lending.
User: Any individual or entity accessing or using the Platform.
Bitcoin (BTC): The decentralized digital cryptocurrency used on the Platform.
Non-Custodial: The Platform does not hold, control, or manage users' Bitcoin or private keys; users retain full control over their funds.
Smart Contract: Self-executing code on a blockchain that facilitates borrowing and lending transactions.

2. Eligibility

To use the Platform, you must:
Have the legal capacity to enter into binding agreements.
Comply with all applicable laws and regulations in your jurisdiction, including those related to Bitcoin transactions.

3. Services Provided

Cadena Bitcoin provides a non-custodial platform that enables users to:
Lend Bitcoin to other users in exchange for interest, as facilitated by smart contracts.
Borrow Bitcoin by providing collateral as facilitated by smart contracts.
Interact directly with blockchain-based smart contracts to execute lending and borrowing transactions.

The Platform does not hold users' funds or private keys. All transactions are executed via smart contracts on the Bitcoin blockchain. Users are solely responsible for managing their private keys, wallets, and transaction security.

4. User Responsibilities

By using the Platform, you agree to:
- Maintain the security and confidentiality of your private keys, wallet credentials, and any other access mechanisms.
- Ensure the accuracy of any information provided to the Platform, including wallet addresses.
- Comply with all terms of the smart contracts used for borrowing or lending.
- Conduct due diligence on any borrowing or lending arrangements
- Bear all risks associated with Bitcoin transactions, including market volatility, smart contract vulnerabilities, and potential loss of funds.

5. Risks

You acknowledge and accept the following risks associated with using the Platform:
Market Risk: The value of Bitcoin is highly volatile and may result in financial loss.
Smart Contract Risk: Smart contracts may contain vulnerabilities or bugs that could lead to loss of funds or failure of transactions.
Regulatory Risk: Bitcoin regulations may change, potentially affecting the legality or functionality of the Platform.
Technical Risk: Blockchain network issues, wallet mismanagement, or cyberattacks may result in loss of funds.
No Custodial Protection: As a non-custodial platform, Cadena Bitcoin does not insure or guarantee the safety of your funds.

Cadena Bitcoin is not responsible for any losses incurred as a result of these or other risks.

6. Fees

Platform Fees: Cadena Bitcoin may charge fees for facilitating borrowing and lending transactions, as disclosed on the Platform. Fees are subject to change with notice. Fee details are available on the Platform’s website.

7. Prohibited Activities

You agree not to:
- Use the Platform for illegal purposes, including money laundering, fraud, or financing of illegal activities.
- Attempt to exploit, hack, or interfere with the Platform or its smart contracts.
- Provide false or misleading information to the Platform or other users.
- Engage in activities that violate applicable laws or regulations.

8. Privacy

Cadena Bitcoin collects minimal user data as a non-custodial platform. Please refer to our Privacy Policy for details on how we collect, use, and protect your information.

9. No Financial Advice

Cadena Bitcoin does not provide financial, investment, tax, or legal advice. All decisions to lend, borrow, or engage in transactions on the Platform are made at your sole discretion and risk.

10. Intellectual Property

All content, trademarks, and intellectual property associated with the Platform are owned by Cadena Bitcoin. You may not copy, modify, or distribute any Platform content without prior written consent.

11. Limitation of Liability

To the fullest extent permitted by law:
- Cadena Bitcoin, its affiliates, and its developers are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform, including but not limited to loss of funds, data, or profits.
- The Platform is provided "as is" without warranties of any kind, express or implied.
- Cadena Bitcoin is not responsible for the actions, defaults, or failures of other users or third-party services, including blockchain networks or wallet providers.

12. Indemnification

You agree to indemnify and hold harmless Cadena Bitcoin, its affiliates, and their respective officers, directors, employees, and agents from any claims, losses, or damages arising from your use of the Platform or violation of these Terms.

13. Termination

Cadena Bitcoin may suspend or terminate your access to the Platform at any time, with or without notice, for reasons including but not limited to:
- Violation of these Terms.
- Suspected illegal activity.
- Technical or security issues.

Upon termination, your right to use the Platform will cease, but any outstanding obligations (e.g., loan repayments) enforced by smart contracts remain your responsibility.

14. Governing Law and Dispute Resolution

These Terms are governed by the laws of El Salvador.

15. Changes to These Terms

Cadena Bitcoin may modify these Terms at any time. Changes will be posted on the Platform’s website, and continued use of the Platform constitutes acceptance of the updated Terms.

16. Contact Information

For questions or support, contact us at info@cadenabitcoin.com.

17. Miscellaneous

Entire Agreement: These Terms, along with any referenced policies, constitute the entire agreement between you and Cadena Bitcoin.
No Waiver: Failure to enforce any provision of these Terms does not constitute a waiver of that provision.

By using Cadena Bitcoin, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
`

const raw = ref('')
const title = ref('')

/* --- utils --- */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

function linkifySafe(escaped) {
  // URLs
  let out = escaped.replace(
    /\bhttps?:\/\/[^\s<>"']+/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow" class="text-secondary underline hover:text-secondary/80 break-words">${url}</a>`
  )
  // Emails
  out = out.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    (email) =>
      `<a href="mailto:${email}" class="text-secondary underline hover:text-secondary/80">${email}</a>`
  )
  return out
}

function formatToHtml(text) {
  const escaped = escapeHtml(text.trim())

  // first non-empty line -> page title
  const lines = escaped.split('\n')
  const i = lines.findIndex(l => l.trim().length)
  if (i >= 0) {
    title.value = lines[i].trim()
    lines[i] = ''
  }
  const body = lines.join('\n').trim()

  // Promote "1. Section" style lines to H2s
  const withHeadings = body.replace(/^(\d+)\.\s+(.+)$/gm, (_m, n, h) => {
    const id = `s${n}-${slugify(h)}`
    return `<h2 id="${id}" class="mt-10 text-2xl font-bold">${n}. ${h}</h2>`
  })

  // Split on blank lines; keep single newlines as <br>, linkify safely
  const blocks = withHeadings
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim()
      if (!b) return ''
      if (b.startsWith('<h2')) return b
      const withLinks = linkifySafe(b)
      return `<p class="leading-relaxed">${withLinks.replace(/\n/g, '<br>')}</p>`
    })

  return blocks.join('\n')
}

const html = computed(() => formatToHtml(raw.value))

onMounted(() => {
  raw.value = RAW_TOS
})
</script>

<style scoped>
/* Make wrapper transparent; fixed layer provides gradient that stays put on scroll */
.bg-page-gradient{
  background: transparent;
}

/* Fixed, full-viewport gradient (static while scrolling) */
.bg-fixed-gradient{
  position: fixed;
  inset: 0;
  z-index: -10;           /* behind content */
  pointer-events: none;   /* let clicks pass through */
  background-color: #000; /* solid base */
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}

/* Higher precision color space when supported */
@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-fixed-gradient{
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}

/* Keep the glow lower on short screens so it doesn't climb mid-page */
@media (max-height: 800px){
  .bg-fixed-gradient{
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}

/* Typography helpers (works even without @tailwindcss/typography) */
.prose :where(h2){ margin-top:2rem; margin-bottom:0.75rem; }
.prose :where(p){ margin-top:0.75rem; margin-bottom:0.75rem; }

/* Don’t let long URLs/words overflow */
.prose { overflow-wrap: anywhere; }
</style>
