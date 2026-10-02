<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
useSeoMeta({ title: props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong' });
</script>

<template>
  <main id="main" class="page narrow">
    <h1>{{ error.statusCode === 404 ? "This page doesn't exist." : 'Something went wrong.' }}</h1>
    <p class="sub">Head back to the overview to keep going.</p>
    <div><button type="button" class="btn" @click="clearError({ redirect: '/' })">Back to overview</button></div>
  </main>
</template>
