<template>
  <section class="min-h-screen bg-primary text-white px-6 pt-24 pb-16 flex flex-col justify-between">
    <!-- 🧾 Step 1: Registration Form -->
    <div v-if="step === 1" class="max-w-xl mx-auto w-full space-y-10">
      <h1 class="text-3xl font-bold text-center">Create Your Account</h1>

      <form class="space-y-6" @submit.prevent="submitForm">
        <!-- Email -->
        <label>
          <span class="block mb-1 font-semibold">Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 rounded bg-white text-black"
            required
          />
        </label>

        <!-- Password -->
        <label>
          <span class="block mb-1 font-semibold">Password</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded bg-white text-black"
            required
          />
        </label>

        <!-- Confirm Password -->
        <label>
          <span class="block mb-1 font-semibold">Confirm Password</span>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            class="w-full px-4 py-2 rounded bg-white text-black"
            required
          />
        </label>

        <!-- Terms -->
        <div class="flex items-start gap-2 text-sm">
          <input type="checkbox" id="terms" v-model="accepted" class="mt-1" />
          <label for="terms" class="text-white leading-snug">
            By clicking <strong>Register</strong>, you agree to our
            <a href="/terms" class="text-secondary underline">Terms</a> and you have read our
            <a href="/privacy" class="text-secondary underline">Data Policy</a>, including our
            <a href="/cookies" class="text-secondary underline">Cookie Use</a>.
          </label>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="!formValid"
          class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-40"
        >
          Register
        </button>

        <!-- Centered Login Link -->
        <div class="text-center text-sm pt-4">
          <router-link to="/login" class="text-secondary hover:underline font-medium">
            Already have an account? Log in
          </router-link>
        </div>
      </form>
    </div>

    <!-- 📬 Step 2: Email Sent Message -->
    <div v-else-if="step === 2" class="max-w-xl mx-auto text-center space-y-6">
      <h1 class="text-3xl font-bold">Check Your Inbox</h1>
      <p class="text-lg">We've sent a confirmation link to:</p>
      <p class="text-xl text-secondary font-bold">{{ email }}</p>
      <p class="text-sm text-white/80">
        Please click the link in your email to confirm your account.<br />
        After confirming, refresh this page.
      </p>
    </div>

    <!-- 🧭 Step Tracker -->
    <div class="mt-20 flex justify-center">
      <ol class="flex items-center gap-10 text-base font-semibold">
        <!-- Step 1 -->
        <li class="flex items-center gap-3">
          <div
            class="flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'bg-green-600 text-white border-green-600': step > 1,
              'bg-secondary text-white border-secondary': step === 1,
              'bg-gray-200 text-gray-400 border-gray-300': step < 1
            }"
          >
            <svg
              v-if="step > 1"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>1</span>
          </div>
          <span class="hidden sm:inline" :class="step === 1 ? 'text-white' : step > 1 ? 'text-green-500' : 'text-gray-400'">
            Register Email
          </span>
        </li>

        <!-- Step 2 -->
        <li class="flex items-center gap-3">
          <div
            class="flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'bg-secondary text-white border-secondary': step === 2,
              'bg-gray-200 text-gray-400 border-gray-300': step < 2
            }"
          >
            <span>2</span>
          </div>
          <span class="hidden sm:inline" :class="step === 2 ? 'text-white' : step < 2 ? 'text-gray-400' : 'text-green-500'">
            Confirm Email
          </span>
        </li>

        <!-- Step 3 -->
        <li class="flex items-center gap-3">
          <div
            class="flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'bg-secondary text-white border-secondary': step === 3,
              'bg-gray-200 text-gray-400 border-gray-300': step < 3
            }"
          >
            <span>3</span>
          </div>
          <span class="hidden sm:inline" :class="step === 3 ? 'text-white' : 'text-gray-400'">Scan QR</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const step = ref(1)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const accepted = ref(false)

const formValid = computed(() => {
  return (
    email.value &&
    password.value &&
    confirmPassword.value === password.value &&
    accepted.value
  )
})

const submitForm = () => {
  // Simulate sending confirmation email
  console.log(`Sending confirmation link to: ${email.value}`)
  step.value = 2
}
</script>
