import type { OrderStatus } from '@/lib/data';
import { Icon, type IconName } from './Icon';

// Status always pairs colour with an icon and a label, never colour alone
const MAP: Record<OrderStatus, { cls: string; icon: IconName }> = {
  Paid: { cls: 'good', icon: 'check' },
  Pending: { cls: 'warning', icon: 'clock' },
  Refunded: { cls: 'neutral', icon: 'undo' },
  Failed: { cls: 'critical', icon: 'alert' },
};

export default function Status({ status }: { status: OrderStatus }) {
  const m = MAP[status];
  return <span className={`status ${m.cls}`}><Icon name={m.icon} size={14} />{status}</span>;
}
