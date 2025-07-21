<template>
  <section class="overflow-hidden bg-primary text-white sm:grid sm:grid-cols-2">
    <div class="p-8 md:p-12 lg:px-16 lg:py-24">
      <div class="mx-auto max-w-xl text-center sm:text-left">
        <h2 class="text-3xl font-extrabold md:text-4xl leading-tight">
          Unlock your Bitcoin's potential.
        </h2>

        <p class="hidden md:block mt-4 text-tertiary text-lg leading-relaxed">
          Get a Bitcoin loan for liquidity or to leverage your Bitcoin exposure. Give a Bitcoin loan to generate fiat yield.
        </p>

        <div class="mt-8">
          <router-link
            to="/borrow"
            class="inline-block rounded-full bg-secondary px-10 py-3 text-sm font-medium text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
          >
            Get Started Today
          </router-link>
        </div>
      </div>
    </div>

    <!-- Optional right side reserved (can be used later for chart/image) -->
    <div class="hidden sm:block h-64 sm:h-auto bg-gradient-to-tr from-secondary/10 to-transparent"></div>
  </section>
</template>
