<template>
  <div class="device device-imac mx-auto">
    <div class="device-frame">
      <div class="device-content bg-dark text-white overflow-auto flex flex-col justify-between p-6">
        
        <!-- 🔥 MAIN RATES (centered & bold) -->
        <div class="flex-1 flex flex-col justify-center items-center gap-8">
          <div class="space-y-6 text-center">
            <div>
              <p class="text-lg text-tertiary tracking-wide">Borrow Rate</p>
              <p class="text-5xl font-extrabold text-white">9.00%</p>
            </div>
            <div>
              <p class="text-lg text-tertiary tracking-wide">Lend Rate</p>
              <p class="text-5xl font-extrabold text-white">8.16%</p>
            </div>
          </div>
        </div>

        <!-- 📝 FOOTER: Description -->
        
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
// You’ll be wiring this up to real data soon 👌
</script>

<style scoped>
.device-content {
  min-height: 320px;
  max-height: 500px;
  border-radius: 6px;
}
</style>
