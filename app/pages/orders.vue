<script setup lang="ts">
import { ORDERS, money, shortDate, type Order, type OrderStatus } from '~/utils/data';
import type { Column } from '~/utils/table';

useSeoMeta({ title: 'Orders' });

const STATUSES: (OrderStatus | 'All')[] = ['All', 'Paid', 'Pending', 'Refunded', 'Failed'];
const COLUMNS: Column[] = [
  { key: 'id', label: 'Order' },
  { key: 'date', label: 'Date', hideSm: true },
  { key: 'customer', label: 'Customer' },
  { key: 'channel', label: 'Channel', hideSm: true },
  { key: 'status', label: 'Status' },
  { key: 'items', label: 'Items', num: true, hideSm: true },
  { key: 'total', label: 'Total', num: true },
];

const q = ref('');
const status = ref<OrderStatus | 'All'>('All');
const rows = computed(() => {
  const term = q.value.trim().toLowerCase();
  return ORDERS.filter((o) => (status.value === 'All' || o.status === status.value) && (!term || `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(term)));
});

function exportCsv(list: Order[]) {
  const head = ['Order', 'Date', 'Customer', 'Email', 'Channel', 'Status', 'Items', 'Total'];
  const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [head, ...list.map((o) => [o.id, o.date.slice(0, 10), o.customer, o.email, o.channel, o.status, o.items, o.total.toFixed(2)])].map((r) => r.map(esc).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div><h1>Orders</h1><p class="sub">Latest {{ ORDERS.length }} orders · sample data</p></div>
      <button type="button" class="btn btn-ghost" @click="exportCsv(rows)"><Icon name="download" :size="18" />Export CSV</button>
    </header>
    <div class="toolbar">
      <label class="search">
        <Icon name="search" :size="18" />
        <span class="sr-only">Search orders</span>
        <input v-model="q" type="search" placeholder="Search by order, name or email" />
      </label>
      <div class="range" role="group" aria-label="Filter by status">
        <button v-for="s in STATUSES" :key="s" type="button" :aria-pressed="status === s" @click="status = s">{{ s }}</button>
      </div>
    </div>
    <section class="card flush" aria-label="Orders table">
      <DataTable :rows="rows" :columns="COLUMNS" caption="Orders">
        <template #cell-id="{ row }"><span class="mono">{{ row.id }}</span></template>
        <template #cell-date="{ row }">{{ shortDate(row.date) }}</template>
        <template #cell-customer="{ row }"><b>{{ row.customer }}</b><small class="muted block hide-sm">{{ row.email }}</small></template>
        <template #cell-status="{ row }"><StatusBadge :status="row.status" /></template>
        <template #cell-total="{ row }">{{ money(row.total, 2) }}</template>
        <template #empty>
          <p><b>No orders match.</b></p>
          <p class="muted">Try a different name or clear the status filter.</p>
          <button type="button" class="btn btn-ghost" @click="q = ''; status = 'All'">Clear filters</button>
        </template>
      </DataTable>
    </section>
  </div>
</template>
