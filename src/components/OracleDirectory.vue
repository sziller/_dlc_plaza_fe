<template>
  <section id="directory" class="max-w-5xl mx-auto px-6 mt-20" aria-labelledby="oracle-directory-title" data-testid="oracle-directory">
    <span class="text-xs font-semibold tracking-widest uppercase text-secondary">Oracle directory</span>
    <h2 id="oracle-directory-title" class="text-2xl md:text-3xl font-extrabold mb-2 leading-snug mt-2">
      Oracles available on Cadena.
    </h2>
    <p class="text-white/60 mb-8 max-w-2xl">
      Select an oracle to see who runs it, which markets it covers and where to find it.
      The list comes live from the Cadena platform for this environment.
    </p>

    <!-- Loading -->
    <div v-if="state === 'loading'" role="status" class="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/60" data-testid="oracle-dir-loading">
      Loading oracles…
    </div>

    <!-- Error -->
    <div v-else-if="state === 'error'" role="alert" class="rounded-xl border border-red-400/30 bg-red-500/[0.06] p-6" data-testid="oracle-dir-error">
      <p class="font-semibold text-white">The oracle list is temporarily unavailable.</p>
      <p class="text-sm text-white/60 mt-1">Please try again in a moment.</p>
      <button type="button" @click="load"
        class="mt-4 rounded-full border border-white/20 px-4 py-1.5 text-sm text-white hover:border-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
        Retry
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="state === 'empty'" class="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/60" data-testid="oracle-dir-empty">
      No oracles are configured right now.
    </div>

    <!-- Directory -->
    <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <!-- Left: list -->
      <fieldset class="min-w-0 space-y-3" data-testid="oracle-list">
        <legend class="sr-only">Select an oracle</legend>
        <div v-for="o in oracles" :key="o.id"
          class="rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-secondary"
          :class="[
            o.id === selectedId ? 'border-secondary/70 bg-secondary/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25',
            o.active === false ? 'opacity-70' : '',
          ]"
          :data-testid="`oracle-item-${o.id}`">
          <input type="radio" name="oracle-directory" class="sr-only" :id="`oracle-radio-${o.id}`"
            :value="o.id" v-model="selectedId" />
          <label :for="`oracle-radio-${o.id}`" class="block cursor-pointer">
            <span class="flex items-start justify-between gap-3">
              <span class="min-w-0">
                <span class="block font-semibold text-white break-words">{{ o.provider }}</span>
                <span class="block text-xs text-white/50 font-mono mt-0.5 break-all">{{ o.id }}</span>
              </span>
              <span class="shrink-0 inline-flex items-center gap-1.5 text-xs" :class="statusTextClass(o)">
                <span class="inline-block w-2 h-2 rounded-full" :class="statusDotClass(o)" aria-hidden="true"></span>
                {{ statusLabel(o) }}
              </span>
            </span>
          </label>
          <div class="mt-2 text-sm">
            <a v-if="o.homepageUrl" :href="o.homepageUrl" target="_blank" rel="noopener noreferrer"
              class="text-tertiary underline underline-offset-2 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
              :aria-label="`${o.provider} website (opens in a new tab)`">
              Website ↗
            </a>
            <span v-else class="text-white/40">Website not published</span>
          </div>
        </div>
      </fieldset>

      <!-- Right: details -->
      <div class="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-6" aria-live="polite" data-testid="oracle-details">
        <template v-if="selected">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="text-xl font-bold text-white break-words" data-testid="oracle-details-title">{{ selected.provider }}</h3>
            <span class="inline-flex items-center gap-1.5 text-xs rounded-full border border-white/15 px-2.5 py-0.5" :class="statusTextClass(selected)">
              <span class="inline-block w-2 h-2 rounded-full" :class="statusDotClass(selected)" aria-hidden="true"></span>
              {{ statusLabel(selected) }}
            </span>
          </div>

          <p class="text-white/50 italic mt-3" data-testid="oracle-details-description">
            Description coming soon. Detailed information about this oracle will be published here.
          </p>

          <dl class="mt-6 space-y-4 text-sm">
            <div>
              <dt class="text-xs uppercase tracking-widest text-white/40">Oracle ID</dt>
              <dd class="mt-1 font-mono text-white/80 break-all">{{ selected.id }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-widest text-white/40">Provider</dt>
              <dd class="mt-1 text-white/80">{{ selected.provider }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-widest text-white/40">Supported symbols</dt>
              <dd class="mt-1" data-testid="oracle-details-symbols">
                <ul v-if="selected.symbols.length" class="flex flex-wrap gap-2">
                  <li v-for="s in selected.symbols" :key="s"
                    class="rounded-full border border-white/15 bg-white/[0.04] px-3 py-0.5 font-mono text-xs text-white/80">{{ s }}</li>
                </ul>
                <span v-else class="text-white/40">Not specified</span>
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-widest text-white/40">Website</dt>
              <dd class="mt-1">
                <a v-if="selected.homepageUrl" :href="selected.homepageUrl" target="_blank" rel="noopener noreferrer"
                  class="text-tertiary underline underline-offset-2 hover:text-white break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm" data-testid="oracle-details-website">
                  Open Oracle ↗<span class="sr-only"> (opens in a new tab)</span>
                </a>
                <span v-else class="text-white/40">Not published</span>
              </dd>
            </div>
            <div v-if="selected.endpoint || selected.endpointPrice">
              <dt class="text-xs uppercase tracking-widest text-white/40">API</dt>
              <dd class="mt-1 space-y-1 text-white/70">
                <div v-if="selected.endpoint"><span class="text-white/40">Endpoint: </span><code class="font-mono text-xs break-all">{{ selected.endpoint }}</code></div>
                <div v-if="selected.endpointPrice"><span class="text-white/40">Price: </span><code class="font-mono text-xs break-all">{{ selected.endpointPrice }}</code></div>
              </dd>
            </div>
          </dl>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getOracleDirectory, type OracleDirectoryEntry } from '../api/oracle'

type LoadState = 'loading' | 'error' | 'empty' | 'ready'

const state = ref<LoadState>('loading')
const oracles = ref<OracleDirectoryEntry[]>([])
const selectedId = ref<string>('')

const selected = computed(() => oracles.value.find((o) => o.id === selectedId.value) ?? null)

// Active = configured active flag. We only know the configured flag, not live health,
// so the label says "Active", never "Operational".
function statusLabel(o: OracleDirectoryEntry): string {
  if (o.active === true) return 'Active'
  if (o.active === false) return 'Inactive'
  return 'Status unavailable'
}
function statusDotClass(o: OracleDirectoryEntry): string {
  return o.active === true ? 'bg-green-400' : o.active === false ? 'bg-red-400' : 'bg-white/30'
}
function statusTextClass(o: OracleDirectoryEntry): string {
  return o.active === true ? 'text-green-300' : o.active === false ? 'text-red-300' : 'text-white/50'
}

async function load() {
  state.value = 'loading'
  try {
    const list = await getOracleDirectory()
    oracles.value = list
    if (list.length === 0) {
      selectedId.value = ''
      state.value = 'empty'
      return
    }
    // default: first oracle that is not known to be inactive; otherwise simply the first
    selectedId.value = (list.find((o) => o.active !== false) ?? list[0]).id
    state.value = 'ready'
  } catch (e) {
    console.debug('Oracle directory fetch failed:', e)
    oracles.value = []
    selectedId.value = ''
    state.value = 'error'
  }
}

onMounted(() => {
  // The build-time prerender runs against a preview server that has no backend;
  // keep the neutral "Loading…" state in the static snapshot instead of an error.
  if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
  load()
})
</script>
