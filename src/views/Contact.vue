<template>
  <section class="min-h-screen w-full bg-primary text-white flex flex-col">

    <!-- 🔹 Page Title -->
    <div class="w-full bg-secondary py-6 px-4 text-center shadow-md">
      <h1 class="text-4xl md:text-5xl font-extrabold">Schedule Onboarding Appointment</h1>
    </div>

    <!-- 📅 Calendar + Time Selection -->
    <div class="flex-1 flex flex-col items-center justify-center gap-8 p-6">

      <!-- Date Picker -->
      <div class="w-full max-w-md">
        <label class="block mb-2 text-lg font-semibold">Select a Date:</label>
        <Datepicker v-model="selectedDate" class="w-full" input-class-name="text-black" />
      </div>

      <!-- Time Selector -->
      <div class="w-full max-w-md">
        <label class="block mb-2 text-lg font-semibold">Select a Time:</label>
        <select v-model="selectedTime" class="w-full px-4 py-3 rounded-lg text-black">
          <option disabled value="">Choose a time</option>
          <option v-for="time in timeSlots" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
      </div>

      <!-- Output -->
      <div class="text-lg text-white/90 text-center mt-4" v-if="selectedDate && selectedTime">
        You selected: <br />
        <span class="font-bold">{{ formattedDate }}</span> at <span class="font-bold">{{ selectedTime }}</span>
      </div>

    </div>
  </section>
</template>

<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { ref, computed } from 'vue'

const selectedDate = ref(null)
const selectedTime = ref('')

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
]

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
