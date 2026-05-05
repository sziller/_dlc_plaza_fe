<template>
  <footer class="bg-black text-white">
    <div class="max-w-screen-xl mx-auto px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 🔖 Logo & Title -->
        <div class="flex flex-col items-center lg:items-start">
          <div class="text-xl font-extrabold text-secondary mb-2">Cadena Bitcoin</div>

          <!-- Optimized logo: AVIF/WebP, density srcset, lazy -->
          <router-link to="/" aria-label="Go to homepage" class="block">
            <picture>
              <source type="image/avif" srcset="/img/logo-120.avif 1x, /img/logo-240.avif 2x" />
              <source type="image/webp" srcset="/img/logo-120.webp 1x, /img/logo-240.webp 2x" />
              <img
                src="/img/logo-120.webp"
                srcset="/img/logo-120.webp 1x, /img/logo-240.webp 2x"
                alt="Cadena Bitcoin Logo"
                loading="lazy"
                decoding="async"
                width="120" height="120"
                class="w-32 sm:w-36 md:w-40 h-auto object-contain"
              />
            </picture>
          </router-link>
        </div>

        <!-- 📚 Quick Links -->
        <nav
          class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2 text-sm"
          aria-label="Footer"
        >
          <div>
            <p class="text-base font-semibold text-secondary mb-4">Company</p>
            <ul class="space-y-2 text-white/80">
              <li><router-link to="/faq" class="hover:text-secondary">FAQ</router-link></li>
              <li><router-link to="/contact" class="hover:text-secondary">Contact Us</router-link></li>
              <li><router-link to="/security" class="hover:text-secondary">Security</router-link></li>
            </ul>
          </div>

          <div>
            <p class="text-base font-semibold text-secondary mb-4">Product</p>
            <ul class="space-y-2 text-white/80">
              <li><router-link to="/btcusd" class="hover:text-secondary">BTC/USD</router-link></li>
              <li><router-link to="/cadena-paper" class="hover:text-secondary">Cadena Paper</router-link></li>
              <li><router-link to="/knowledge-hub" class="hover:text-secondary">Knowledge Hub</router-link></li>
            </ul>
          </div>

          <div>
            <p class="text-base font-semibold text-secondary mb-4">Social Media</p>
            <ul class="space-y-2 text-white/80">
              <li>
                <a
                  href="https://x.com/cadenabitcoin"
                  class="hover:text-secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  X <span class="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt"
                  class="hover:text-secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  YouTube <span class="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CadenaWizard/cryptlib"
                  class="hover:text-secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub <span class="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-base font-semibold text-secondary mb-4">Legal</p>
            <ul class="space-y-2 text-white/80">
              <li><router-link to="/terms" class="hover:text-secondary">Terms</router-link></li>
              <li><router-link to="/privacy" class="hover:text-secondary">Privacy</router-link></li>
              <li><router-link to="/cookies" class="hover:text-secondary">Cookies</router-link></li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- 📎 Footer Bottom -->
      <div class="mt-12 border-t border-secondary/40 pt-6 text-sm text-center text-white/70">
        <small>&copy; {{ year }} Cadena Bitcoin. All rights reserved.</small>
        <div class="mt-2 text-white/60">Version {{ version }}</div>
        <address class="not-italic mt-2 text-white/60">
          Cadena Bitcoin is operated by Cadena Bitcoin S.A. de C.V., an El Salvador–licensed Bitcoin service provider.
          Address: Calle Llama del Bosque Poniente, Urbanización Madre Selva III, Edificio Avante, Local 3-13,
          Antiguo Cuscatlán, La Libertad, El Salvador.
        </address>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const year = computed(() => new Date().getFullYear())
const version = __APP_VERSION__
</script>

<style scoped>
/* no extra styling needed */
</style>
