<script setup lang="ts">
useSeoMeta({ title: 'Settings' });

const { theme, setTheme } = useTheme();
const saved = ref(false);
const error = ref('');
const emailEl = ref<HTMLInputElement | null>(null);

const onSubmit = () => {
  const email = emailEl.value!;
  if (!email.value.trim() || !email.checkValidity()) {
    error.value = 'Enter a valid email address for reports, like name@company.com.';
    saved.value = false;
    email.focus();
    return;
  }
  error.value = '';
  saved.value = true;
};
</script>

<template>
  <div class="page narrow">
    <header class="page-head"><div><h1>Settings</h1><p class="sub">Changes here are a demo and are not saved.</p></div></header>

    <section class="card" aria-labelledby="ap-title">
      <h2 id="ap-title">Appearance</h2>
      <div class="range theme-pick" role="group" aria-label="Theme">
        <button v-for="t in (['system', 'light', 'dark'] as const)" :key="t" type="button" :aria-pressed="theme === t" @click="setTheme(t)">{{ t[0]!.toUpperCase() + t.slice(1) }}</button>
      </div>
      <p class="muted small-print">System follows your device setting. Your choice is remembered in this browser.</p>
    </section>

    <form class="card form" novalidate aria-labelledby="rep-title" @submit.prevent="onSubmit" @change="saved = false">
      <h2 id="rep-title">Reports</h2>
      <div class="field">
        <label for="email">Send weekly report to</label>
        <input id="email" ref="emailEl" name="email" type="email" value="team@northwind.example" :aria-invalid="!!error || undefined" :aria-describedby="error ? 'email-err' : undefined" />
        <p v-if="error" id="email-err" class="err">{{ error }}</p>
      </div>
      <div class="field">
        <label for="currency">Reporting currency</label>
        <select id="currency" name="currency">
          <option value="USD" selected>US dollar (USD)</option>
          <option value="CAD">Canadian dollar (CAD)</option>
          <option value="GBP">British pound (GBP)</option>
        </select>
      </div>
      <fieldset class="checks">
        <legend>Alerts</legend>
        <label><input type="checkbox" name="refunds" checked /> Email me when refunds exceed 5% of orders</label>
        <label><input type="checkbox" name="stock" checked /> Email me when a top product drops below 25 units</label>
        <label><input type="checkbox" name="digest" /> Daily digest instead of weekly</label>
      </fieldset>
      <div class="form-foot">
        <button type="submit" class="btn">Save changes</button>
        <p role="status" class="ok">{{ saved ? 'Saved (demo only).' : '' }}</p>
      </div>
    </form>
  </div>
</template>
