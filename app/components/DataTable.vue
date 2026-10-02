<script setup lang="ts" generic="T extends Record<string, any>">
// Sortable, paginated table shared by Orders and Customers.
// Custom cells: <template #cell-total="{ row }">...</template>
import type { Column } from '~/utils/table';

const props = withDefaults(defineProps<{ rows: T[]; columns: Column[]; caption: string; pageSize?: number }>(), { pageSize: 12 });

const sort = ref<{ key: string; dir: 1 | -1 } | null>(null);
const page = ref(0);
watch(() => props.rows, () => { page.value = 0; });

const sorted = computed(() => {
  const s = sort.value;
  if (!s) return props.rows;
  return [...props.rows].sort((a, b) => {
    const x = a[s.key], y = b[s.key];
    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * s.dir;
  });
});
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / props.pageSize)));
const current = computed(() => Math.min(page.value, pages.value - 1));
const visible = computed(() => sorted.value.slice(current.value * props.pageSize, (current.value + 1) * props.pageSize));

const state = (key: string) => (sort.value?.key === key ? (sort.value.dir === 1 ? 'ascending' : 'descending') : 'none');
const toggle = (key: string) => {
  const s = sort.value;
  sort.value = s?.key === key ? (s.dir === -1 ? { key, dir: 1 } : null) : { key, dir: -1 };
  page.value = 0;
};
const cls = (c: Column) => [c.num && 'num', c.hideSm && 'hide-sm'].filter(Boolean).join(' ') || undefined;
</script>

<template>
  <div v-if="rows.length === 0" class="empty"><slot name="empty" /></div>
  <template v-else>
    <div class="table-wrap">
      <table>
        <caption class="sr-only">{{ caption }}</caption>
        <thead>
          <tr>
            <th v-for="c in columns" :key="c.key" scope="col" :class="cls(c)" :aria-sort="state(c.key)">
              <button type="button" class="th-btn" @click="toggle(c.key)">
                {{ c.label }}
                <Icon :name="state(c.key) === 'ascending' ? 'up' : state(c.key) === 'descending' ? 'down' : 'sort'" :size="14" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in visible" :key="i">
            <td v-for="c in columns" :key="c.key" :class="cls(c)">
              <slot :name="`cell-${c.key}`" :row="r">{{ r[c.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pager">
      <p class="muted">{{ current * pageSize + 1 }}–{{ Math.min(sorted.length, (current + 1) * pageSize) }} of {{ sorted.length }}</p>
      <div class="pager-btns">
        <button type="button" class="icon-btn" :disabled="current === 0" aria-label="Previous page" @click="page = current - 1"><Icon name="left" /></button>
        <span class="muted">Page {{ current + 1 }} of {{ pages }}</span>
        <button type="button" class="icon-btn" :disabled="current >= pages - 1" aria-label="Next page" @click="page = current + 1"><Icon name="right" /></button>
      </div>
    </div>
  </template>
</template>
