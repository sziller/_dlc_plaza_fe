<template>
  <main class="flex flex-col min-h-screen text-white pt-0 md:pt-4 relative">
    <!-- Gradient Background (matches Home) -->
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Content Section -->
    <section class="flex-1 px-4 py-4">
      <div class="w-full max-w-screen-xl mx-auto pb-10">
        <MarketOverviewTable />
        <p class="text-center text-xs text-white/50 mt-4">BTCUSD &middot; 50% LTV &middot; 365 day term</p>

        <div v-if="isLoggedIn" class="mt-10 space-y-8">
          <UsersLiquidity hide-when-empty />
          <UsersDLCS hide-when-empty />
        </div>
      </div>
    </section>
  </main>

  <TheFooter />
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
import MarketOverviewTable from '../components/MarketOverviewTable.vue'
import UsersLiquidity from '../components/UsersLiquidity.vue'
import UsersDLCS from '../components/UsersDLCS.vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'
import { notifySlackNewBtcusdUser } from '../api/slackNotify'
import { generateLoanSchema, setSchema } from '../plugins/structured-data.js'

const { user, isLoggedIn, setUserFromApi } = useAuth()

onMounted(() => {
  setSchema('structured-data-loan', generateLoanSchema({
    name: 'Cadena Bitcoin-Backed Loan',
    description: 'Non-custodial USD loan secured by Bitcoin collateral via a Discreet Log Contract (DLC). No margin calls — settlement occurs only at term end.',
    termDays: 365,
    ltvPercent: 50,
    aprPercent: 12,
    url: 'https://cadenabitcoin.com/allocate_liquidity'
  }))
  setUserFromApi()

  // Fire X conversion event for dashboard view
  if (typeof window !== 'undefined' && window.twq) {
    window.twq('event', 'tw-prcqf-qvn13', {
      email_address: null
    })
  }
})

// Fire Slack notification once user is resolved (requires signed-in user)
watchEffect(() => {
  const email = user.value?.payload?.email ?? user.value?.email ?? 'unknown'
  if (email && email !== 'unknown') {
    notifySlackNewBtcusdUser(email)
  }
})
</script>

<style scoped>
/* Bottom-anchored purple glow on a black base (same as Home) */
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
</style>
