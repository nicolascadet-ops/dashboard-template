'use client';

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { money, pct } from '@/lib/data';

type Row = { channel: string; revenue: number };

// One series, so one colour for every bar; values are labelled directly at the bar ends.
export default function ChannelChart({ data }: { data: Row[] }) {
  const total = data.reduce((s, d) => s + d.revenue, 0);
  return (
    <div className="chart" role="img" aria-label={`Revenue by channel: ${data.map((d) => `${d.channel} ${money(d.revenue)}`).join(', ')}.`}>
      <ResponsiveContainer width="100%" height={data.length * 44 + 8}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }} barCategoryGap={10}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="channel" tickLine={false} axisLine={false} width={116} tick={{ fill: 'var(--text-2)', fontSize: 13 }} />
          <Tooltip cursor={{ fill: 'var(--hover)' }} content={({ active, payload }) => active && payload?.length ? (
            <div className="tip">
              <p className="tip-row"><b>{money(payload[0].value as number)}</b><span>{pct((payload[0].value as number) / total)} of revenue</span></p>
            </div>
          ) : null} />
          <Bar dataKey="revenue" fill="var(--series-1)" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="revenue" position="right" formatter={(v) => `$${Math.round(Number(v) / 1000)}k`} fill="var(--text-2)" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
