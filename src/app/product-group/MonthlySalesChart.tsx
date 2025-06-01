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

export default function MonthlySalesCharts({ sales }: Props) {
  const monthlyData = sales.reduce((acc, sale) => {
    const key = `${sale.year}-${sale.month.toString().padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = {
        month: key,
        salesQty: 0,
        returnsQty: 0,
        salesAmount: 0,
        returnsAmount: 0,
      };
    }

    if (sale.quantity > 0) {
      acc[key].salesQty += sale.quantity;
      acc[key].salesAmount += sale.quantity * sale.price;
    } else {
      acc[key].returnsQty += Math.abs(sale.quantity);
      acc[key].returnsAmount += Math.abs(sale.quantity) * sale.price;
    }

    return acc;
  }, {} as Record<
    string,
    {
      month: string;
      salesQty: number;
      returnsQty: number;
      salesAmount: number;
      returnsAmount: number;
    }
  >);

  const data = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  const barProps = {
    maxBarSize: 40,
    barGap: 0,
    barCategoryGap: '10%',
  };

  return (
    <>
      <div className="w-full h-72 mb-8">
        <h3 className="text-lg font-semibold mb-2">每月銷售與退貨數量</h3>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={barProps.barCategoryGap}
            barGap={barProps.barGap}
            maxBarSize={barProps.maxBarSize}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="salesQty" fill="rgb(11, 165, 68)" name="銷售量 (數量)" />
            <Bar dataKey="returnsQty" fill="rgb(241, 28, 28)" name="退貨量 (數量)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-72 mb-8">
        <h3 className="text-lg font-semibold mb-2">每月銷售與退貨金額</h3>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={barProps.barCategoryGap}
            barGap={barProps.barGap}
            maxBarSize={barProps.maxBarSize}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="salesAmount" fill="rgb(11, 165, 68)" name="銷售量 (金額)" />
            <Bar dataKey="returnsAmount" fill="rgb(241, 28, 28)" name="退貨量 (金額)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
