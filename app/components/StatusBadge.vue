<script setup lang="ts">
import type { OrderStatus } from '~/utils/data';

// Status always pairs colour with an icon and a label, never colour alone
const MAP = {
  Paid: { cls: 'good', icon: 'check' },
  Pending: { cls: 'warning', icon: 'clock' },
  Refunded: { cls: 'neutral', icon: 'undo' },
  Failed: { cls: 'critical', icon: 'alert' },
} as const;
defineProps<{ status: OrderStatus }>();
</script>

<template>
  <span :class="['status', MAP[status].cls]"><Icon :name="MAP[status].icon" :size="14" />{{ status }}</span>
</template>
