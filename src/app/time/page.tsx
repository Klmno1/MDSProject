// app/time/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const sampleProductData: Record<string, string[]> = {
  '2024-12': ['聖誕毛衣', '保暖手套', '加厚圍巾'],
  '2024-07': ['涼感T恤', '防曬乳', '海灘拖鞋'],
  '2024-03': ['輕便外套', '春季口罩', '防花粉眼鏡'],
};

export default function TimeBasedSuggestionPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [suggestedProducts, setSuggestedProducts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = () => {
    const key = selectedDate.slice(0, 7); // YYYY-MM
    setSuggestedProducts(sampleProductData[key] || []);
    setSubmitted(true);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-zinc-900 text-white shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">根據時間推薦上架商品</h2>
          <div className="space-y-2">
            <Label htmlFor="date">選擇日期</Label>
            <Input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition-all"
          >
            查詢推薦商品
          </button>
        </CardContent>
      </Card>

      {submitted && (
        <Card className="bg-zinc-900 text-white shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {format(new Date(selectedDate), 'yyyy年MM月')} 推薦上架商品：
            </h3>
            {suggestedProducts.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {suggestedProducts.map((product, idx) => (
                  <li key={idx}>{product}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">查無推薦資料。</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
