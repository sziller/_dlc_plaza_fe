<template>
  <div class="device device-imac mx-auto">
    <div class="device-frame">
      <div class="device-content bg-dark text-white overflow-auto flex flex-col justify-between p-6 relative">

        <!-- 🔥 Rates Section -->
        <div class="relative w-full min-h-[400px] flex justify-center items-center -mt-10">
          
          <!-- Custom-Length Fixed Divider -->
          <div
            class="hidden sm:block fixed top-[18px] bottom-[165px] w-[3px] bg-secondary left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
          ></div>

          <!-- Rate Cards -->
          <div class="flex flex-col sm:flex-row w-full max-w-5xl mx-auto z-20">
            <!-- Lend -->
            <div
              class="rate-card flex-1 flex flex-col justify-center items-center text-center px-4 space-y-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:text-glow"
              @click="$router.push('/btcusd')"
            >
              <p class="text-xl sm:text-2xl tracking-wide">Lend Rate</p>
              <p class="text-5xl sm:text-6xl font-extrabold text-secondary transition-transform duration-300">8.16%</p>
            </div>

            <!-- Borrow -->
            <div
              class="rate-card flex-1 flex flex-col justify-center items-center text-center px-4 space-y-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:text-glow"
              @click="$router.push('/btcusd')"
            >
              <p class="text-xl sm:text-2xl tracking-wide">Borrow Rate</p>
              <p class="text-5xl sm:text-6xl font-extrabold text-secondary transition-transform duration-300">9.00%</p>
            </div>
          </div>

        </div>

      </div>
    </div>
    <div class="device-stripe"></div>
    <div class="device-header"></div>
    <div class="device-sensors"></div>
    <div class="device-btns"></div>
    <div class="device-power"></div>
  </div>
</template>

<style scoped>
.device-content {
  border-radius: 6px;
  position: relative;
}

/* Glowing text effect */
.hover\:text-glow:hover {
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.2);
}
</style>
