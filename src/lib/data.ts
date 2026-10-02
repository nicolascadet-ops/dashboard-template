// Mock data for the demo. Generated from a fixed seed, so every build shows the same numbers.
// Replace these functions with calls to your own API, database or analytics provider.

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
const rand = rng(42);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

export const TODAY = new Date('2026-09-30T12:00:00Z');
const DAY = 86_400_000;

export type DayPoint = { date: string; revenue: number; orders: number; visitors: number };

// 730 days so every range has a previous period to compare with
export const DAILY: DayPoint[] = Array.from({ length: 730 }, (_, i) => {
  const d = new Date(TODAY.getTime() - (729 - i) * DAY);
  const trend = 1 + i / 900;
  const weekday = [0.82, 1.05, 1.0, 1.02, 1.08, 1.18, 0.9][d.getUTCDay()];
  const season = 1 + 0.18 * Math.sin(((d.getUTCMonth() + 1) / 12) * Math.PI * 2 - 4.19) + (d.getUTCMonth() === 10 ? 0.35 : 0);
  const visitors = Math.round(2400 * trend * weekday * season * (0.9 + rand() * 0.2));
  const orders = Math.round(visitors * (0.026 + rand() * 0.006));
  const revenue = Math.round(orders * (68 + rand() * 14));
  return { date: d.toISOString().slice(0, 10), revenue, orders, visitors };
});

export const RANGES = [
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '90d', label: 'Last 90 days', days: 90 },
  { id: '12m', label: 'Last 12 months', days: 365 },
] as const;
export type RangeId = (typeof RANGES)[number]['id'];

export function rangeData(id: RangeId) {
  const days = RANGES.find((r) => r.id === id)!.days;
  const current = DAILY.slice(-days);
  const previous = DAILY.slice(-days * 2, -days);
  const sum = (arr: DayPoint[], k: keyof Omit<DayPoint, 'date'>) => arr.reduce((s, p) => s + p[k], 0);
  const kpi = (arr: DayPoint[]) => {
    const revenue = sum(arr, 'revenue');
    const orders = sum(arr, 'orders');
    const visitors = sum(arr, 'visitors');
    return { revenue, orders, aov: revenue / orders, conversion: orders / visitors };
  };
  // Long ranges are bucketed by week so the line stays readable
  const bucket = days > 90 ? 7 : 1;
  const series = [];
  for (let i = 0; i < current.length; i += bucket) {
    const cur = current.slice(i, i + bucket);
    const prev = previous.slice(i, i + bucket);
    series.push({ date: cur[0].date, revenue: sum(cur, 'revenue'), previous: sum(prev, 'revenue') });
  }
  return { current: kpi(current), previous: kpi(previous), series, bucket };
}

export const CHANNELS = ['Organic search', 'Paid social', 'Email', 'Direct', 'Referral'] as const;
export function channelSplit(id: RangeId) {
  const total = rangeData(id).current.revenue;
  const shares = [0.34, 0.24, 0.19, 0.15, 0.08];
  return CHANNELS.map((c, i) => ({ channel: c, revenue: Math.round(total * shares[i]) }));
}

// Top products follow the selected range: each takes a fixed share of that period's revenue
const PRODUCTS = [
  { name: 'Trail Runner GTX', sku: 'NW-1054', price: 165, share: 0.13, stock: 212 },
  { name: 'Merino Base Layer', sku: 'NW-1061', price: 79, share: 0.11, stock: 18 },
  { name: 'Ridge 35L Pack', sku: 'NW-1040', price: 149, share: 0.09, stock: 140 },
  { name: 'Insulated Bottle 1L', sku: 'NW-1089', price: 39, share: 0.08, stock: 23 },
  { name: 'Headlamp Pro 400', sku: 'NW-1082', price: 59, share: 0.06, stock: 305 },
];
export const LOW_STOCK = 25;
export function topProducts(id: RangeId) {
  const total = rangeData(id).current.revenue;
  return PRODUCTS.map((p) => {
    const units = Math.round((total * p.share) / p.price);
    return { ...p, units, revenue: units * p.price };
  });
}

export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type Order = { id: string; customer: string; email: string; date: string; items: number; total: number; status: OrderStatus; channel: (typeof CHANNELS)[number] };

const FIRST = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Lucas', 'Mia', 'Mason', 'Amelia', 'Logan', 'Harper', 'Jack', 'Chloé', 'Arjun', 'Zara', 'Mateo', 'Yuki', 'Kwame'];
const LAST = ['Smith', 'Tremblay', 'Patel', 'Nguyen', 'Brown', 'Roy', 'Wilson', 'Martin', 'Garcia', 'Lee', 'Okafor', 'Murphy', 'Singh', 'Cohen', 'Gagnon'];

export const ORDERS: Order[] = Array.from({ length: 240 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const r = rand();
  const status: OrderStatus = r < 0.82 ? 'Paid' : r < 0.91 ? 'Pending' : r < 0.97 ? 'Refunded' : 'Failed';
  const items = 1 + Math.floor(rand() * 3);
  return {
    id: `#${48210 - i}`,
    customer: `${first} ${last}`,
    email: `${first.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}.${last.toLowerCase()}@example.com`,
    date: new Date(TODAY.getTime() - i * 0.0075 * DAY - rand() * 300_000).toISOString(),
    items,
    total: Math.round(items * (24 + rand() * 26) * 100) / 100,
    status,
    channel: pick(CHANNELS),
  };
});
// Make sure the newest page shows every status
ORDERS[0].status = 'Pending';
ORDERS[3].status = 'Refunded';
ORDERS[5].status = 'Failed';

export const REGIONS = ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'California', 'New York', 'England', 'Scotland'] as const;
export const CUSTOMERS = Array.from({ length: 60 }, (_, i) => {
  const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;
  const orders = 1 + Math.floor(rand() * 14);
  return {
    id: `C-${2100 + i}`,
    name,
    email: `${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(' ', '.')}@example.com`,
    region: pick(REGIONS),
    orders,
    spent: Math.round(orders * (55 + rand() * 40)),
    since: new Date(TODAY.getTime() - (30 + rand() * 900) * DAY).toISOString().slice(0, 10),
  };
}).sort((a, b) => b.spent - a.spent);

export const money = (n: number, digits = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
export const num = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
export const pct = (n: number, digits = 1) => `${(n * 100).toFixed(digits)}%`;
export const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
