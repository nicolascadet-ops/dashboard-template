<script setup lang="ts">
import { PATHS, type IconName } from '~/utils/icons';

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 20 });
</script>

<template>
  <svg :width="props.size" :height="props.size" viewBox="0 0 20 20" aria-hidden="true" class="icon">
    <path :d="PATHS[props.name]" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
