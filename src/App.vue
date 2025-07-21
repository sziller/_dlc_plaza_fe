<template>
  <div class="bg-primary text-white min-h-screen">
    <Navbar />
   <router-view class="pt-20 px-4" />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
