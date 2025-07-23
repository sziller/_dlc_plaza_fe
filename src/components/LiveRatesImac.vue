<template>
  <div class="device device-imac mx-auto">
    <div class="device-frame">
      <div class="device-content bg-dark text-white overflow-auto flex flex-col justify-between p-6">
        
        <!-- 🔥 Rates with Full Height Divider and Side-Centered Content -->
        <div class="relative min-h-[300px] flex justify-center items-center">
          <!-- Divider -->
          <div class="hidden sm:block absolute top-0 bottom-0 w-[3px] bg-secondary left-1/2 transform -translate-x-1/2 z-10"></div>

          <!-- Rate Sections -->
          <div class="flex flex-col sm:flex-row w-full max-w-4xl mx-auto z-20">
            <!-- Left (Borrow Rate) -->
            <div class="flex-1 flex flex-col justify-center items-center text-center px-4 space-y-2">
              <p class="text-xl sm:text-2xl tracking-wide">Invest Rate</p>
              <p class="text-5xl sm:text-6xl font-extrabold text-secondary">8.16%</p>
            </div>

            <!-- Right (Lend Rate) -->
            <div class="flex-1 flex flex-col justify-center items-center text-center px-4 space-y-2">
              <p class="text-xl sm:text-2xl tracking-wide">Borrower Rate</p>
              <p class="text-5xl sm:text-6xl font-extrabold text-secondary">9.00%</p>
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

<script setup>
// Optional: hook up to live rates later
</script>

<style scoped>
.device-content {
  min-height: 320px;
  max-height: 500px;
  border-radius: 6px;
}
</style>
