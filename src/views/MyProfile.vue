<template>
  <main class="min-h-screen text-white pt-[150px] px-4 sm:px-6 pb-20 relative overflow-hidden">
    <div class="fixed inset-0 -z-10 page-gradient"></div>

    <div class="max-w-6xl mx-auto space-y-6">

      <!-- Header -->
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest text-white/40 mb-1">Dashboard</p>
          <h1 class="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        <div class="flex items-center gap-2">
          <a
            v-if="isAdmin"
            href="/admin.html"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 hover:bg-secondary/30 text-sm text-white transition"
          >
            Launch Admin
          </a>
          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 text-sm text-white/80 hover:text-white transition disabled:opacity-40"
            :disabled="loading"
            :aria-busy="loading ? 'true' : 'false'"
            @click="reloadAll"
          >
            <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
            {{ loading ? 'Refreshing…' : 'Refresh' }}
          </button>
        </div>
      </header>

      <!-- Error -->
      <div v-if="error" class="flex items-start gap-3 p-4 rounded-2xl border border-red-500/20 bg-red-500/[0.08]">
        <svg class="w-4 h-4 text-red-400 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="text-sm font-semibold text-red-300">Something went wrong</p>
          <p class="text-xs text-red-200/70 mt-0.5 break-words">{{ error }}</p>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-else-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="h-24 rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
      </div>

      <!-- Profile Data -->
      <div v-else-if="profile" class="space-y-5">

        <!-- PENDING REGISTRATION -->
        <section v-if="isPending" class="p-4 sm:p-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            <h2 class="text-lg font-semibold">Finish setting up your account</h2>
          </div>
          <p class="text-sm text-white/80 leading-relaxed">
            <span class="font-semibold text-white">Sign out, sign back in</span>, then open the
            <span class="font-semibold text-white">Cadena Signer</span> app and scan the QR code to complete registration.
          </p>
          <div class="flex flex-col gap-3 sm:gap-1 text-sm">
            <div class="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <span class="text-white/40 sm:w-16 sm:shrink-0">Email</span>
              <span class="text-white font-medium break-all">{{ profile.payload.email }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <span class="text-white/40 sm:w-16 sm:shrink-0">Status</span>
              <span class="text-white font-medium">{{ registrationLevel }}</span>
            </div>
          </div>
        </section>

        <!-- NORMAL PROFILE -->
        <template v-else>

          <!-- Account info card -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-4">
            <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">Account</h2>
            <div class="space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                <span class="text-sm text-white/40 sm:w-32 sm:shrink-0 sm:pt-0.5">Email</span>
                <span class="text-base text-white font-medium break-all">{{ profile.payload.email }}</span>
              </div>
              <div class="w-full h-px bg-white/[0.06]" />
              <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                <span class="text-sm text-white/40 sm:w-32 sm:shrink-0 sm:pt-0.5">XPUB</span>
                <span class="text-sm text-white/70 font-mono break-all">{{ profile.payload.xpub }}</span>
              </div>
              <div class="w-full h-px bg-white/[0.06]" />
              <div class="flex flex-col sm:flex-row sm:items-start sm:gap-3 gap-1.5">
                <span class="text-sm text-white/40 sm:w-32 sm:shrink-0">Registration</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-xs font-semibold text-white w-fit">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
                  {{ registrationLevel }}
                </span>
              </div>
            </div>
          </section>

          <!-- Zero-balance onboarding banner -->
          <section v-if="isZeroBalance && !isPending" class="p-6 rounded-2xl border border-secondary/30 bg-secondary/[0.07] space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-secondary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-white">Your wallet is empty — let's get you funded</p>
                <p class="text-xs text-white/60 leading-relaxed">
                  To create a Bitcoin-backed loan you need BTC in your Cadena wallet. Open the Signer App, find your deposit address under <em>Receive</em>, and send Bitcoin there from your exchange or wallet.
                </p>
              </div>
            </div>
            <router-link
              to="/get-started"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-semibold text-white transition"
            >
              View step-by-step guide
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </router-link>
          </section>

          <!-- Balances -->
          <section class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-5 sm:p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-2">
              <p class="text-sm uppercase tracking-widest text-white/40">Liquid Balance</p>
              <p class="text-4xl font-bold tabular-nums">{{ formatBtc(profile.payload.balance_derived) }}</p>
              <p class="text-sm text-white/50">BTC</p>
            </div>
            <div class="p-5 sm:p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-2">
              <p class="text-sm uppercase tracking-widest text-white/40">Wallet Balance</p>
              <p class="text-4xl font-bold tabular-nums">{{ formatBtc(profile.payload.balance_onchain) }}</p>
              <p class="text-sm text-white/50">BTC</p>
            </div>
          </section>

          <!-- Create Loan -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="space-y-1">
              <h2 class="text-base font-semibold">Create a Loan</h2>
              <p class="text-sm text-white/50">Borrow against your Bitcoin or lend for fixed returns.</p>
            </div>
            <router-link
              to="/allocate_liquidity"
              class="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/80 transition w-full sm:w-auto"
            >
              Get started
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </router-link>
          </section>

          <!-- Locked Collateral -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-4">
            <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">Locked Collateral</h2>
            <UsersLiquidity />
          </section>

          <!-- Active DLCs -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <UsersDLCS />
          </section>

          <!-- Referrals -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-4">
            <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">Referrals</h2>

            <div class="space-y-3" v-if="refCode">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="text-sm text-white/40 w-28 shrink-0">Your Code</span>
                <code class="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-mono break-all text-white">{{ refCode }}</code>
                <button
                  class="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 text-xs text-white transition"
                  @click="copyText(refCode, 'code')"
                >{{ copiedWhat === 'code' ? '✓ Copied' : 'Copy' }}</button>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="text-sm text-white/40 w-28 shrink-0">Share Link</span>
                <a
                  v-if="refLink"
                  :href="refLink"
                  class="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-mono break-all text-white/70 hover:text-white transition underline underline-offset-2"
                  target="_blank" rel="noopener"
                >{{ refLink }}</a>
                <span v-else class="text-xs text-white/30">Not available</span>
                <button
                  v-if="refLink"
                  class="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 text-xs text-white transition"
                  @click="copyText(refLink, 'link')"
                >{{ copiedWhat === 'link' ? '✓ Copied' : 'Copy' }}</button>
              </div>

              <div v-if="refParent" class="flex items-center gap-2 text-xs">
                <span class="text-white/40">Referred by</span>
                <code class="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60">{{ refParent }}</code>
              </div>
            </div>

            <p v-else class="text-sm text-white/30">No referral code on file.</p>
          </section>

          <!-- Mailing list -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="space-y-1">
              <h2 class="text-base font-semibold">Stay in the loop</h2>
              <p class="text-sm text-white/50">Product updates and educational content, straight to your inbox.</p>
            </div>
            <button
              type="button"
              class="shrink-0 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:border-secondary hover:text-secondary transition w-full sm:w-auto"
              @click="showMailingList = true"
            >
              Subscribe
            </button>
          </section>

          <!-- Add funds -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-5">
            <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">Add Funds</h2>

            <div v-if="addrError" class="flex items-start justify-between gap-3 p-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] text-sm">
              <span class="text-amber-100/80">Please login to the Cadena Bitcoin Signer App and <router-link to="/register?step=3" class="underline underline-offset-2 font-semibold hover:text-white transition-colors">scan the QR code</router-link>.</span>
              <button type="button" class="shrink-0 px-3 py-1 rounded-lg border border-white/20 text-xs text-white hover:bg-white/10 transition" @click="fetchTopup">Retry</button>
            </div>

            <div v-else-if="addrLoading" class="flex items-center gap-2 text-sm text-white/50">
              <div class="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" aria-hidden="true" />
              Fetching deposit address…
            </div>

            <div v-else class="space-y-4">
              <div v-if="address" class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="text-sm text-white/40 w-24 shrink-0">Address</span>
                <code class="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-mono break-all text-white/80">{{ address }}</code>
                <button
                  class="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 text-xs text-white transition"
                  @click="copyAddress"
                  :aria-label="copied ? 'Address copied' : 'Copy address'"
                >{{ copied ? '✓ Copied' : 'Copy' }}</button>
              </div>

              <div class="flex justify-center">
                <div class="qr-box rounded-2xl bg-white w-full max-w-[360px] aspect-square overflow-hidden flex items-center justify-center p-3">
                  <template v-if="qrCode">
                    <img :src="qrCode" alt="QR code for your top-up / signer link" class="w-full h-full block object-contain rounded-xl" />
                  </template>
                  <p v-else class="text-black/50 text-sm px-2 text-center">Loading QR Code…</p>
                </div>
              </div>

              <div v-if="qrError" class="text-xs text-red-300/70">{{ qrError }}</div>
            </div>
          </section>

          <!-- DLC History -->
          <section class="p-4 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-4">
            <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">DLC History</h2>

            <div v-if="pastError" class="p-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] text-xs text-red-300">{{ pastError }}</div>
            <div v-else-if="pastLoading" class="flex items-center gap-2 text-sm text-white/50">
              <div class="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" aria-hidden="true" />
              Loading history…
            </div>
            <div v-else>
              <p v-if="pastRows.length === 0" class="text-sm text-white/30">No past DLCs found.</p>
              <div v-else class="overflow-auto -mx-2">
                <table class="min-w-full table-auto border-collapse text-white mx-2">
                  <thead>
                    <tr class="text-left text-xs uppercase tracking-wider text-white/40">
                      <th class="px-3 py-2 whitespace-nowrap font-medium">DLC ID</th>
                      <th class="px-3 py-2 whitespace-nowrap font-medium">Term</th>
                      <th class="px-3 py-2 whitespace-nowrap font-medium">LTV</th>
                      <th class="px-3 py-2 whitespace-nowrap font-medium">Annualized</th>
                      <th class="px-3 py-2 whitespace-nowrap font-medium">Settled At</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm">
                    <tr
                      v-for="r in pastRows"
                      :key="r.fullId"
                      class="border-b border-white/[0.06] hover:bg-white/[0.04] cursor-pointer transition"
                      role="button"
                      tabindex="0"
                      @click="selectPast(r)"
                      @keydown.enter.prevent="selectPast(r)"
                      @keydown.space.prevent="selectPast(r)"
                    >
                      <td class="px-3 py-3 font-mono text-xs text-white/60 whitespace-nowrap">{{ r.idShort }}</td>
                      <td class="px-3 py-3 whitespace-nowrap">{{ r.term }}</td>
                      <td class="px-3 py-3 whitespace-nowrap">{{ r.ltv }}</td>
                      <td class="px-3 py-3 text-green-300 whitespace-nowrap">{{ r.annualized }}</td>
                      <td class="px-3 py-3 text-white/60 text-xs whitespace-nowrap">{{ r.settledAt }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- Danger Zone -->
          <section class="p-4 sm:p-8 rounded-2xl border border-red-500/[0.15] bg-red-500/[0.05] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="space-y-1">
              <h2 class="text-base font-semibold text-red-300">Delete Account</h2>
              <p class="text-sm text-red-200/50">Permanently removes your account and data. Cannot be undone.</p>
            </div>
            <button
              class="shrink-0 px-5 py-2.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold transition w-full sm:w-auto"
              @click="delOpen = true"
            >Delete account</button>
          </section>

        </template>
      </div>
    </div>
  </main>

  <!-- DLC Detail Modal -->
  <DlcDetails
    v-if="selectedDlc"
    :dlc="selectedDlc"
    :is-own="true"
    :user-email="userEmail"
    @close="selectedDlc = null"
    @deleted="onPastDeleted"
  />

  <!-- Delete Account Confirm Modal -->
  <transition name="fade">
    <div
      v-if="delOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-title"
    >
      <!-- backdrop -->
      <div class="absolute inset-0 bg-black/70" @click="delOpen = false; delConfirm = ''; delEmail = ''; delError = null"></div>

      <!-- dialog -->
      <div class="relative w-[min(520px,92vw)] rounded-2xl border border-white/[0.08] bg-[#0a0f1c] p-6 text-white shadow-2xl space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 id="del-title" class="text-lg font-semibold">Delete account</h3>
        </div>

        <div class="space-y-2 text-white/60 text-sm leading-relaxed">
          <p>Your <span class="text-white font-medium">Cadena</span> profile will be permanently removed. Active DLCs are unaffected.</p>
          <ul class="space-y-1 text-xs mt-2">
            <li class="flex items-start gap-2"><span class="text-white/30 mt-0.5">·</span> Funds on existing Cadena addresses remain unchanged</li>
            <li class="flex items-start gap-2"><span class="text-white/30 mt-0.5">·</span> Your Seed Phrase stays valid in any wallet software</li>
            <li class="flex items-start gap-2"><span class="text-white/30 mt-0.5">·</span> We delete your email, XPUB, UTXO-set, and placed Offers</li>
          </ul>
        </div>

        <p class="text-xs text-white/50">
          Type <code class="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-white">DELETE</code> and your email to confirm.
        </p>

        <div class="space-y-2">
          <input
            v-model.trim="delConfirm"
            type="text"
            autocomplete="off"
            spellcheck="false"
            class="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 transition"
            placeholder='Type "DELETE"'
            :disabled="delBusy"
          />
          <input
            v-model.trim="delEmail"
            type="email"
            autocomplete="off"
            spellcheck="false"
            class="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 transition"
            placeholder="Your email address"
            :disabled="delBusy"
          />
        </div>

        <div v-if="delError" class="p-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] text-xs text-red-300">
          {{ delError }}
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            class="px-4 py-2 rounded-full text-sm border border-white/[0.08] hover:bg-white/[0.06] text-white/60 hover:text-white transition"
            @click="delOpen = false; delConfirm = ''; delEmail = ''; delError = null"
            :disabled="delBusy"
          >Cancel</button>
          <button
            class="px-5 py-2 rounded-full text-sm bg-red-600/80 hover:bg-red-600 text-white font-semibold disabled:opacity-40 transition"
            :disabled="delBusy || delConfirm !== 'DELETE' || delEmail.toLowerCase() !== userEmail"
            @click="onConfirmDelete"
          >{{ delBusy ? 'Deleting…' : 'Delete account' }}</button>
        </div>
      </div>
    </div>
  </transition>

  <TheFooter/>

  <MailingListModal
    :open="showMailingList"
    :default-email="profile?.payload?.email || ''"
    @close="showMailingList = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getTopupAddressQR } from '../api/qr'
import { getUserDlcs } from '../api/userDlcs'
import { satsForm } from '../functions/amount_formatting'
import { deleteSelf } from '../api/deleteSelf'
import TheFooter from '../components/TheFooter.vue'
import DlcDetails from '../components/DLCDetails.vue'
import MailingListModal from '../components/MailingListModal.vue'
import UsersLiquidity from '../components/UsersLiquidity.vue'
import UsersDLCS from '../components/UsersDLCS.vue'
import { isSignerAuthCode, isAdminAuthCode } from '../lib/authCode'

// ---- Router & Auth ----
const router = useRouter()
const {
  user,
  setUserFromApi,
  loading: authLoading,
  error: authError,
  logout,
} = useAuth()

// Expose the same shape your template expects: profile?.payload.??
const profile = computed(() => {
  const u = user.value
  if (!u) return null
  return { payload: u?.payload ?? u }
})
const userEmail = computed(() => String(profile.value?.payload?.email || '').trim().toLowerCase())
const isAdmin = computed(() => isAdminAuthCode(profile.value?.payload?.auth_code))

// ---- Local UI state ----
const loading = computed(() => !!authLoading.value)
const error   = computed(() => String(authError.value || ''))

const address = ref('')
const addrLoading = ref(false)
const addrError = ref(null)
const copied = ref(false)

// QR (top-up address)
const qrCode = ref(null)
const qrError = ref(null)

// ---- Load profile ----
async function load() {
  await setUserFromApi()
}

// Full refresh
async function reloadAll() {
  await load()
  await nextTick()
  if (!isPending.value) {
    await fetchTopup()
  } else {
    address.value = ''
    qrCode.value = null
  }
  await fetchPastDlcs()
}

// ---- Address fetch (keep) ----
async function fetchTopup() {
  addrError.value = null
  qrError.value = null
  addrLoading.value = true
  address.value = ''
  qrCode.value = null
  copied.value = false

  try {
    const res = await getTopupAddressQR()

    const addr = String(res?.payload?.string || '')
    if (!addr) throw new Error('Top-up address not found in response payload.')
    address.value = addr

    const svg = res?.payload?.qr_code
    if (typeof svg !== 'string') {
      qrError.value = 'QR code not found in response payload.'
    } else {
      try {
        qrCode.value = buildSvgDataUri(svg)
      } catch (err) {
        qrError.value = err?.message || 'Failed to load QR code.'
      }
    }
  } catch (e) {
    const msg = e && e.message ? e.message : String(e)
    addrError.value = 'Could not load your deposit address. Please try again or contact support.'
    qrError.value = msg
  } finally {
    addrLoading.value = false
  }
}

// ---- QR load (copied from registration page style) ----
const buildSvgDataUri = (svgLike) => {
  const val = String(svgLike || '').trim()
  if (!val) throw new Error('Empty QR')
  if (/^data:image\/svg\+xml[,;]/i.test(val)) return val
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('<svg') || val.startsWith('<?xml')) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(val)
  }
  if (val.startsWith('%3Csvg') || val.startsWith('%3C?xml')) {
    return 'data:image/svg+xml,' + val
  }
  throw new Error('Unexpected QR format.')
}

