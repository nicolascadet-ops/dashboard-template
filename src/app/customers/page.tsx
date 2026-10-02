'use client';

import { useState } from 'react';
import { CUSTOMERS, money, num } from '@/lib/data';
import DataTable, { type Column } from '@/components/DataTable';
import { Icon } from '@/components/Icon';

type Customer = (typeof CUSTOMERS)[number];
const COLUMNS: Column<Customer>[] = [
  { key: 'name', label: 'Customer', render: (c) => <><b>{c.name}</b><small className="muted block hide-sm">{c.email}</small></> },
  { key: 'region', label: 'Region', hideSm: true },
  { key: 'since', label: 'Customer since', hideSm: true, render: (c) => new Date(c.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) },
  { key: 'orders', label: 'Orders', num: true },
  { key: 'spent', label: 'Lifetime spend', num: true, render: (c) => money(c.spent) },
];

export default function CustomersPage() {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const rows = CUSTOMERS.filter((c) => !term || `${c.name} ${c.email} ${c.region}`.toLowerCase().includes(term));
  const repeat = CUSTOMERS.filter((c) => c.orders > 1).length / CUSTOMERS.length;
  const avg = CUSTOMERS.reduce((s, c) => s + c.spent, 0) / CUSTOMERS.length;

  return (
    <div className="page">
      <header className="page-head"><div><h1>Customers</h1><p className="sub">Top {CUSTOMERS.length} customers by spend · sample data</p></div></header>
      <section className="kpis three" aria-label="Customer figures">
        <div className="kpi"><p className="kpi-label">Customers shown</p><p className="kpi-value">{num(CUSTOMERS.length)}</p></div>
        <div className="kpi"><p className="kpi-label">Repeat customers</p><p className="kpi-value">{Math.round(repeat * 100)}%</p></div>
        <div className="kpi"><p className="kpi-label">Average lifetime spend</p><p className="kpi-value">{money(avg)}</p></div>
      </section>
      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search customers</span>
          <input type="search" placeholder="Search by name, email or region" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <section className="card flush" aria-label="Customers table">
        <DataTable key={term} rows={rows} columns={COLUMNS} caption="Customers" empty={<><p><b>No customers match “{q}”.</b></p><button type="button" className="btn btn-ghost" onClick={() => setQ('')}>Clear search</button></>} />
      </section>
    </div>
  );
}
