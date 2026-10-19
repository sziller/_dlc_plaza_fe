<template>
  <div class="chatbot-wrapper">
    <Transition name="chat">
      <div
        v-if="open"
        class="chat-window"
        :style="{ width: chatW + 'px', height: chatH + 'px' }"
      >
        <!-- Resize handle — top-left corner -->
        <div
          class="resize-handle"
          @mousedown.prevent="startResize"
          @touchstart.prevent="startResizeTouch"
          title="Drag to resize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 9L9 1M5 9L9 5M1 5L5 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <div class="chat-title">Cadena Assistant</div>
              <div class="chat-status">
                <span class="status-dot"></span> Online
              </div>
            </div>
          </div>
          <button class="close-btn" @click="open = false" aria-label="Close chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="chat-messages" ref="messagesEl">
          <!-- Welcome state with quick actions -->
          <div v-if="messages.length === 0" class="welcome-state">
            <div class="welcome-avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <p class="welcome-greeting">Hi there! 👋</p>
            <p class="welcome-sub">What are you looking to do today?</p>
            <div class="quick-chips">
              <button class="chip" @click="quickSend('I want to borrow against my Bitcoin')">
                <span class="chip-icon">💰</span> Borrow against BTC
              </button>
              <button class="chip" @click="quickSend('I want to lend and earn yield on Bitcoin')">
                <span class="chip-icon">📈</span> Lend &amp; earn yield
              </button>
              <button class="chip" @click="quickSend('How do I create an account?')">
                <span class="chip-icon">🆕</span> Create an account
              </button>
              <button class="chip" @click="quickSend('How does Cadena work?')">
                <span class="chip-icon">❓</span> How it works
              </button>
            </div>
          </div>

          <div v-for="(msg, i) in messages" :key="i" class="message" :class="msg.role">
            <div v-if="msg.role === 'assistant'" class="bubble md" v-html="marked(msg.content)"></div>
            <div v-else class="bubble">{{ msg.content }}</div>
          </div>
          <div v-if="loading" class="message assistant">
            <div class="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <a
          href="https://calendly.com/cadenabitcoin-info/30min"
          target="_blank"
          rel="noopener noreferrer"
          class="chat-cta"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
          </svg>
          Book a free 30-min call with our team
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:0.6">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </a>

        <div class="chat-input-area">
          <input
            ref="inputEl"
            v-model="draft"
            type="text"
            placeholder="Ask a question…"
            maxlength="500"
            :disabled="loading"
            @keydown.enter.prevent="send"
            class="chat-input"
          />
          <button
            class="send-btn"
            :disabled="!draft.trim() || loading"
            @click="send"
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Teaser card (auto-appears after delay) -->
    <Transition name="teaser">
      <div v-if="showTeaser && !open" class="teaser-card">
        <button class="teaser-dismiss" @click.stop="dismissTeaser" aria-label="Dismiss">×</button>
        <p class="teaser-heading">Need help getting started?</p>
        <div class="teaser-chips">
          <button @click="quickOpen('I want to borrow against my Bitcoin')">💰 Borrow</button>
          <button @click="quickOpen('I want to lend and earn yield on Bitcoin')">📈 Lend</button>
          <button @click="quickOpen('How do I create an account?')">🆕 Sign up</button>
        </div>
        <button class="teaser-chat-btn" @click="openChat">Chat with us →</button>
      </div>
    </Transition>

    <!-- Bubble button -->
    <button
      class="chat-bubble"
      :class="{ 'is-pulsing': !open && showPulse }"
      @click="toggleChat"
      :aria-label="open ? 'Close chat' : 'Open chat'"
    >
      <Transition name="icon" mode="out-in">
        <svg v-if="!open" key="chat" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        <svg v-else key="close" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </Transition>
      <span v-if="unread > 0 && !open" class="unread-badge">{{ unread }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

const SERVER_URL = 'https://chatbot-server-production-3eee.up.railway.app/chat'

const BRAND = '#6738e3'

const MIN_W = 280
const MIN_H = 320
const DEFAULT_W = 340
const DEFAULT_H = 460

const open       = ref(false)
const draft      = ref('')
const loading    = ref(false)
const unread     = ref(0)
const messages   = ref([])
const messagesEl = ref(null)
const inputEl    = ref(null)
const showTeaser = ref(false)
const showPulse  = ref(false)

const chatW = ref(DEFAULT_W)
const chatH = ref(DEFAULT_H)

let teaserTimer = null
let pulseTimer  = null

onMounted(() => {
  const seen = sessionStorage.getItem('cadena_chat_seen')
  if (!seen) {
    pulseTimer = setTimeout(() => { showPulse.value = true }, 2500)
    teaserTimer = setTimeout(() => { showTeaser.value = true }, 4000)
  }
})

function dismissTeaser() {
  showTeaser.value = false
  showPulse.value  = false
  sessionStorage.setItem('cadena_chat_seen', '1')
}

function openChat() {
  showTeaser.value = false
  showPulse.value  = false
  sessionStorage.setItem('cadena_chat_seen', '1')
  open.value = true
  unread.value = 0
  nextTick(() => inputEl.value?.focus())
}

function quickOpen(text) {
  openChat()
  nextTick(() => quickSend(text))
}

function quickSend(text) {
  draft.value = text
  send()
}

// ── Resize ────────────────────────────────────────────────────────────────────

let resizing = false
let startX = 0, startY = 0, startW = 0, startH = 0

function startResize(e) {
  resizing = true
  startX = e.clientX
  startY = e.clientY
  startW = chatW.value
  startH = chatH.value
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
  document.body.style.userSelect = 'none'
}

function startResizeTouch(e) {
  const t = e.touches[0]
  resizing = true
  startX = t.clientX
  startY = t.clientY
  startW = chatW.value
  startH = chatH.value
  window.addEventListener('touchmove', onResizeTouch, { passive: false })
  window.addEventListener('touchend', stopResizeTouch)
}

function onResize(e) {
  if (!resizing) return
  // dragging left = wider, dragging up = taller (window anchored bottom-right)
  chatW.value = Math.max(MIN_W, startW + (startX - e.clientX))
  chatH.value = Math.max(MIN_H, startH + (startY - e.clientY))
}

function onResizeTouch(e) {
  e.preventDefault()
  if (!resizing) return
  const t = e.touches[0]
  chatW.value = Math.max(MIN_W, startW + (startX - t.clientX))
  chatH.value = Math.max(MIN_H, startH + (startY - t.clientY))
}

function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
  document.body.style.userSelect = ''
}