// ---- Copy address ----
async function copyAddress() {
  try {
    await navigator.clipboard.writeText(address.value)
    copied.value = true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = address.value
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); copied.value = true } catch {}
    document.body.removeChild(ta)
  } finally {
    setTimeout(() => { copied.value = false }, 1500)
  }
}

function formatBtc(sats) {
  return satsForm(sats)
}

// ---- Referrals ----
const copiedWhat = ref('') // '' | 'code' | 'link'
const rawRefCode = computed(() => profile.value?.payload?.referral_code || '')
const refCode = computed(() => {
  const s = String(rawRefCode.value || '')
  return s.startsWith('refcode:') ? s.slice('refcode:'.length) : s
})
const siteBase = (import.meta.env && import.meta.env.VITE_SITE_BASE) || window.location.origin
const refLink = computed(() => (refCode.value ? `${siteBase}/?ref=${encodeURIComponent(refCode.value)}` : ''))
const refParent = computed(() => profile.value?.payload?.par_referral_code || null)

async function copyText(text, which) {
  try {
    await navigator.clipboard.writeText(text)
    copiedWhat.value = which
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); copiedWhat.value = which } catch {}
    document.body.removeChild(ta)
  } finally {
    setTimeout(() => { copiedWhat.value = '' }, 1500)
  }
}

