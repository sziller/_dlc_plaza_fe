<template>
  <main class="min-h-screen text-white pt-28 pb-20 px-6 relative overflow-hidden">
    <!-- Optional gradient background if your project defines it -->
    <div class="fixed inset-0 -z-10 bg-page-gradient" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto space-y-14">
      <!-- Hero -->
      <header class="text-center space-y-5">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">Cadena <em>Signer</em> App</h1>
        <p class="text-white/80 max-w-3xl mx-auto text-base sm:text-lg">
          Your on-device key holder and transaction signer. Non‑custodial by design, so your secrets stay on your phone while
          the web app and backend only see what they need: public keys and signatures.
        </p>
      </header>

      <!-- Image slot: wide banner or product shot -->
      <section aria-label="Image preview" class="max-w-5xl mx-auto flex justify-center">
        <div class="relative title-glow">
          <picture>
            <source type="image/avif" srcset="/img/titlePage-640.avif 640w, /img/titlePage-960.avif 960w, /img/titlePage-1280.avif 1280w" />
            <source type="image/webp" srcset="/img/titlePage-640.webp 640w, /img/titlePage-960.webp 960w, /img/titlePage-1280.webp 1280w" />
            <img
              src="/img/titlePage-960.webp"
              srcset="/img/titlePage-640.webp 640w, /img/titlePage-960.webp 960w, /img/titlePage-1280.webp 1280w"
              sizes="(max-width: 768px) 640px, (max-width: 1024px) 960px, 1280px"
              alt="Signer app title screen"
              class="block w-[300px] md:w-[360px] lg:w-[420px] h-auto select-none"
              decoding="async" loading="eager" fetchpriority="high"
            />
          </picture>
        </div>
      </section>

      <!-- What it is -->
      <section class="grid md:grid-cols-2 gap-8 items-start">
        <div class="space-y-4">
          <h2 class="text-2xl sm:text-3xl font-bold">What is the Signer?</h2>
          <p class="text-white/80">
            The Signer is a mobile companion app that generates and protects your cryptographic keys on‑device. It authorizes
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
            Cadena is non‑custodial. That means <span class="font-semibold">you</span> hold the keys and control authorization. The Signer separates
            identity and UI in the browser from the sensitive key material on your device, reducing attack surface and preserving
            self‑custody.
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
              <p class="text-white/90 text-lg md:text-xl leading-relaxed">Keys are generated <strong>on‑device</strong> and stored in secure storage. They never leave your phone.</p>
            </div>
            <div class="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10">
              <p class="text-white/90 text-lg md:text-xl leading-relaxed">Cadena only receives your <strong>XPUB</strong> and <strong>signatures</strong>—<em>never</em> your seed or private keys.</p>
            </div>
            <div class="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10">
              <p class="text-white/90 text-lg md:text-xl leading-relaxed">Every signature is <strong>scoped</strong> to the exact action you approve, preventing reuse elsewhere.</p>
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
              decoding="async" loading="lazy"
            />
          </picture>
       
        </div>
      </section>

      <!-- FAQ / Notes -->
      
      <!-- Final image strip -->
      
      <!-- CTA (optional) -->
      <section class="text-center space-y-3">
        <p class="text-white/70">Ready to keep your keys on your device and use Cadena securely?</p>
        <div class="flex items-center justify-center gap-3">
          <button type="button" class="px-5 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15">Download (soon)</button>
          <button type="button" class="px-5 py-2 rounded-lg bg-white text-black hover:bg-gray-100">Open Web App</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
// Optional: add route meta if your router uses it
// defineOptions({ name: 'SignerAppPage' })
</script>

<style scoped>
/* Page gradient moved from style= to a class */
.bg-page-gradient{
  background-color: #000; /* solid black base */
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,      /* big ellipse, anchored at bottom center */
      rgba(103,56,228,0.58) 0%,  /* #6738e4, strongest near bottom */
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%          /* fade to transparent -> pure black */
    );
}

/* Smoother math when OKLCH is available, but same hue (#6738e4) */
@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient{
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
  .bg-page-gradient{
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
  
/* Image card hover (subtle) */
.img-card{ transition: transform .25s ease, box-shadow .25s ease; }
.img-card:hover{ transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,.35); }

/* Hero banner glow similar to phone mock */
.title-glow::before{
  content:"";
  position:absolute; inset:-10% -10% -20% -10%;
  border-radius:2rem; pointer-events:none;
  filter: blur(80px); opacity:.6;
  background: radial-gradient(55% 55% at 50% 80%, rgba(103,56,228,.55) 0%, rgba(103,56,228,.28) 40%, rgba(0,0,0,0) 75%);
}

</style>
