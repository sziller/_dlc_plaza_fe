<template>
  <footer class="bg-white">
    <div class="max-w-screen-xl mx-auto px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 🔖 Logo & Title -->
        <div class="flex flex-col items-center lg:items-start">
          <div class="text-xl font-extrabold text-secondary mb-2">Cadena Bitcoin</div>

          <!-- Optimized logo: AVIF/WebP, density srcset, lazy -->
          <picture class="block">
            <source
              type="image/avif"
              srcset="/img/logo-120.avif 1x, /img/logo-240.avif 2x" />
            <source
              type="image/webp"
              srcset="/img/logo-120.webp 1x, /img/logo-240.webp 2x" />
            <img
              src="/img/logo-120.webp"
              srcset="/img/logo-120.webp 1x, /img/logo-240.webp 2x"
              alt="Cadena Bitcoin Logo"
              loading="lazy"
              decoding="async"
              class="w-32 sm:w-36 md:w-40 h-auto object-contain"
            />
          </picture>
        </div>

        <!-- 📚 Quick Links -->
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2 text-sm text-secondary">
          <div>
            <p class="text-base font-semibold text-secondary mb-4">Company</p>
            <ul class="space-y-2">
              <li><router-link to="/faq" class="hover:text-black">FAQ</router-link></li>
              <li><router-link to="/contact" class="hover:text-black">Contact Us</router-link></li>
            </ul>
          </div>

          <div>
            <p class="text-base font-semibold text-secondary mb-4">Product</p>
            <ul class="space-y-2">
              <li><router-link to="/btcusd" class="hover:text-black">BTC/USD</router-link></li>
              <li><router-link to="/cadena-paper" class="hover:text-black">Cadena Paper</router-link></li>
            </ul>
          </div>

          <div>
            <p class="text-base font-semibold text-secondary mb-4">Social Media</p>
            <ul class="space-y-2">
              <li><a href="https://x.com/cadenabitcoin" class="hover:text-black" rel="noopener noreferrer" target="_blank">X</a></li>
              <li><a href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt" class="hover:text-black" rel="noopener noreferrer" target="_blank">YouTube</a></li>
              <!-- Keep as-is if intentional; otherwise replace with your real GitHub URL -->
              <li><a href="tel:+13058311410" class="hover:text-black">GitHub</a></li>
            </ul>
          </div>

          <div>
            <p class="text-base font-semibold text-secondary mb-4">Legal</p>
            <ul class="space-y-2">
              <li><router-link to="/terms" class="hover:text-black">Terms</router-link></li>
              <li><router-link to="/privacy" class="hover:text-black">Privacy</router-link></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 📎 Footer Bottom -->
      <div class="mt-12 border-t border-gray-200 pt-6 text-sm text-center text-secondary">
        &copy; {{ new Date().getFullYear() }} Cadena Bitcoin. All rights reserved.
        <p>Cadena Bitcoin is operated by Cadena Bitcoin S.A. de C.V. an El Salvador liscenced Bitcoin Service provider. Address: Calle Llama del Bosque Poniente, Urbanización Madre Selva III, Edificio Avante, Local 3-13, Antiguo Cuscatlán, La Libertad, El Salvador</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// no script needed
</script>

<style scoped>
/* no extra styling needed */
</style>
