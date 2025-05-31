'use client';
import { Sale } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  sales: Sale[];
};

export default function CountrySalesChart({ sales }: Props) {
  const data = Object.values(
    sales.reduce((acc, sale) => {
      if (!acc[sale.country]) acc[sale.country] = { country: sale.country, quantity: 0 };
      acc[sale.country].quantity += sale.quantity;
      return acc;
    }, {} as Record<string, { country: string; quantity: number }>)
  );

  return (
    <div className="w-full h-64 mb-8">
      <h3 className="text-lg font-semibold mb-2">各國銷售量</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
