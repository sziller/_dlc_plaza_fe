<template>
  <main class="max-w-4xl mx-auto py-20 px-4 text-white space-y-12">
    <header class="space-y-4">
      <p class="text-sm uppercase tracking-widest text-secondary/80">Cookie Policy</p>
      <h1 class="text-4xl font-bold leading-tight">How Cadena Bitcoin uses cookies & similar technologies</h1>
      <p class="text-lg text-white/80">
        This Cookie Policy explains how Cadena Bitcoin S.A. de C.V. (“Cadena”, “we”, “us”) uses cookies, pixels, and
        similar tracking technologies on our public website, app, dashboards, and marketing pages. It also describes
        the choices you have to manage cookies.
      </p>
      <p class="text-sm text-white/60">
        Effective date: {{ effectiveDate }}
      </p>
    </header>

    <section class="space-y-3">
      <h2 class="text-2xl font-semibold">1. What are cookies?</h2>
      <p class="text-white/80">
        Cookies are small text files that a website stores on your device to remember information about your visit. We
        also use similar technologies—such as local storage, tracking pixels, and SDK identifiers—that work like
        cookies. Throughout this policy we refer to all of these collectively as “cookies”.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-2xl font-semibold">2. Why we use cookies</h2>
      <p class="text-white/80">
        We use cookies to deliver a secure experience, understand product performance, and personalize the content we
        share with you. Some cookies are essential for our services to function (for example, keeping you signed in or
        protecting your session). Optional cookies help us evaluate which features are most helpful and how effective
        our communications are.
      </p>
    </section>

    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-semibold">3. Types of cookies we use</h2>
        <p class="text-white/80">
          We separate cookies into three categories. You can control the optional categories from the banner or in your
          browser/device settings.
        </p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
        <table class="min-w-full text-left text-sm text-white/90">
          <thead class="text-white uppercase text-xs tracking-widest">
            <tr>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Purpose</th>
              <th class="px-4 py-3">Examples</th>
              <th class="px-4 py-3 text-center">Can I turn it off?</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="row in cookieCategories" :key="row.name" class="align-top">
              <td class="px-4 py-4 font-semibold">{{ row.name }}</td>
              <td class="px-4 py-4 text-white/80">{{ row.purpose }}</td>
              <td class="px-4 py-4 text-white/70">{{ row.examples }}</td>
              <td class="px-4 py-4 text-center">
                <span
                  class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                  :class="row.optional ? 'border-secondary text-secondary' : 'border-white/40 text-white/80'"
                >
                  {{ row.optional ? 'Optional' : 'Required' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-2xl font-semibold">4. How to control cookies</h2>
      <ul class="list-disc list-inside space-y-2 text-white/80">
        <li>
          <strong>Use the Cadena consent banner.</strong> The banner lets you accept all cookies, reject non-essential
          cookies, or save custom preferences at any time.
        </li>
        <li>
          <strong>Update your browser settings.</strong> You can configure most browsers to block or delete cookies. If
          you block essential cookies, parts of Cadena may stop working (for example, you might not be able to log in).
        </li>
        <li>
          <strong>Use private browsing or ad-blocking tools.</strong> These tools can limit cookies, but they might
          also prevent important functionality like remembering your language or referral code.
        </li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-2xl font-semibold">5. Updates to this Cookie Policy</h2>
      <p class="text-white/80">
        We review this policy regularly to reflect new legal requirements or product changes. If we make material
        updates, we will adjust the effective date and post a notice on our website or within the app.
      </p>
      <p class="text-white/80">
        If you have questions, contact us at
        <a class="text-secondary underline" href="mailto:legal@cadena.bitcoin">legal@cadena.bitcoin</a>
        or through our <router-link to="/contact" class="text-secondary underline">Contact page</router-link>.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
const effectiveDate = 'August 2025'

const cookieCategories = [
  {
    name: 'Strictly necessary',
    purpose:
      'Enable login, keep your session secure, store consent choices, and load resources needed to run the site.',
    examples: 'Authentication tokens, session security cookies, cookie-consent status.',
    optional: false,
  },
  {
    name: 'Analytics',
    purpose:
      'Measure how often features are used, diagnose errors, and understand product performance so we can prioritize improvements.',
    examples: 'Anonymous usage metrics, performance timing, aggregated traffic attribution.',
    optional: true,
  },
  {
    name: 'Marketing',
    purpose: 'Deliver relevant Cadena communications and understand how effective our outreach campaigns are.',
    examples: 'Referral attribution, campaign engagement, personalization tags.',
    optional: true,
  },
]
</script>
