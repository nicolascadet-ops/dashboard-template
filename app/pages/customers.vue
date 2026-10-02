<script setup lang="ts">
import { CUSTOMERS, money, num } from '~/utils/data';
import type { Column } from '~/utils/table';

useSeoMeta({ title: 'Customers' });

const COLUMNS: Column[] = [
  { key: 'name', label: 'Customer' },
  { key: 'region', label: 'Region', hideSm: true },
  { key: 'since', label: 'Customer since', hideSm: true },
  { key: 'orders', label: 'Orders', num: true },
  { key: 'spent', label: 'Lifetime spend', num: true },
];

const q = ref('');
const rows = computed(() => {
  const term = q.value.trim().toLowerCase();
  return CUSTOMERS.filter((c) => !term || `${c.name} ${c.email} ${c.region}`.toLowerCase().includes(term));
});
const repeat = CUSTOMERS.filter((c) => c.orders > 1).length / CUSTOMERS.length;
const avg = CUSTOMERS.reduce((s, c) => s + c.spent, 0) / CUSTOMERS.length;
const since = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
</script>

<template>
  <div class="page">
    <header class="page-head"><div><h1>Customers</h1><p class="sub">Top {{ CUSTOMERS.length }} customers by spend · sample data</p></div></header>
    <section class="kpis three" aria-label="Customer figures">
      <div class="kpi"><p class="kpi-label">Customers shown</p><p class="kpi-value">{{ num(CUSTOMERS.length) }}</p></div>
      <div class="kpi"><p class="kpi-label">Repeat customers</p><p class="kpi-value">{{ Math.round(repeat * 100) }}%</p></div>
      <div class="kpi"><p class="kpi-label">Average lifetime spend</p><p class="kpi-value">{{ money(avg) }}</p></div>
    </section>
    <div class="toolbar">
      <label class="search">
        <Icon name="search" :size="18" />
        <span class="sr-only">Search customers</span>
        <input v-model="q" type="search" placeholder="Search by name, email or region" />
      </label>
    </div>
    <section class="card flush" aria-label="Customers table">
      <DataTable :rows="rows" :columns="COLUMNS" caption="Customers">
        <template #cell-name="{ row }"><b>{{ row.name }}</b><small class="muted block hide-sm">{{ row.email }}</small></template>
        <template #cell-since="{ row }">{{ since(row.since) }}</template>
        <template #cell-spent="{ row }">{{ money(row.spent) }}</template>
        <template #empty>
          <p><b>No customers match “{{ q }}”.</b></p>
          <button type="button" class="btn btn-ghost" @click="q = ''">Clear search</button>
        </template>
      </DataTable>
    </section>
  </div>
</template>
