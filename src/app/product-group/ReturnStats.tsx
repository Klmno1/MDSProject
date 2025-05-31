'use client';
import { Sale } from '@/lib/types';

type Props = {
  sales: Sale[];
};

export default function ReturnStats({ sales }: Props) {
  const total = sales.reduce((sum, s) => sum + s.quantity, 0);
  const returned = sales.filter(s => s.isReturned).reduce((sum, s) => sum + s.quantity, 0);
  const rate = total > 0 ? (returned / total) * 100 : 0;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-1">退貨率分析</h3>
      <p>總銷售量：{total}</p>
      <p>退貨量：{returned}</p>
      <p>退貨率：{rate.toFixed(2)}%</p>
    </div>
  );
}
