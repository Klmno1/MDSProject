'use client';
import { Sale } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

type Props = {
  sales: Sale[];
};

export default function CountrySalesChart({ sales }: Props) {
  const aggregatedData = Object.values(
    sales.reduce(
      (acc, sale) => {
        if (!acc[sale.country]) {
          acc[sale.country] = { country: sale.country, salesQty: 0, returnsQty: 0 };
        }
        if (sale.quantity > 0) {
          acc[sale.country].salesQty += sale.quantity;
        } else {
          acc[sale.country].returnsQty += Math.abs(sale.quantity);
        }
        return acc;
      },
      {} as Record<
        string,
        { country: string; salesQty: number; returnsQty: number }
      >
    )
  );

  // Sort countries by salesQty in descending order
  const data = aggregatedData.sort((a, b) => b.salesQty - a.salesQty);

  const barProps = {
    maxBarSize: 40,
    barGap: 0,
    barCategoryGap: '10%',
  };

  return (
    <div className="w-full h-64 mb-8">
      <h3 className="text-lg font-semibold mb-2">各國銷售與退貨量</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={barProps.barCategoryGap}
          barGap={barProps.barGap}
          maxBarSize={barProps.maxBarSize}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="salesQty" fill="rgb(79, 70, 229)" name="銷售量" />
          <Bar dataKey="returnsQty" fill="rgb(241, 28, 28)" name="退貨量" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
