<script setup lang="ts">
// Page titles: "Orders · Pulse" style
useHead({ titleTemplate: (t) => (t ? `${t} · Pulse` : 'Pulse · Sales analytics') });
import type { IconName } from '~/utils/icons';

const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Overview', icon: 'chart' },
  { to: '/orders/', label: 'Orders', icon: 'receipt' },
  { to: '/customers/', label: 'Customers', icon: 'users' },
  { to: '/settings/', label: 'Settings', icon: 'gear' },
];

const route = useRoute();
const open = ref(false);
const { isDark, setTheme } = useTheme();
watch(() => route.path, () => { open.value = false; });
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to.replace(/\/$/, '')));
</script>

<template>
  <div class="app">
    <a class="skip" href="#main">Skip to content</a>
    <aside :class="['side', { open }]">
      <div class="side-top">
        <NuxtLink to="/" class="logo" aria-label="Pulse, overview">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--series-1)" /><path d="M5 17h5l3-7 5 13 3-6h6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Pulse
        </NuxtLink>
        <button type="button" class="icon-btn menu-toggle" :aria-expanded="open" aria-controls="side-nav" :aria-label="open ? 'Close menu' : 'Open menu'" @click="open = !open">
          <Icon :name="open ? 'close' : 'menu'" />
        </button>
      </div>
      <nav id="side-nav" aria-label="Main" class="side-nav">
        <p class="ws"><span class="ws-av" aria-hidden="true">NW</span><span><b>Northwind Outdoor</b><small>Demo workspace</small></span></p>
        <ul>
          <li v-for="n in NAV" :key="n.to">
            <NuxtLink :to="n.to" :aria-current="isActive(n.to) ? 'page' : undefined"><Icon :name="n.icon" />{{ n.label }}</NuxtLink>
          </li>
        </ul>
        <div class="side-foot">
          <button type="button" class="theme-btn" :aria-label="`Switch to ${isDark ? 'light' : 'dark'} theme`" @click="setTheme(isDark ? 'light' : 'dark')">
            <Icon :name="isDark ? 'sun' : 'moon'" />{{ isDark ? 'Light theme' : 'Dark theme' }}
          </button>
          <p class="credit">Template by <a href="https://ncatelier.com">NC Atelier</a></p>
        </div>
      </nav>
    </aside>
    <main id="main" class="main">
      <NuxtPage />
      <p class="credit-sm">Template by <a href="https://ncatelier.com">NC Atelier</a></p>
    </main>
  </div>
</template>