// ---- Zero-balance state ----
const isZeroBalance = computed(() => {
  const p = profile.value?.payload
  if (!p) return false
  return Number(p.balance_derived) === 0 && Number(p.balance_onchain) === 0
})

// ---- Registration state ----
const isPending = computed(() => Number(profile.value?.payload?.auth_code) === 0)
const registrationLevel = computed(() => {
  const code = Number(profile.value?.payload?.auth_code)
  if (isSignerAuthCode(code)) return 'Signer'
  if (code === 2) return 'Registered'
  if (code === 0) return 'Pending email confirmation'
  if (!Number.isFinite(code)) return '—'
  return `Code ${code}`
})

const showMailingList = ref(false)

/* ======================= Past DLCs ======================= */
const pastLoading = ref(false)
const pastError = ref(null)
const pastRows = ref([])
const pastApiDlcs = ref([])
const selectedDlc = ref(null)

const STATUSES = Object.freeze([
  'offer_p','offer_dlc','sign_ini','sign_acc','signed',
  'broadcast','active','attested','executed','settled','revoked','reset','confirmed'
])

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000
const toMs = (v) => {
  if (v == null) return null
  const n = Number(v)
  if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n
  const p = Date.parse(String(v))
  return Number.isFinite(p) ? p : null
}
const isYearish = (days) => {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
const displayDays = (days) => (isYearish(days) ? 365 : Math.round(Number(days) || 0))
const parseTermDays = (pid, duration) => {
  const fromPid = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  if (fromPid) return Math.round(Number(fromPid[1]))
  const d = Number(duration)
  return Number.isFinite(d) && d > 0 ? Math.round(d) : null
}
const parseLtv = (pid) => {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
const annualize360 = (termPct, days) => {
  const r = Number(termPct)
  const d = Number(days)
  if (!Number.isFinite(r) || !Number.isFinite(d) || d <= 0) return NaN
  return r * (360 / d)
}
const pct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '—')
const shortId = (s) => (s ? String(s).slice(0, 8) : '—')
const fmtDate = (ms) => (ms ? new Date(ms).toLocaleString() : '—')
const settledTimeMs = (d) => {
  const candidates = [
    d.settled_at, d.settledAt,
    d.closed_at, d.closedAt,
    d.maturity_at, d.maturityAt, d.maturity_date, d.maturityDate,
    d.updated_at, d.updatedAt,
  ]
  for (const c of candidates) {
    const ms = toMs(c)
    if (ms) return ms
  }
  return null
}

async function fetchPastDlcs() {
  pastLoading.value = true
  pastError.value = null
  pastRows.value = []
  pastApiDlcs.value = []
  try {
    const res = await getUserDlcs(STATUSES)
    const items = Array.isArray(res?.payload) ? res.payload : []

    const now = Date.now()
    const past = items
      .filter(d => String(d?.status ?? '').toLowerCase() === 'settled')
      .map(d => ({ d, t: settledTimeMs(d) }))
      .filter(({ t }) => t && (now - t) > TWO_DAYS_MS)

    pastApiDlcs.value = past.map(p => p.d)

    const rows = past
      .map(({ d, t }) => {
        const rawDays = parseTermDays(d.product_id, d.duration)
        const uiDays  = rawDays ? displayDays(rawDays) : null
        const ltv = parseLtv(d.product_id)
        const ear = annualize360(Number(d.interest), rawDays)
        const id = d.dlc_id || d.tmp_cntr_id || ''
        return {
          fullId: id,
          idShort: shortId(id),
          term: uiDays ? `${uiDays} Days` : '—',
          ltv: ltv != null ? `${ltv}%` : '—',
          annualized: pct2(ear),
          settledAt: fmtDate(t),
          t,
        }
      })
      .sort((a, b) => (b.t || 0) - (a.t || 0))

    pastRows.value = rows
  } catch (e) {
    pastError.value = e?.message || 'Failed to fetch past DLCs.'
  } finally {
    pastLoading.value = false
  }
}

function selectPast(row) {
  const match = pastApiDlcs.value.find(d => (d.dlc_id || d.tmp_cntr_id) === row.fullId)
  if (match) selectedDlc.value = match
}
function onPastDeleted() {
  selectedDlc.value = null
  fetchPastDlcs()
}

/* ======================= Delete account ======================= */
const delOpen = ref(false)
const delBusy = ref(false)
const delError = ref(null)
const delConfirm = ref('')
const delEmail = ref('')

async function onConfirmDelete() {
  if (delBusy.value) return

  if (delConfirm.value !== 'DELETE' || delEmail.value.toLowerCase() !== userEmail.value) {
    delError.value = 'Confirmation text or email does not match.'
    return
  }

  delBusy.value = true
  delError.value = null
  try {
    // pass email to API (lowercased)
    await deleteSelf(delEmail.value.toLowerCase())
    logout()
    await router.replace('/login?deleted=1')
  } catch (e) {
    delError.value = e?.message || 'Failed to delete account.'
  } finally {
    delBusy.value = false
  }
}

/* ===================== Lifecycle ===================== */
onMounted(async () => {
  await load()
  if (!isPending.value) {
    await fetchTopup()
  }
  await fetchPastDlcs()
})
</script>

<style scoped>
/* Gradient background (local, CSP-safe; purple glow from bottom) */
.page-gradient{
  background-color: #000;
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}
@supports (background: radial-gradient(in oklch, black, white)) {
  .page-gradient{
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
@media (max-height: 800px){
  .page-gradient{
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

.qr-box{
  display: grid;
  place-items: center;
}

.qr-box img{
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
