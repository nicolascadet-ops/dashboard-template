'use client';

import { useMemo, useState } from 'react';
import { Icon } from './Icon';

export type Column<T> = {
  key: keyof T & string;
  label: string;
  num?: boolean;
  hideSm?: boolean; // hidden below 640px so the key columns fit on phones
  render?: (row: T) => React.ReactNode;
};

// Sortable, paginated table shared by Orders and Customers
export default function DataTable<T extends Record<string, unknown>>({ rows, columns, pageSize = 12, caption, empty }: {
  rows: T[];
  columns: Column<T>[];
  pageSize?: number;
  caption: string;
  empty: React.ReactNode;
}) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * sort.dir;
    });
  }, [rows, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = sorted.slice(current * pageSize, current * pageSize + pageSize);

  const toggle = (key: string) => {
    setSort((s) => (s?.key === key ? (s.dir === -1 ? { key, dir: 1 } : null) : { key, dir: -1 }));
    setPage(0);
  };

  if (rows.length === 0) return <div className="empty">{empty}</div>;

  return (
    <>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => {
                const state = sort?.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none';
                return (
                  <th key={c.key} scope="col" className={[c.num && 'num', c.hideSm && 'hide-sm'].filter(Boolean).join(' ') || undefined} aria-sort={state}>
                    <button type="button" className="th-btn" onClick={() => toggle(c.key)}>
                      {c.label}
                      <Icon name={state === 'ascending' ? 'up' : state === 'descending' ? 'down' : 'sort'} size={14} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => <td key={c.key} className={[c.num && 'num', c.hideSm && 'hide-sm'].filter(Boolean).join(' ') || undefined}>{c.render ? c.render(r) : String(r[c.key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <p className="muted">{current * pageSize + 1}–{Math.min(sorted.length, (current + 1) * pageSize)} of {sorted.length}</p>
        <div className="pager-btns">
          <button type="button" className="icon-btn" onClick={() => setPage(current - 1)} disabled={current === 0} aria-label="Previous page"><Icon name="left" /></button>
          <span className="muted">Page {current + 1} of {pages}</span>
          <button type="button" className="icon-btn" onClick={() => setPage(current + 1)} disabled={current >= pages - 1} aria-label="Next page"><Icon name="right" /></button>
        </div>
      </div>
    </>
  );
}
