<script setup lang="ts">
import { RANGES, ORDERS, LOW_STOCK, topProducts, channelSplit, money, num, pct, rangeData, shortDate, type RangeId } from '~/utils/data';

useSeoMeta({ title: 'Overview' });

const range = ref<RangeId>('30d');
const data = computed(() => rangeData(range.value));
const c = computed(() => data.value.current);
const p = computed(() => data.value.previous);
const channels = computed(() => channelSplit(range.value));
const products = computed(() => topProducts(range.value));
const rangeLabel = computed(() => RANGES.find((r) => r.id === range.value)!.label);
const label = computed(() => rangeLabel.value.toLowerCase());
const basis = computed(() => `previous ${label.value.replace('last ', '')}`);
const showTable = ref(false);

const kpis = computed(() => [
  { label: 'Revenue', value: money(c.value.revenue), now: c.value.revenue, before: p.value.revenue },
  { label: 'Orders', value: num(c.value.orders), now: c.value.orders, before: p.value.orders },
  { label: 'Average order value', value: money(c.value.aov, 2), now: c.value.aov, before: p.value.aov },
  { label: 'Conversion rate', value: pct(c.value.conversion, 2), now: c.value.conversion, before: p.value.conversion },
]);
const change = (now: number, before: number) => (now - before) / before;
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>Overview</h1>
        <p class="sub">Northwind Outdoor · sample data</p>
      </div>
      <div class="range" role="group" aria-label="Date range">
        <button v-for="r in RANGES" :key="r.id" type="button" :aria-pressed="range === r.id" @click="range = r.id">{{ r.label.replace('Last ', '') }}</button>
      </div>
    </header>

    <section class="kpis" :aria-label="`Key figures, ${label}`">
      <div v-for="k in kpis" :key="k.label" class="kpi">
        <p class="kpi-label">{{ k.label }}</p>
        <p class="kpi-value">{{ k.value }}</p>
        <span :class="['delta', change(k.now, k.before) >= 0 ? 'up' : 'down']">
          <Icon :name="change(k.now, k.before) >= 0 ? 'up' : 'down'" :size="14" />
          {{ pct(Math.abs(change(k.now, k.before))) }}
          <span class="sr-only">{{ change(k.now, k.before) >= 0 ? 'increase' : 'decrease' }}</span>
          <span class="basis">vs {{ basis }}</span>
        </span>
      </div>
    </section>

    <section class="card" aria-labelledby="rev-title">
      <div class="card-head">
        <div>
          <h2 id="rev-title">Revenue</h2>
          <p class="sub">{{ data.bucket > 1 ? 'Weekly totals' : 'Daily totals' }}, {{ label }}</p>
        </div>
        <ul class="legend" aria-label="Legend">
          <li><span class="lkey" style="background: var(--series-1)" />This period</li>
          <li><span class="lkey" style="background: var(--compare)" />Previous period</li>
        </ul>
      </div>
      <RevenueChart :data="data.series" :bucket-label="label" />
      <button type="button" class="link-btn" :aria-expanded="showTable" @click="showTable = !showTable">{{ showTable ? 'Hide' : 'Show' }} data table</button>
      <div v-if="showTable" class="table-wrap small">
        <table>
          <thead><tr><th scope="col">{{ data.bucket > 1 ? 'Week of' : 'Date' }}</th><th scope="col" class="num">This period</th><th scope="col" class="num">Previous period</th></tr></thead>
          <tbody><tr v-for="s in data.series" :key="s.date"><td>{{ shortDate(s.date) }}</td><td class="num">{{ money(s.revenue) }}</td><td class="num">{{ money(s.previous) }}</td></tr></tbody>
        </table>
      </div>
    </section>

    <div class="grid-2">
      <section class="card" aria-labelledby="ch-title">
        <div class="card-head"><div><h2 id="ch-title">Revenue by channel</h2><p class="sub">{{ rangeLabel }}</p></div></div>
        <ChannelChart :data="channels" />
      </section>

      <section class="card" aria-labelledby="tp-title">
        <div class="card-head"><div><h2 id="tp-title">Top products</h2><p class="sub">{{ rangeLabel }}</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">Product</th><th scope="col" class="num">Units</th><th scope="col" class="num">Revenue</th></tr></thead>
            <tbody>
              <tr v-for="t in products" :key="t.sku">
                <td>
                  <b>{{ t.name }}</b>
                  <small class="muted block">{{ t.sku }}<span v-if="t.stock < LOW_STOCK" class="low"> · <Icon name="alert" :size="13" />Low stock: {{ t.stock }} left</span></small>
                </td>
                <td class="num">{{ num(t.units) }}</td>
                <td class="num">{{ money(t.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section class="card" aria-labelledby="ro-title">
      <div class="card-head">
        <div><h2 id="ro-title">Recent orders</h2></div>
        <NuxtLink to="/orders/" class="btn btn-ghost">View all orders</NuxtLink>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Status</th><th scope="col" class="num">Total</th></tr></thead>
          <tbody>
            <tr v-for="o in ORDERS.slice(0, 6)" :key="o.id"><td class="mono">{{ o.id }}</td><td>{{ o.customer }}</td><td><StatusBadge :status="o.status" /></td><td class="num">{{ money(o.total, 2) }}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
