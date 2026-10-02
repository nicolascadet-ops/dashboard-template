'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RANGES, ORDERS, LOW_STOCK, topProducts, channelSplit, money, num, pct, rangeData, shortDate, type RangeId } from '@/lib/data';
import RevenueChart from '@/components/RevenueChart';
import ChannelChart from '@/components/ChannelChart';
import Status from '@/components/Status';
import { Icon } from '@/components/Icon';

function Delta({ now, before, basis, invert = false }: { now: number; before: number; basis: string; invert?: boolean }) {
  const d = (now - before) / before;
  const good = invert ? d < 0 : d >= 0;
  return (
    <span className={`delta ${good ? 'up' : 'down'}`}>
      <Icon name={d >= 0 ? 'up' : 'down'} size={14} />
      {pct(Math.abs(d))}
      <span className="sr-only">{d >= 0 ? 'increase' : 'decrease'}</span>
      <span className="basis">vs {basis}</span>
    </span>
  );
}

export default function Overview() {
  const [range, setRange] = useState<RangeId>('30d');
  const { current: c, previous: p, series, bucket } = rangeData(range);
  const channels = channelSplit(range);
  const rangeLabel = RANGES.find((r) => r.id === range)!.label;
  const label = rangeLabel.toLowerCase();
  const basis = `previous ${label.replace('last ', '')}`;
  const products = topProducts(range);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Overview</h1>
          <p className="sub">Northwind Outdoor · sample data</p>
        </div>
        <div className="range" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r.id} type="button" aria-pressed={range === r.id} onClick={() => setRange(r.id)}>{r.label.replace('Last ', '')}</button>
          ))}
        </div>
      </header>

      <section className="kpis" aria-label={`Key figures, ${label}`}>
        <div className="kpi"><p className="kpi-label">Revenue</p><p className="kpi-value">{money(c.revenue)}</p><Delta now={c.revenue} before={p.revenue} basis={basis} /></div>
        <div className="kpi"><p className="kpi-label">Orders</p><p className="kpi-value">{num(c.orders)}</p><Delta now={c.orders} before={p.orders} basis={basis} /></div>
        <div className="kpi"><p className="kpi-label">Average order value</p><p className="kpi-value">{money(c.aov, 2)}</p><Delta now={c.aov} before={p.aov} basis={basis} /></div>
        <div className="kpi"><p className="kpi-label">Conversion rate</p><p className="kpi-value">{pct(c.conversion, 2)}</p><Delta now={c.conversion} before={p.conversion} basis={basis} /></div>
      </section>

      <section className="card span-2" aria-labelledby="rev-title">
        <div className="card-head">
          <div>
            <h2 id="rev-title">Revenue</h2>
            <p className="sub">{bucket > 1 ? 'Weekly totals' : 'Daily totals'}, {label}</p>
          </div>
          <ul className="legend" aria-label="Legend">
            <li><span className="lkey" style={{ background: 'var(--series-1)' }} />This period</li>
            <li><span className="lkey" style={{ background: 'var(--compare)' }} />Previous period</li>
          </ul>
        </div>
        <RevenueChart data={series} bucketLabel={label} />
        <button type="button" className="link-btn" aria-expanded={showTable} onClick={() => setShowTable((s) => !s)}>{showTable ? 'Hide' : 'Show'} data table</button>
        {showTable && (
          <div className="table-wrap small">
            <table>
              <thead><tr><th scope="col">{bucket > 1 ? 'Week of' : 'Date'}</th><th scope="col" className="num">This period</th><th scope="col" className="num">Previous period</th></tr></thead>
              <tbody>{series.map((s) => <tr key={s.date}><td>{shortDate(s.date)}</td><td className="num">{money(s.revenue)}</td><td className="num">{money(s.previous)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid-2">
        <section className="card" aria-labelledby="ch-title">
          <div className="card-head"><div><h2 id="ch-title">Revenue by channel</h2><p className="sub">{rangeLabel}</p></div></div>
          <ChannelChart data={channels} />
        </section>

        <section className="card" aria-labelledby="tp-title">
          <div className="card-head"><div><h2 id="tp-title">Top products</h2><p className="sub">{rangeLabel}</p></div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th scope="col">Product</th><th scope="col" className="num">Units</th><th scope="col" className="num">Revenue</th></tr></thead>
              <tbody>
                {products.map((t) => (
                  <tr key={t.sku}><td><b>{t.name}</b><small className="muted block">{t.sku}{t.stock < LOW_STOCK && <span className="low"> · <Icon name="alert" size={13} />Low stock: {t.stock} left</span>}</small></td><td className="num">{num(t.units)}</td><td className="num">{money(t.revenue)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="card" aria-labelledby="ro-title">
        <div className="card-head">
          <div><h2 id="ro-title">Recent orders</h2></div>
          <Link href="/orders/" className="btn btn-ghost">View all orders</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Status</th><th scope="col" className="num">Total</th></tr></thead>
            <tbody>
              {ORDERS.slice(0, 6).map((o) => (
                <tr key={o.id}><td className="mono">{o.id}</td><td>{o.customer}</td><td><Status status={o.status} /></td><td className="num">{money(o.total, 2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