function stopResizeTouch() {
  resizing = false
  window.removeEventListener('touchmove', onResizeTouch)
  window.removeEventListener('touchend', stopResizeTouch)
}

onBeforeUnmount(() => {
  stopResize()
  stopResizeTouch()
  clearTimeout(teaserTimer)
  clearTimeout(pulseTimer)
})

// ── Chat logic ────────────────────────────────────────────────────────────────

function toggleChat() {
  open.value = !open.value
  if (open.value) {
    unread.value = 0
    showTeaser.value = false
    showPulse.value  = false
    sessionStorage.setItem('cadena_chat_seen', '1')
    nextTick(() => inputEl.value?.focus())
  }
}

async function send() {
  const text = draft.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  draft.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value.map(m => ({ role: m.role, content: m.content })),
      }),
    })

    if (!res.ok) throw new Error(`Server error ${res.status}`)

    const data = await res.json()
    const reply = data.reply ?? data.response ?? data.message ?? 'No response received.'
    messages.value.push({ role: 'assistant', content: reply })

    if (!open.value) unread.value++
  } catch {
    messages.value.push({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.' })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

watch(open, (val) => { if (val) scrollToBottom() })
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* ── Bubble ── */
.chat-bubble {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #6738e3;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(103, 56, 227, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  flex-shrink: 0;
}

.chat-bubble:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(103, 56, 227, 0.65);
}

.chat-bubble:active {
  transform: scale(0.96);
}

.chat-bubble.is-pulsing::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(103, 56, 227, 0.5);
  animation: pulse-ring 1.8s ease-out infinite;
}

@keyframes pulse-ring {
  0%   { transform: scale(0.9); opacity: 0.8; }
  70%  { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1.25); opacity: 0; }
}

/* ── Teaser card ── */
.teaser-card {
  background: #1a1a2e;
  border: 1px solid rgba(103, 56, 227, 0.4);
  border-radius: 16px;
  padding: 16px;
  width: 240px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(103,56,227,0.12);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.teaser-dismiss {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.35);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 2px 4px;
  transition: color 0.15s;
}

.teaser-dismiss:hover { color: rgba(255,255,255,0.7); }

.teaser-heading {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  padding-right: 20px;
}

.teaser-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.teaser-chips button {
  background: rgba(103, 56, 227, 0.15);
  border: 1px solid rgba(103, 56, 227, 0.3);
  border-radius: 20px;
  color: rgba(255,255,255,0.85);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  font-family: inherit;
}

.teaser-chips button:hover {
  background: rgba(103, 56, 227, 0.3);
  border-color: rgba(103, 56, 227, 0.6);
}

.teaser-chat-btn {
  background: #6738e3;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 14px;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.15s;
  font-family: inherit;
}

.teaser-chat-btn:hover { opacity: 0.85; }

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0a0a0a;
}

/* ── Window ── */
.chat-window {
  background: #111111;
  border: 1px solid rgba(103, 56, 227, 0.3);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(103, 56, 227, 0.08);
  position: relative;
  min-width: 280px;
  min-height: 320px;
}

