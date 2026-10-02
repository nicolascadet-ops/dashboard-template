export type Theme = 'system' | 'light' | 'dark';

// Theme choice is stored in localStorage and applied as data-theme on <html>.
// The inline script in nuxt.config.ts applies it before first paint.
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'system');
  const osDark = useState('os-dark', () => false);

  onMounted(() => {
    const t = document.documentElement.dataset.theme;
    theme.value = t === 'light' || t === 'dark' ? t : 'system';
    const mq = matchMedia('(prefers-color-scheme: dark)');
    osDark.value = mq.matches;
    mq.addEventListener('change', (e) => { osDark.value = e.matches; });
  });

  const setTheme = (t: Theme) => {
    theme.value = t;
    try { t === 'system' ? localStorage.removeItem('pulse-theme') : localStorage.setItem('pulse-theme', t); } catch {}
    if (t === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
  };

  const isDark = computed(() => theme.value === 'dark' || (theme.value === 'system' && osDark.value));
  return { theme, setTheme, isDark };
}
