<template>
  <main class="min-h-screen text-white pt-20 md:pt-24 relative bg-page-gradient">
    <!-- Fixed background gradient layer -->
    <div class="bg-fixed-gradient" aria-hidden="true"></div>

    <!-- Header -->
    <section class="px-6 py-12 md:py-16 text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">
        {{ title || 'Privacy Policy' }}
      </h1>
    </section>

    <!-- Body -->
    <section class="max-w-4xl mx-auto px-6 pb-16">
      <article class="prose prose-invert max-w-none" v-html="html"></article>
    </section>
  </main>
  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

/**
 * Static Privacy Policy content (no endpoint).
 * Keep the first non-empty line as the title.
 */
const RAW_POLICY = `
Privacy Policy for Cadena Bitcoin

Effective Date: October 1, 2025


At Cadena Bitcoin ("we," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you use our Bitcoin borrowing and lending platform (the "Platform"). By accessing or using the Platform, you agree to the terms of this Privacy Policy.


1. Non-KYC Platform and User Responsibility

Cadena Bitcoin is a non-KYC platform, meaning we do not require identity verification documents or other personally identifiable information beyond what is outlined in this policy. You are solely responsible for securing and managing your private keys associated with your Bitcoin used on the Platform. We do not store, control, or have access to your private keys. Loss of private keys may result in permanent loss of access to your Bitcoin, and Cadena Bitcoin is not liable for such losses.


2. Information We Collect

We collect only the minimum information necessary to provide our services:


Email Address: Used for account creation, communication, and recovery purposes.

Password: A hashed version of your password is stored to authenticate your access to the Platform.

Usage Data: We may collect non-identifying information about how you interact with the Platform, such as IP addresses, browser type, device information, and timestamps of activities (e.g., logins, transactions, or borrowing/lending activities).

Bitcoin Transaction Data: Information related to your borrowing and lending activities, such as wallet addresses, transaction IDs, and amounts, which are recorded on the Bitcoin blockchain and may be linked to your account for operational purposes.


We do not collect sensitive personal information such as your name, address, date of birth, or government-issued identification.


3. How We Use Your Information

We use the information we collect to:


- Provide and maintain the Platform’s borrowing and lending services.

- Authenticate your account and secure your access.

- Communicate with you about your account, transactions, or Platform updates.

- Monitor and analyze usage to improve the Platform’s functionality and user experience.

- Ensure compliance with our Terms of Service and applicable laws.

- Protect against fraud, unauthorized access, or other illegal activities.


4. How We Store and Protect Your Information

Data Security: We implement industry-standard security measures, such as encryption and secure hashing for passwords, to protect your data. No system is completely secure, and you acknowledge the risks of using online platforms.

Data Storage: Your email and hashed password are stored on secure servers. Bitcoin transaction data is stored only as necessary to facilitate borrowing and lending and is not linked to personally identifiable information beyond your email.

Private Keys: As a custodial platform where you control your private keys, we do not store or have access to your private keys. You are responsible for securely storing and backing up your private keys.


5. Sharing Your Information

We do not sell, trade, or share your personal information with third parties, except in the following cases:


Service Providers: We may share limited data with service providers (e.g., hosting, email, or analytics providers) to operate the Platform. These providers are contractually obligated to protect your data and use it only for the services they provide to us.

Legal Requirements: We may disclose your information if required by law, court order, or other legal processes, or to protect our rights, property, or safety, or that of our users.

Blockchain Data: Bitcoin transactions, including wallet addresses and amounts, are recorded on the public Bitcoin blockchain and are inherently visible to anyone. We do not link this data to your email or other personal information in a way that identifies you.


6. Your Choices and Rights

Account Management: You may update your email or password at any time through your account settings.

Data Deletion: You may request deletion of your account by contacting us at info@cadenabitcoin.com. Upon deletion, we will remove your email and hashed password from our systems, though blockchain transaction data cannot be deleted due to its immutable nature.

Opt-Out: You may opt out of non-essential communications (e.g., promotional emails) by following the unsubscribe instructions in those emails.


7. Cookies and Tracking Technologies

We may use cookies or similar technologies to enhance your experience, such as remembering your login session or analyzing usage patterns. You can manage cookie preferences through your browser settings, but disabling cookies may affect the Platform’s functionality.


8. Third-Party Links

The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before engaging with them.


9. International Users

Cadena Bitcoin operates globally, and your data may be stored or processed in jurisdictions outside your country of residence. By using the Platform, you consent to the transfer of your data to such jurisdictions, which may have different data protection laws.


10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on the Platform or via email. Your continued use of the Platform after such changes constitutes acceptance of the updated policy.


11. Contact Us

If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:

Info@cadenabitcoin.com

Www.cadenabitcoin.com
`

const raw = ref('')
const title = ref('')

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Linkify URLs and emails safely (input must already be HTML-escaped). */
function linkifySafe(escaped) {
  // URLs
  let out = escaped.replace(
    /\bhttps?:\/\/[^\s<>"']+/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow" class="text-secondary underline hover:text-secondary/80">${url}</a>`
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

  // first non-empty line -> title
  const lines = escaped.split('\n')
  const i = lines.findIndex((l) => l.trim().length)
  if (i >= 0) {
    title.value = lines[i].trim()
    lines[i] = ''
  }
  const body = lines.join('\n').trim()

  // Promote "1. Section" lines to H2
  let html = body.replace(
    /^(\d+)\.\s+(.+)$/gm,
    (_m, n, h) => `<h2 id="s${n}" class="mt-10 text-2xl font-bold">${n}. ${h}</h2>`
  )

  // Paragraph blocks (preserve single newlines as <br/>)
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim()
      if (!b) return ''
      if (b.startsWith('<h2')) return b
      const withLinks = linkifySafe(b)
      return `<p class="leading-relaxed">${withLinks.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  return html
}

const html = computed(() => formatToHtml(raw.value))

onMounted(() => {
  raw.value = RAW_POLICY
})
</script>

<style scoped>
/* Wrapper is transparent; fixed layer provides the gradient */
.bg-page-gradient{
  background: transparent;
}

/* Fixed, full-viewport gradient (static on scroll) */
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

/* Higher precision gradient for browsers that support oklch() */
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

/* Minimal spacing if @tailwindcss/typography isn't installed */
.prose :where(h2){ margin-top:2rem; margin-bottom:0.75rem; }
.prose :where(p){ margin-top:0.75rem; margin-bottom:0.75rem; }
</style>
