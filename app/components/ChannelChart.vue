<script setup lang="ts">
import { money, pct } from '~/utils/data';

// One series, so one colour for every bar; values are labelled at the bar ends.
// Built from plain HTML so it scales with the card; hovering or focusing a bar shows its share.
const props = defineProps<{ data: { channel: string; revenue: number }[] }>();
const total = computed(() => props.data.reduce((s, d) => s + d.revenue, 0));
const max = computed(() => Math.max(...props.data.map((d) => d.revenue)));
const active = ref<string | null>(null);
</script>

<template>
  <ul class="bars" :aria-label="`Revenue by channel: ${data.map((d) => `${d.channel} ${money(d.revenue)}`).join(', ')}.`">
    <li
      v-for="d in data" :key="d.channel" class="bar-row" tabindex="0"
      @pointerenter="active = d.channel" @pointerleave="active = null" @focus="active = d.channel" @blur="active = null"
    >
      <span class="bar-label">{{ d.channel }}</span>
      <span class="bar-track">
        <span class="bar" :style="{ width: `${(d.revenue / max) * 100}%` }" />
        <span class="bar-value">${{ Math.round(d.revenue / 1000) }}k</span>
      </span>
      <span v-if="active === d.channel" class="tip bar-tip" role="status">
        <span class="tip-row"><b>{{ money(d.revenue) }}</b><span>{{ pct(d.revenue / total) }} of revenue</span></span>
      </span>
    </li>
  </ul>
</template>
