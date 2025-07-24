<template>
  <section class="w-screen h-screen bg-primary text-white flex flex-col">
    
    <!-- 🔹 Header (fixed height) -->
    <div class="w-full bg-secondary py-8 px-4 text-center shadow-md">
      <h1 class="text-4xl md:text-5xl font-black leading-tight">
        How Cadena Bitcoin is Improving<br class="hidden md:block" />
        Bitcoin Borrowing and Lending
      </h1>
    </div>

    <!-- 🖼️ Image Fills Remaining Height -->
    <div class="flex-1 w-full">
      <img
        src="../assets/images/Infographic Comparison 1 and 2.jpg"
        alt="Infographic Comparison"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>

  </section>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
/* Ensure no padding/margin slips in from global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
