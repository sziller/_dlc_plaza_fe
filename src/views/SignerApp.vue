<template>
  <main class="min-h-screen text-white pt-28 pb-20 px-6 relative overflow-hidden">
    <!-- Optional gradient background if your project defines it -->
    <div class="fixed inset-0 -z-10 bg-page-gradient" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto space-y-14">
      <!-- Hero -->
      <header class="text-center space-y-5">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Cadena <em>Signer</em> App
        </h1>
        <p class="text-white/80 max-w-3xl mx-auto text-base sm:text-lg">
          Your on-device key holder and transaction signer. Non-custodial by design, so your secrets stay on your phone while
          the web app and backend only see what they need: public keys and signatures.
        </p>
      </header>

      <!-- Image slot: wide banner or product shot -->
      <section aria-label="Image preview" class="max-w-5xl mx-auto flex justify-center">
        <div class="relative title-glow">
          <picture>
            <source
              type="image/avif"
              srcset="/img/titlePage-640.avif 640w, /img/titlePage-960.avif 960w, /img/titlePage-1280.avif 1280w"
            />
            <source
              type="image/webp"
              srcset="/img/titlePage-640.webp 640w, /img/titlePage-960.webp 960w, /img/titlePage-1280.webp 1280w"
            />
            <img
              src="/img/titlePage-960.webp"
              srcset="/img/titlePage-640.webp 640w, /img/titlePage-960.webp 960w, /img/titlePage-1280.webp 1280w"
              sizes="(max-width: 768px) 640px, (max-width: 1024px) 960px, 1280px"
              alt="Signer app title screen"
              class="block w-[300px] md:w-[360px] lg:w-[420px] h-auto select-none"
              decoding="async"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
        </div>
      </section>

      <!-- What it is -->
      <section class="grid md:grid-cols-2 gap-8 items-start">
        <div class="space-y-4">
          <h2 class="text-2xl sm:text-3xl font-bold">What is the Signer?</h2>
          <p class="text-white/80">
            The Signer is a mobile companion app that generates and protects your cryptographic keys on-device. It authorizes
            Cadena actions by producing signatures when you approve them. Keys are never uploaded or shared with Cadena.
          </p>
          <ul class="list-disc pl-5 space-y-2 text-white/80 text-base md:text-lg">
            <li>Generates a seed and derives your XPUB and public keys.</li>
            <li>Signs requests for lending/borrowing flows using Discreet Log Contracts (DLCs).</li>
            <li>Pairs to your web account via QR so actions on the site can request signatures from your phone.</li>
          </ul>
        </div>
        <div class="space-y-4">
          <h3 class="text-2xl sm:text-3xl font-bold">Why it’s needed</h3>
          <p class="text-white/80">
            Cadena is non-c custodial. That means <span class="font-semibold">you</span> hold the keys and control authorization. The Signer separates
            identity and UI in the browser from the sensitive key material on your device, reducing attack surface and preserving
            self-custody.
          </p>
          <ul class="list-disc pl-5 space-y-2 text-white/80">
            <li><span class="font-medium">Security:</span> private keys never touch the server or the browser.</li>
            <li><span class="font-medium">Integrity:</span> every critical action requires your explicit approval on the phone.</li>
            <li><span class="font-medium">Portability:</span> recover on a new device using your seed (keep it safe, offline).</li>
          </ul>
        </div>
      </section>

      <!-- Security model -->
      <section class="grid md:grid-cols-2 gap-8 items-center">
        <div class="space-y-6 self-center">
          <h2 class="text-4xl md:text-5xl font-extrabold">Security model</h2>
          <div class="grid gap-4 md:gap-5">
            <div class="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10">
              <p class="text-white/90 text-lg md:text-xl leading-relaxed">
                Keys are generated <strong>on-device</strong> and stored in secure storage. They never leave your phone.
              </p>
            </div>
            <div class="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10">
              <p class="text-white/90 text-lg md:text-xl leading-relaxed">
                Cadena only receives your <strong>XPUB</strong> and <strong>signatures</strong>—<em>never</em> your seed or private keys.
              </p>
            </div>
            <div class="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10">
              <p class="text-white/90 text-lg md:text-xl leading-relaxed">
                Every signature is <strong>scoped</strong> to the exact action you approve, preventing reuse elsewhere.
              </p>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <picture>
            <source type="image/avif" srcset="/img/seedPhrase-640.avif 640w, /img/seedPhrase-960.avif 960w" />
            <source type="image/webp" srcset="/img/seedPhrase-640.webp 640w, /img/seedPhrase-960.webp 960w" />
            <img
              src="/img/seedPhrase-960.webp"
              srcset="/img/seedPhrase-640.webp 640w, /img/seedPhrase-960.webp 960w"
              sizes="(max-width: 768px) 640px, 960px"
              alt="Seed phrase and recovery flow"
              class="block mx-auto w-[300px] md:w-[360px] lg:w-[420px] h-auto select-none"
              decoding="async"
              loading="lazy"
            />
          </picture>
        </div>
      </section>

      <!-- CTA -->
      <section class="text-center space-y-3">
        <p class="text-white/70">
          Ready to keep your keys on your device and use Cadena securely?
        </p>
        <div
          class="flex items-center justify-center gap-3 flex-wrap"
          style="line-height: 0"
        >
          <!-- Apple App Store badge -->
          <a
            href="https://apps.apple.com/us/app/cadena-bitcoin/id6753348211?itscg=30200&itsct=apps_box_badge&mttnsubad=6753348211"
            style="display: inline-block"
            aria-label="Download on the App Store"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1760227200"
              alt="Download on the App Store"
              style="width: 246px; height: 82px; vertical-align: middle; object-fit: contain"
            />
          </a>

          <!-- Android APK badge (same shape as homepage version, now via API) -->
          <button
            type="button"
            class="apk-badge"
            :disabled="downloading"
            @click="handleApkDownload"
            aria-label="Download Android APK v102"
          >
            <span class="apk-version">
              {{ downloading ? '...' : 'v102' }}
            </span>
            <span>
              {{ downloading ? 'Downloading…' : 'Download APK' }}
            </span>
          </button>
        </div>

        <p v-if="downloadError" class="text-sm text-red-300 pt-2">
          {{ downloadError }}
        </p>
      </section>

      <!-- GitHub link (near bottom) -->
      <section class="text-center pt-1">
        <a
          class="github-badge"
          href="https://github.com/CadenaWizard/signer_app"
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="View the Signer app on GitHub"
        >
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
            <path
              d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.32c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.81.06 1.24.84 1.24.84.72 1.23 1.88.88 2.34.67.07-.52.28-.88.5-1.08-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.64 7.64 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.88 3.75-3.67 3.95.29.25.54.74.54 1.49l-.01 2.21c0 .21.14.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              fill="currentColor"
            />
          </svg>
          <span>View on GitHub</span>
        </a>
      </section>
    </div>
  </main>
  <TheFooter />