/* ── Resize handle ── */
.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 6px;
  cursor: nw-resize;
  color: rgba(103, 56, 227, 0.45);
  z-index: 10;
  border-radius: 16px 0 8px 0;
  transition: color 0.15s;
}

.resize-handle:hover {
  color: rgba(103, 56, 227, 0.9);
}

/* ── Header ── */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 14px 32px;
  background: linear-gradient(135deg, rgba(103, 56, 227, 0.14), rgba(131, 135, 195, 0.06));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6738e3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.chat-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.chat-status {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.close-btn:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.07);
}

/* ── Messages ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(103, 56, 227, 0.3) transparent;
}

/* ── Welcome state ── */
.welcome-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 4px 4px;
  gap: 8px;
  flex: 1;
}

.welcome-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6738e3, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(103,56,227,0.4);
  margin-bottom: 2px;
}

.welcome-greeting {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.welcome-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  margin: 0;
}

.quick-chips {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
  margin-top: 6px;
}

.chip {
  background: rgba(103, 56, 227, 0.1);
  border: 1px solid rgba(103, 56, 227, 0.28);
  border-radius: 12px;
  color: rgba(255,255,255,0.85);
  font-size: 13px;
  font-weight: 500;
  padding: 10px 14px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
  font-family: inherit;
}

.chip:hover {
  background: rgba(103, 56, 227, 0.22);
  border-color: rgba(103, 56, 227, 0.55);
  transform: translateX(2px);
}

.chip-icon { font-size: 15px; flex-shrink: 0; }

.message { display: flex; }
.message.user      { justify-content: flex-end; }
.message.assistant { justify-content: flex-start; }

.bubble {
  max-width: 80%;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
}

.message.user .bubble {
  background: #6738e3;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .bubble {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.85);
  border-bottom-left-radius: 4px;
}

/* Markdown output */
.bubble.md :deep(p)         { margin: 0 0 0.5em; }
.bubble.md :deep(p:last-child) { margin-bottom: 0; }
.bubble.md :deep(ul),
.bubble.md :deep(ol)        { margin: 0.4em 0 0.5em 1.2em; padding: 0; }
.bubble.md :deep(li)        { margin-bottom: 0.2em; }
.bubble.md :deep(strong)    { color: #fff; font-weight: 600; }
.bubble.md :deep(em)        { opacity: 0.85; }
.bubble.md :deep(code)      { background: rgba(103,56,227,0.2); border-radius: 4px; padding: 1px 5px; font-size: 12px; font-family: monospace; }
.bubble.md :deep(pre)       { background: rgba(0,0,0,0.35); border-radius: 8px; padding: 10px 12px; overflow-x: auto; margin: 0.5em 0; }
.bubble.md :deep(pre code)  { background: none; padding: 0; font-size: 12px; }
.bubble.md :deep(a)         { color: #8387c3; text-decoration: underline; }
.bubble.md :deep(hr)        { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0.6em 0; }
.bubble.md :deep(h1),
.bubble.md :deep(h2),
.bubble.md :deep(h3)        { font-size: 13px; font-weight: 600; color: #fff; margin: 0.5em 0 0.3em; }
.bubble.md :deep(blockquote){ border-left: 2px solid #6738e3; margin: 0.4em 0; padding-left: 10px; opacity: 0.75; }

/* Typing */
.bubble.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.bubble.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  animation: bounce 1.2s infinite;
}

.bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
.bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30%            { transform: translateY(-5px); }
}

/* ── CTA ── */
.chat-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(103, 56, 227, 0.12);
  border-top: 1px solid rgba(103, 56, 227, 0.18);
  color: rgba(103, 56, 227, 0.9);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.chat-cta:hover {
  background: rgba(103, 56, 227, 0.22);
  color: #8b6ff0;
}

/* ── Input ── */
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  color: white;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.chat-input::placeholder { color: rgba(255, 255, 255, 0.22); }
.chat-input:focus        { border-color: rgba(103, 56, 227, 0.55); }
.chat-input:disabled     { opacity: 0.5; }

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #6738e3;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.2s, transform 0.15s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled)  { opacity: 0.82; }
.send-btn:active:not(:disabled) { transform: scale(0.93); }
.send-btn:disabled { opacity: 0.28; cursor: not-allowed; }

/* ── Transitions ── */
.chat-enter-active, .chat-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chat-enter-from, .chat-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

.teaser-enter-active, .teaser-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.teaser-enter-from, .teaser-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

.icon-enter-active, .icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-enter-from { opacity: 0; transform: rotate(-45deg) scale(0.7); }
.icon-leave-to   { opacity: 0; transform: rotate(45deg)  scale(0.7); }

/* ── Mobile ── */
@media (max-width: 480px) {
  .chatbot-wrapper { bottom: 16px; right: 16px; }
  .resize-handle   { display: none; }
  .chat-window     { width: calc(100vw - 32px) !important; height: 420px !important; }
  .teaser-card     { width: 200px; }
}
</style>
