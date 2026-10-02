'use client';

import { useState } from 'react';
import { useTheme } from '@/components/Shell';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (!email.value.trim() || !email.checkValidity()) {
      setError('Enter a valid email address for reports, like name@company.com.');
      setSaved(false);
      email.focus();
      return;
    }
    setError('');
    setSaved(true);
  };

  return (
    <div className="page narrow">
      <header className="page-head"><div><h1>Settings</h1><p className="sub">Changes here are a demo and are not saved.</p></div></header>

      <section className="card" aria-labelledby="ap-title">
        <h2 id="ap-title">Appearance</h2>
        <div className="range theme-pick" role="group" aria-label="Theme">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <p className="muted small-print">System follows your device setting. Your choice is remembered in this browser.</p>
      </section>

      <form className="card form" noValidate onSubmit={onSubmit} aria-labelledby="rep-title" onChange={() => setSaved(false)}>
        <h2 id="rep-title">Reports</h2>
        <div className="field">
          <label htmlFor="email">Send weekly report to</label>
          <input id="email" name="email" type="email" defaultValue="team@northwind.example" aria-invalid={!!error || undefined} aria-describedby={error ? 'email-err' : undefined} />
          {error && <p className="err" id="email-err">{error}</p>}
        </div>
        <div className="field">
          <label htmlFor="currency">Reporting currency</label>
          <select id="currency" name="currency" defaultValue="USD">
            <option value="USD">US dollar (USD)</option>
            <option value="CAD">Canadian dollar (CAD)</option>
            <option value="GBP">British pound (GBP)</option>
          </select>
        </div>
        <fieldset className="checks">
          <legend>Alerts</legend>
          <label><input type="checkbox" name="refunds" defaultChecked /> Email me when refunds exceed 5% of orders</label>
          <label><input type="checkbox" name="stock" defaultChecked /> Email me when a top product drops below 25 units</label>
          <label><input type="checkbox" name="digest" /> Daily digest instead of weekly</label>
        </fieldset>
        <div className="form-foot">
          <button type="submit" className="btn">Save changes</button>
          <p role="status" className="ok">{saved ? 'Saved (demo only).' : ''}</p>
        </div>
      </form>
    </div>
  );
}
