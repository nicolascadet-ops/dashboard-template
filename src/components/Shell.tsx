'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon, type IconName } from './Icon';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Overview', icon: 'chart' },
  { href: '/orders/', label: 'Orders', icon: 'receipt' },
  { href: '/customers/', label: 'Customers', icon: 'users' },
  { href: '/settings/', label: 'Settings', icon: 'gear' },
];

type Theme = 'system' | 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  useEffect(() => {
    const read = () => {
      const t = document.documentElement.dataset.theme;
      setThemeState(t === 'light' || t === 'dark' ? t : 'system');
    };
    read();
    // Keep every component using this hook in sync (sidebar toggle and Settings page)
    window.addEventListener('pulse-theme', read);
    return () => window.removeEventListener('pulse-theme', read);
  }, []);
  const setTheme = (t: Theme) => {
    try { t === 'system' ? localStorage.removeItem('pulse-theme') : localStorage.setItem('pulse-theme', t); } catch {}
    if (t === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    window.dispatchEvent(new Event('pulse-theme'));
  };
  return { theme, setTheme };
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [osDark, setOsDark] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const update = () => setOsDark(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && osDark);

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <aside className={`side${open ? ' open' : ''}`}>
        <div className="side-top">
          <Link href="/" className="logo" aria-label="Pulse, overview">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--series-1)" /><path d="M5 17h5l3-7 5 13 3-6h6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Pulse
          </Link>
          <button type="button" className="icon-btn menu-toggle" aria-expanded={open} aria-controls="side-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
        <nav id="side-nav" aria-label="Main" className="side-nav">
          <p className="ws"><span className="ws-av" aria-hidden="true">NO</span><span><b>Northwind Outdoor</b><small>Demo workspace</small></span></p>
          <ul>
            {NAV.map((n) => {
              const active = n.href === '/' ? path === '/' : path.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active ? 'page' : undefined}><Icon name={n.icon} />{n.label}</Link>
                </li>
              );
            })}
          </ul>
          <div className="side-foot">
            <button type="button" className="theme-btn" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
              <Icon name={isDark ? 'sun' : 'moon'} />{isDark ? 'Light theme' : 'Dark theme'}
            </button>
            <p className="credit">Template by <a href="https://ncatelier.com">NC Atelier</a></p>
          </div>
        </nav>
      </aside>
      <main id="main" className="main">{children}</main>
    </div>
  );
}