</template>

<script setup lang="js">
import { ref } from 'vue'
import TheFooter from '../components/TheFooter.vue'

const downloading = ref(false)
const downloadError = ref('')
const apkFilename = 'CadenaBitcoinLive(v102).apk'
const apkDownloadUrl = '/downloads/CadenaBitcoinLive%28v102%29.apk'

const handleApkDownload = async () => {
  if (downloading.value) return

  downloading.value = true
  downloadError.value = ''

  try {
    const a = document.createElement('a')
    a.href = apkDownloadUrl
    a.download = apkFilename
    a.rel = 'nofollow'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.bg-page-gradient {
  background-color: #000;
  background-image: radial-gradient(
    125% 75% at 50% 100%,
    rgba(103, 56, 228, 0.58) 0%,
    rgba(103, 56, 228, 0.36) 26%,
    rgba(103, 56, 228, 0.16) 52%,
    rgba(0, 0, 0, 0) 76%
  );
}

@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient {
    background-color: oklch(0 0 0);
    background-image: radial-gradient(
      in oklch 125% 75% at 50% 100%,
      oklch(from #6738e4 l c h / 0.6) 0%,
      oklch(from #6738e4 l c h / 0.36) 26%,
      oklch(from #6738e4 l c h / 0.16) 52%,
      oklch(0 0 0 / 0) 76%
    );
  }
}

@media (max-height: 800px) {
  .bg-page-gradient {
    background-image: radial-gradient(
      120% 60% at 50% 100%,
      rgba(103, 56, 228, 0.52) 0%,
      rgba(103, 56, 228, 0.3) 24%,
      rgba(103, 56, 228, 0.12) 48%,
      rgba(0, 0, 0, 0) 70%
    );
  }
}

.img-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.img-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.title-glow::before {
  content: "";
  position: absolute;
  inset: -10% -10% -20% -10%;
  border-radius: 2rem;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.6;
  background: radial-gradient(
    55% 55% at 50% 80%,
    rgba(103, 56, 228, 0.55) 0%,
    rgba(103, 56, 228, 0.28) 40%,
    rgba(0, 0, 0, 0) 75%
  );
}

/* APK badge, same shape */
.apk-badge {
  --badge-h: clamp(34px, 5.5vw, 52px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--badge-h) * 0.14);
  padding-inline: calc(var(--badge-h) * 0.18);
  height: var(--badge-h);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: clamp(0.62rem, calc(var(--badge-h) * 0.22), 0.85rem);
  line-height: 1;
  border-radius: calc(var(--badge-h) * 0.26);
  transition: background 0.15s ease-out, border 0.15s ease-out, opacity 0.15s ease-out;
  cursor: pointer;
}
.apk-badge:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
}
.apk-badge:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.apk-version {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  padding: 0.15rem 0.5rem;
  font-size: 0.65em;
  line-height: 1;
  white-space: nowrap;
}

/* GitHub badge (simple, matches style) */
.github-badge {
  --gh-h: clamp(50px, 5.5vw, 60px);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: var(--gh-h);
  padding: 0 14px;
  border-radius: calc(var(--gh-h) * 0.26);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-weight: 700;
  font-size: clamp(0.7rem, 0.55rem + 0.4vw, 0.9rem);
  line-height: 1;
  transition: background .15s ease-out, border .15s ease-out, transform .12s ease-out;
}
.github-badge:hover {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.35);
}
.github-badge svg {
  display: block;
}
</style>
