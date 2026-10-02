'use client';

import { useState } from 'react';
import { ORDERS, money, shortDate, type Order, type OrderStatus } from '@/lib/data';
import DataTable, { type Column } from '@/components/DataTable';
import Status from '@/components/Status';
import { Icon } from '@/components/Icon';

const STATUSES: (OrderStatus | 'All')[] = ['All', 'Paid', 'Pending', 'Refunded', 'Failed'];

const COLUMNS: Column<Order>[] = [
  { key: 'id', label: 'Order', render: (o) => <span className="mono">{o.id}</span> },
  { key: 'date', label: 'Date', render: (o) => shortDate(o.date) },
  { key: 'customer', label: 'Customer', render: (o) => <><b>{o.customer}</b><small className="muted block">{o.email}</small></> },
  { key: 'channel', label: 'Channel' },
  { key: 'status', label: 'Status', render: (o) => <Status status={o.status} /> },
  { key: 'items', label: 'Items', num: true },
  { key: 'total', label: 'Total', num: true, render: (o) => money(o.total, 2) },
];

function exportCsv(rows: Order[]) {
  const head = ['Order', 'Date', 'Customer', 'Email', 'Channel', 'Status', 'Items', 'Total'];
  const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [head, ...rows.map((o) => [o.id, o.date.slice(0, 10), o.customer, o.email, o.channel, o.status, o.items, o.total.toFixed(2)])].map((r) => r.map(esc).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function OrdersPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'All'>('All');
  const term = q.trim().toLowerCase();
  const rows = ORDERS.filter((o) => (status === 'All' || o.status === status) && (!term || `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(term)));

  return (
    <div className="page">
      <header className="page-head">
        <div><h1>Orders</h1><p className="sub">{ORDERS.length} orders · sample data</p></div>
        <button type="button" className="btn btn-ghost" onClick={() => exportCsv(rows)}><Icon name="download" size={18} />Export CSV</button>
      </header>
      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search orders</span>
          <input type="search" placeholder="Search by order, name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="range" role="group" aria-label="Filter by status">
          {STATUSES.map((s) => <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>{s}</button>)}
        </div>
      </div>
      <section className="card flush" aria-label="Orders table">
        <DataTable
          key={`${status}-${term}`}
          rows={rows}
          columns={COLUMNS}
          caption="Orders"
          empty={<><p><b>No orders match.</b></p><p className="muted">Try a different name or clear the status filter.</p><button type="button" className="btn btn-ghost" onClick={() => { setQ(''); setStatus('All'); }}>Clear filters</button></>}
        />
      </section>
    </div>
  );
}
