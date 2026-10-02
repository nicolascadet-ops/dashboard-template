<script setup lang="ts">
import { money, shortDate } from '~/utils/data';

// One axis, two series: this period (blue area) and the previous period (grey line).
// Plain SVG, no chart library. Hover, touch or arrow keys move a crosshair with a tooltip.
type Point = { date: string; revenue: number; previous: number };
const props = defineProps<{ data: Point[]; bucketLabel: string }>();

const H = 300;
const M = { top: 8, right: 8, bottom: 26, left: 48 };
const box = ref<HTMLElement | null>(null);
const W = ref(800);
let ro: ResizeObserver | undefined;
onMounted(() => {
  ro = new ResizeObserver(([e]) => { W.value = Math.max(280, Math.round(e!.contentRect.width)); });
  if (box.value) ro.observe(box.value);
});
onBeforeUnmount(() => ro?.disconnect());

// Even, round gridlines so every axis label is exact
const ticks = computed(() => {
  const max = Math.max(...props.data.map((d) => Math.max(d.revenue, d.previous)));
  const step = [1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000, 100000].find((s) => max / s <= 5) ?? 200000;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: top / step + 1 }, (_, i) => i * step);
});
const yMax = computed(() => ticks.value[ticks.value.length - 1] || 1);
const plotW = computed(() => W.value - M.left - M.right);
const plotH = H - M.top - M.bottom;
const x = (i: number) => M.left + (props.data.length > 1 ? (i / (props.data.length - 1)) * plotW.value : plotW.value / 2);
const y = (v: number) => M.top + plotH - (v / yMax.value) * plotH;
const k = (v: number) => (v >= 1000 ? `$${Number.isInteger(v / 1000) ? v / 1000 : (v / 1000).toFixed(1)}k` : `$${v}`);

const line = (key: 'revenue' | 'previous') => props.data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join('');
const revLine = computed(() => line('revenue'));
const prevLine = computed(() => line('previous'));
const revArea = computed(() => `${revLine.value}L${x(props.data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`);

// About six date labels, evenly spaced
const xLabels = computed(() => {
  const n = props.data.length;
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW.value / 110))));
  const picked = props.data.map((d, i) => ({ i, label: shortDate(d.date) })).filter(({ i }) => i % every === 0);
  // Always end on the latest date, dropping the previous label if the two would collide
  if (picked[picked.length - 1]!.i !== n - 1) {
    if (n - 1 - picked[picked.length - 1]!.i < every * 0.6) picked.pop();
    picked.push({ i: n - 1, label: shortDate(props.data[n - 1]!.date) });
  }
  return picked;
});

const active = ref<number | null>(null);
const pick = (clientX: number) => {
  const r = box.value!.getBoundingClientRect();
  const rel = (clientX - r.left - M.left) / plotW.value;
  active.value = Math.max(0, Math.min(props.data.length - 1, Math.round(rel * (props.data.length - 1))));
};
const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const i = active.value ?? props.data.length - 1;
  active.value = Math.max(0, Math.min(props.data.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)));
};
const tipLeft = computed(() => {
  if (active.value === null) return 0;
  const px = x(active.value);
  return px > W.value - 180 ? px - 172 : px + 12;
});
</script>

<template>
  <div ref="box" class="chart">
    <svg :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Revenue ${bucketLabel}, this period compared with the previous period. Exact values are in the table below the chart.`">
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--series-1)" stop-opacity=".18" />
          <stop offset="100%" stop-color="var(--series-1)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g>
        <line v-for="t in ticks" :key="t" :x1="M.left" :x2="W - M.right" :y1="y(t)" :y2="y(t)" :stroke="t === 0 ? 'var(--axis)' : 'var(--grid)'" />
        <text v-for="t in ticks" :key="`l${t}`" :x="M.left - 8" :y="y(t) + 4" text-anchor="end" class="axis-label">{{ k(t) }}</text>
        <text v-for="l in xLabels" :key="l.i" :x="x(l.i)" :y="H - 6" :text-anchor="l.i === 0 ? 'start' : l.i === data.length - 1 ? 'end' : 'middle'" class="axis-label">{{ l.label }}</text>
      </g>
      <path :d="revArea" fill="url(#rev-fill)" />
      <path :d="prevLine" fill="none" stroke="var(--compare)" stroke-width="2" stroke-linejoin="round" />
      <path :d="revLine" fill="none" stroke="var(--series-1)" stroke-width="2" stroke-linejoin="round" />
      <g v-if="active !== null">
        <line :x1="x(active)" :x2="x(active)" :y1="M.top" :y2="y(0)" stroke="var(--axis)" />
        <circle :cx="x(active)" :cy="y(data[active]!.previous)" r="4" fill="var(--compare)" stroke="var(--surface)" stroke-width="2" />
        <circle :cx="x(active)" :cy="y(data[active]!.revenue)" r="5" fill="var(--series-1)" stroke="var(--surface)" stroke-width="2" />
      </g>
      <rect
        :x="M.left" :y="M.top" :width="plotW" :height="plotH" fill="transparent" tabindex="0" class="hit"
        aria-label="Chart values. Use the left and right arrow keys to move between dates."
        @pointermove="pick($event.clientX)" @pointerdown="pick($event.clientX)" @pointerleave="active = null"
        @focus="active = data.length - 1" @blur="active = null" @keydown="onKey"
      />
    </svg>
    <div v-if="active !== null" class="tip chart-tip" :style="{ left: `${tipLeft}px`, top: '12px' }" role="status">
      <p class="tip-date">{{ shortDate(data[active]!.date) }}</p>
      <p class="tip-row"><span class="tip-key" style="background: var(--series-1)" /><b>{{ money(data[active]!.revenue) }}</b><span>This period</span></p>
      <p class="tip-row"><span class="tip-key" style="background: var(--compare)" /><b>{{ money(data[active]!.previous) }}</b><span>Previous period</span></p>
    </div>
  </div>
</template>
