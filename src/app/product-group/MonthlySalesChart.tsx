'use client';
import { Sale } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  sales: Sale[];
};

export default function MonthlySalesChart({ sales }: Props) {
  const data = Object.values(
    sales.reduce((acc, sale) => {
      const key = `${sale.year}-${sale.month.toString().padStart(2, '0')}`;
      if (!acc[key]) acc[key] = { month: key, quantity: 0 };
      acc[key].quantity += sale.quantity;
      return acc;
    }, {} as Record<string, { month: string; quantity: number }>)
  ).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="w-full h-64 mb-8">
      <h3 className="text-lg font-semibold mb-2">每月銷售量</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#16A34A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
