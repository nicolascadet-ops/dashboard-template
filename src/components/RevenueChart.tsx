'use client';

import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { money, shortDate } from '@/lib/data';

type Point = { date: string; revenue: number; previous: number };

// One axis, two series: this period (blue) and the previous period (muted grey line) for comparison.
export default function RevenueChart({ data, bucketLabel }: { data: Point[]; bucketLabel: string }) {
  return (
    <div className="chart" role="img" aria-label={`Revenue ${bucketLabel}, this period compared with the previous period. Exact values are in the table below the chart.`}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={{ stroke: 'var(--axis)' }} tick={{ fill: 'var(--muted)', fontSize: 12 }} minTickGap={32} />
          <YAxis tickFormatter={(v) => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`)} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} width={48} />
          <Tooltip content={<ChartTip />} cursor={{ stroke: 'var(--axis)', strokeWidth: 1 }} />
          <Line type="monotone" dataKey="previous" name="Previous period" stroke="var(--compare)" strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
          <Area type="monotone" dataKey="revenue" name="This period" stroke="var(--series-1)" strokeWidth={2} fill="url(#rev-fill)" activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type TipProps = { active?: boolean; label?: string; payload?: { name: string; value: number; color?: string; stroke?: string }[] };
function ChartTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tip">
      <p className="tip-date">{label && shortDate(label)}</p>
      {[...payload].reverse().map((p) => (
        <p key={p.name} className="tip-row">
          <span className="tip-key" style={{ background: p.stroke }} />
          <b>{money(p.value)}</b>
          <span>{p.name}</span>
        </p>
      ))}
    </div>
  );
}
