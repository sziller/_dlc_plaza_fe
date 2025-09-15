<template>
  <!-- Teleport so it's always anchored to the window, regardless of where you mount it -->
  <teleport to="body">
    <!-- Floating launcher button (shown when chat is closed) -->
    <button
      v-if="!isOpen"
      class="fixed bottom-5 left-5 z-50 rounded-full shadow-lg bg-secondary text-white backdrop-blur px-4 py-3 flex items-center gap-2 hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-controls="cbw-panel"
      @click="toggle()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9.83l-3.59 3.59A1 1 0 0 1 5 20v-3H5a3 3 0 0 1-3-3V5z"/></svg>
      <span class="text-sm font-medium">Chat</span>
    </button>

    <!-- Chat panel -->
    <section
      v-show="isOpen"
      id="cbw-panel"
      class="fixed bottom-5 left-5 z-50 w-[360px] max-w-[90vw] h-[520px] max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0b0b0c] text-white"
      role="dialog"
      :aria-labelledby="titleId"
      aria-modal="true"
    >
      <!-- Header -->
      <header class="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" aria-hidden="true"></div>
          <h2 :id="titleId" class="text-sm font-semibold tracking-wide">Cadena AI Assistant</h2>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            class="p-1.5 rounded hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            @click="minimize()"
            aria-label="Minimize"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M5 11h14v2H5z"/></svg>
          </button>
          <button
            class="p-1.5 rounded hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            @click="closePanel()"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.18 12 2.89 5.71 4.3 4.29 10.59 10.6l6.3-6.3z"/></svg>
          </button>
        </div>
      </header>

      <!-- Messages -->
      <div
        ref="scrollRef"
        class="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gradient-to-b from-black/20 to-black/0"
      >
        <template v-if="messages.length">
          <div v-for="m in messages" :key="m.id" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <div
              class="max-w-[82%] rounded-xl px-3 py-2 text-sm leading-relaxed"
              :class="m.role === 'user' ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/10'"
            >
              <p class="whitespace-pre-wrap">{{ m.text }}</p>
              <time class="block mt-1 text-[11px] opacity-60" :datetime="new Date(m.ts).toISOString()">{{ formatTime(m.ts) }}</time>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-xs text-white/70 leading-5">
            <p class="mb-1">Hey! Drop your question below.</p>
            <p class="opacity-80">I’ll reply here and keep the thread in this little window.</p>
          </div>
        </template>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex items-center gap-2 text-xs text-white/70">
          <span class="inline-flex gap-1 pl-1 pr-2 py-1 rounded bg-white/10 border border-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.2s]"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:0.2s]"></span>
          </span>
          <span>typing…</span>
        </div>
      </div>

      <!-- Composer -->
      <form class="p-3 border-t border-white/10 bg-black/40 backdrop-blur" @submit.prevent="onSubmit">
        <div class="flex items-end gap-2">
          <textarea
            ref="inputRef"
            v-model.trim="draft"
            class="flex-1 resize-none rounded-lg bg-white/95 text-black placeholder-black/50 px-3 py-2 text-sm focus:outline-none min-h-[40px] max-h-[120px]"
            placeholder="Type a message…"
            rows="1"
            @keydown.enter.exact.prevent="onSubmit"
            @input="autoGrow"
            :disabled="isSending"
            aria-label="Message"
          />
          <button
            type="submit"
            class="shrink-0 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-secondary hover:bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!draft || isSending"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="m2.01 21 20-9L2.01 3 2 10l14 2-14 2z"/></svg>
            Send
          </button>
        </div>
      </form>
    </section>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'

/**
 * Minimal floating chat widget for Vue 3 + Tailwind.
 * - Stays fixed bottom-left
 * - Local history persistence
 * - API hook stubbed via sendToApi()
 * - Teleports to <body> so it's outside layouts/overflow
 */

const titleId = `cbw-title-${Math.random().toString(36).slice(2)}`

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

const STORAGE_KEY = 'chatbot:history:v1'

const isOpen = ref(false)
const draft = ref('')
const isSending = ref(false)
const isTyping = ref(false)
const messages = ref<ChatMessage[]>([])

const inputRef = ref<HTMLTextAreaElement | null>(null)
const scrollRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // hydrate from storage
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) messages.value = JSON.parse(raw)
  } catch {}
})

watch(messages, () => {
  // persist and keep view pinned to bottom
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value)) } catch {}
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}, { deep: true })

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) nextTick(() => inputRef.value?.focus())
}
function minimize() { isOpen.value = false }
function closePanel() { isOpen.value = false }

function autoGrow(e: Event) {
  const ta = e.target as HTMLTextAreaElement
  ta.style.height = 'auto'
  ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function onSubmit() {
  if (!draft.value.trim() || isSending.value) return
  const text = draft.value
  draft.value = ''

  const userMsg: ChatMessage = {
    id: crypto.randomUUID?.() || String(Date.now()),
    role: 'user',
    text,
    ts: Date.now(),
  }
  messages.value.push(userMsg)

  isSending.value = true
  isTyping.value = true

  try {
    const reply = await sendToApi(text, messages.value)
    const botMsg: ChatMessage = {
      id: crypto.randomUUID?.() || String(Date.now() + 1),
      role: 'assistant',
      text: reply,
      ts: Date.now(),
    }
    messages.value.push(botMsg)
  } catch (err: any) {
    const botMsg: ChatMessage = {
      id: crypto.randomUUID?.() || String(Date.now() + 2),
      role: 'assistant',
      text: 'Hmm, something went sideways reaching the server. Try again in a moment.',
      ts: Date.now(),
    }
    messages.value.push(botMsg)
    // Optional: console.error(err)
  } finally {
    isSending.value = false
    isTyping.value = false
    nextTick(() => inputRef.value?.focus())
  }
}

/**
 * 🔌 API HOOK — replace this with your actual API call later.
 * Example swap-in:
 *   const reply = await axios.post('/api/chat', { message, history }).then(r => r.data.reply)
 */
async function sendToApi(message: string, history: ChatMessage[]): Promise<string> {
  // TODO: integrate real network call here
  await new Promise(r => setTimeout(r, 600))
  // simple placeholder echo; feel free to remove
  const lastUser = message.slice(0, 300)
  return `You said: "${lastUser}"\n(LLM/API wiring goes here.)`
}
</script>

<!-- No custom CSS required if you use Tailwind. If not using Tailwind, you can add minimal styles here. -->
<style scoped>
/***** Optional: fallback animations if Tailwind not present *****/
@keyframes bounce { 0%, 100% { transform: translateY(-15%);} 50% { transform: translateY(0);} }
.animate-bounce { animation: bounce 0.9s infinite; }
</style>
