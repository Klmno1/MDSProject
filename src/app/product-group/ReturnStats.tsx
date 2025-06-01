'use client';
import { Sale } from '@/lib/types';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  sales: Sale[];
};

const COLORS = ['#16A34A', '#EF4444']; // green for sales, red for returns

export default function ReturnStats({ sales }: Props) {
  const totalSales = sales
    .filter(s => s.quantity > 0)
    .reduce((sum, s) => sum + s.quantity, 0);

  const totalReturned = sales
    .filter(s => s.quantity < 0)
    .reduce((sum, s) => sum + Math.abs(s.quantity), 0);

  const rate = totalSales + totalReturned > 0
    ? (totalReturned / (totalSales + totalReturned)) * 100
    : 0;

  const data = [
    { name: '銷售量', value: totalSales },
    { name: '退貨量', value: totalReturned },
  ];

  return (
    <div className="mb-8 w-full max-w-sm mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">退貨率分析</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(1)}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} 件`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p>總銷售量：{totalSales}</p>
        <p>退貨量：{totalReturned}</p>
        <p>退貨率：{rate.toFixed(2)}%</p>
      </div>
    </div>
  );
}
