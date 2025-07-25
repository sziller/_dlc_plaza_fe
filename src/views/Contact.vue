<template>
  <section class="min-h-screen w-full bg-primary text-white flex flex-col md:flex-row">

    <!-- 🧾 Left Side: Title & Description -->
    <div class="md:w-1/2 w-full flex flex-col justify-center items-start p-8">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Schedule Onboarding</h1>
      <p class="text-lg md:text-xl text-white/90 max-w-lg">
        Select your preferred date and time to schedule your onboarding appointment with our team.
      </p>
    </div>

    <!-- 📅 Right Side: Calendar & Time Picker -->
    <div class="md:w-1/2 w-full bg-secondary p-8 flex flex-col items-center justify-center gap-8">

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

      <!-- Output & Confirm Button -->
      <div class="text-lg text-white/90 text-center mt-4" v-if="selectedDate && selectedTime">
        You selected: <br />
        <span class="font-bold">{{ formattedDate }}</span> at <span class="font-bold">{{ selectedTime }}</span>

        <!-- ✅ Confirm Button -->
        <div class="mt-6">
          <button
            @click="confirmAppointment"
            class="bg-primary hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            Confirm Appointment
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { ref, computed } from 'vue'

// 🌟 Reactive state
const selectedDate = ref(null)
const selectedTime = ref('')

// 🕑 Available time slots
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
]

// 🗓️ Format selected date nicely
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

// 📩 Confirm button action
function confirmAppointment() {
  // Example logic — replace with API call if needed
  console.log('Confirmed appointment on', formattedDate.value, 'at', selectedTime.value)

  alert(`✅ Appointment confirmed for ${formattedDate.value} at ${selectedTime.value}!`)
}
</script>

<style scoped>
/* Optional: Scoped styles if needed */
</style>
