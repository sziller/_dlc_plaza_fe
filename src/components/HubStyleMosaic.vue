<script setup>
import { blogArticles } from '../data/exploreContent'
const articles = blogArticles
</script>

<template>
  <div class="hub-mosaic-root">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="hub-m-heading">Knowledge Hub</h2>
        <p class="mt-2 text-white/50 text-sm">Architecture, mechanics, and the worldview behind Cadena.</p>
      </div>
      <div class="flex justify-end mb-3">
        <router-link to="/knowledge-hub" class="hub-m-viewall">View all &rarr;</router-link>
      </div>

      <!-- Mosaic grid -->
      <div class="hub-m-grid">

        <!-- Big card — article 0 -->
        <router-link :to="articles[0].link" class="hub-m-card hub-m-card-big">
          <picture>
            <source type="image/webp" :srcset="`/img/${articles[0].imageBase}-640.webp`" />
            <img :src="`/img/${articles[0].imageBase}-640.webp`" :alt="articles[0].title" class="hub-m-img" loading="lazy" decoding="async" />
          </picture>
          <div class="hub-m-overlay">
            <span class="hub-m-badge">Featured</span>
            <h3 class="hub-m-card-title hub-m-card-title-big">{{ articles[0].title }}</h3>
            <p class="hub-m-card-desc">{{ articles[0].description }}</p>
          </div>
        </router-link>

        <!-- Right column — articles 1 & 2 -->
        <div class="hub-m-col-right">
          <router-link
            v-for="article in articles.slice(1, 3)"
            :key="article.id"
            :to="article.link"
            class="hub-m-card hub-m-card-med"
          >
            <picture>
              <source type="image/avif" :srcset="`/img/${article.imageBase}-640.avif`" />
              <source type="image/webp" :srcset="`/img/${article.imageBase}-640.webp`" />
              <img :src="`/img/${article.imageBase}-640.webp`" :alt="article.title" class="hub-m-img" loading="lazy" decoding="async" />
            </picture>
            <div class="hub-m-overlay">
              <h3 class="hub-m-card-title">{{ article.title }}</h3>
            </div>
          </router-link>
        </div>

        <!-- Bottom row — articles 3 & 4 -->
        <router-link
          v-for="article in articles.slice(3)"
          :key="article.id"
          :to="article.link"
          class="hub-m-card hub-m-card-sm"
        >
          <picture>
            <source type="image/avif" :srcset="`/img/${article.imageBase}-640.avif`" />
            <source type="image/webp" :srcset="`/img/${article.imageBase}-640.webp`" />
            <img :src="`/img/${article.imageBase}-640.webp`" :alt="article.title" class="hub-m-img" loading="lazy" decoding="async" />
          </picture>
          <div class="hub-m-overlay">
            <h3 class="hub-m-card-title">{{ article.title }}</h3>
          </div>
        </router-link>

      </div>
    </div>
  </div>
</template>

<style scoped>
.hub-mosaic-root { background: #081123; }

.hub-m-heading { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; color: #fff; line-height: 1.05; letter-spacing: -0.02em; }
.hub-m-viewall { font-size: 0.85rem; font-weight: 600; color: #fff; transition: color 0.15s; }
.hub-m-viewall:hover { color: #fff; }

/* Grid layout */
.hub-m-grid {
  display: grid;
  gap: 3px;
  background: rgba(103,56,228,0.15);
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
}
@media (min-width: 768px) {
  .hub-m-grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

/* Cards */
.hub-m-card {
  position: relative;
  overflow: hidden;
  display: block;
  text-decoration: none;
  color: inherit;
  background: #0c0f1a;
}
.hub-m-card:hover .hub-m-img { transform: scale(1.04); }
.hub-m-card:hover .hub-m-overlay { background: linear-gradient(to top, rgba(6,8,15,0.95) 0%, rgba(103,56,228,0.15) 60%, transparent 100%); }

.hub-m-card-big {
  grid-column: 1 / -1;
  min-height: 280px;
}
@media (min-width: 768px) {
  .hub-m-card-big {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    min-height: 420px;
  }
}

.hub-m-col-right {
  display: contents;
}
.hub-m-card-med { min-height: 180px; }
@media (min-width: 768px) { .hub-m-card-med { min-height: 207px; } }

.hub-m-card-sm {
  grid-column: span 1;
  min-height: 160px;
}
@media (min-width: 768px) {
  .hub-m-card-sm { min-height: 200px; }
}

.hub-m-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}

.hub-m-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(6,8,15,0.92) 0%, rgba(6,8,15,0.4) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
  transition: background 0.3s;
}

.hub-m-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6738e3;
  border: 1px solid rgba(103,56,228,0.5);
  padding: 0.15rem 0.5rem;
  margin-bottom: 0.6rem;
  align-self: flex-start;
}

.hub-m-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}
.hub-m-card-title-big { font-size: clamp(1rem, 2vw, 1.3rem); }
.hub-m-card-desc { font-size: 0.78rem; color: #fff; margin-top: 0.4rem; line-height: 1.5; }
</style>
