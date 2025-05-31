'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const productGroups = ['電子產品', '服飾', '家用品', '運動器材', '美妝保養'];

const productsByGroup: Record<string, { id: string; name: string }[]> = {
  電子產品: [
    { id: 'p1', name: '手機' },
    { id: 'p2', name: '藍牙耳機' },
    { id: 'p3', name: '充電器' },
  ],
  服飾: [
    { id: 'p4', name: 'T恤' },
    { id: 'p5', name: '牛仔褲' },
    { id: 'p6', name: '帽子' },
  ],
  家用品: [
    { id: 'p7', name: '吸塵器' },
    { id: 'p8', name: '廚房刀具' },
  ],
  運動器材: [
    { id: 'p9', name: '瑜珈墊' },
    { id: 'p10', name: '跑步鞋' },
  ],
  美妝保養: [
    { id: 'p11', name: '面膜' },
    { id: 'p12', name: '潤膚乳' },
  ],
};

const productIdToName: Record<string, string> = {};
Object.values(productsByGroup).flat().forEach(({ id, name }) => {
  productIdToName[id] = name;
});

const returnRateData: Record<
  string,
  { month: string; sales: number; returns: number }[]
> = {
  p1: [
    { month: '1月', sales: 1200, returns: 100 },
    { month: '2月', sales: 900, returns: 90 },
  ],
  p2: [
    { month: '1月', sales: 800, returns: 50 },
    { month: '2月', sales: 700, returns: 40 },
  ],
  p4: [
    { month: '1月', sales: 1000, returns: 200 },
    { month: '2月', sales: 950, returns: 210 },
  ],
  // add more as needed
};

const seasonRecommendation: Record<string, string[]> = {
  電子產品: ['春季', '秋季'],
  服飾: ['夏季', '冬季'],
  家用品: ['全年'],
  運動器材: ['春季', '夏季'],
  美妝保養: ['秋季', '冬季'],
};

const relatedProducts: Record<string, string[]> = {
  電子產品: ['手機配件', '藍牙耳機', '充電器'],
  服飾: ['帽子', '圍巾', '手套'],
  家用品: ['清潔用品', '廚房工具'],
  運動器材: ['瑜珈墊', '跑步鞋'],
  美妝保養: ['面膜', '潤膚乳'],
};

export default function ProductGroupPage() {
  const searchParams = useSearchParams();
  const productIdFromQuery = searchParams.get('product') || '';

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // On mount or when query param changes, find the group for the productId and set both states
  useEffect(() => {
    if (!productIdFromQuery) {
      setSelectedGroup('');
      setSelectedProductId('');
      return;
    }

    // Find the group that contains this product id
    const foundGroup = productGroups.find((group) =>
      productsByGroup[group].some((p) => p.id === productIdFromQuery)
    );

    if (foundGroup) {
      setSelectedGroup(foundGroup);
      setSelectedProductId(productIdFromQuery);
    } else {
      // Product ID not found in any group
      setSelectedGroup('');
      setSelectedProductId('');
    }
  }, [productIdFromQuery]);

  const products = selectedGroup ? productsByGroup[selectedGroup] || [] : [];
  const data = selectedProductId ? returnRateData[selectedProductId] || [] : [];

  const topReturnRateMonths =
    data
      .map((entry) => ({
        ...entry,
        returnRate: entry.sales > 0 ? (entry.returns / entry.sales) * 100 : 0,
      }))
      .sort((a, b) => b.returnRate - a.returnRate)
      .slice(0, 3) || [];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">商品群分析</h2>
      <p className="text-gray-300">
        請先選擇商品群，再選擇商品以分析退貨率、顧客行為與推薦商品。
      </p>

      <div className="flex gap-4">
        <select
          className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          onChange={(e) => setSelectedGroup(e.target.value)}
          value={selectedGroup}
        >
          <option value="" disabled>
            選擇商品群
          </option>
          {productGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          onChange={(e) => setSelectedProductId(e.target.value)}
          value={selectedProductId}
          disabled={!selectedGroup}
        >
          <option value="" disabled>
            選擇商品
          </option>
          {products.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {selectedProductId ? (
        <>
          {/* Return Rate Chart */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-white">
              退貨率分析 (每月) - {productIdToName[selectedProductId]}
            </h3>
            {data.length > 0 ? (
              <div className="w-full flex justify-center">
                <div className="w-[50%]">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                      <XAxis dataKey="month" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip
                        wrapperStyle={{ color: 'black' }}
                        contentStyle={{ backgroundColor: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="sales" fill="#3b82f6" name="銷售量" />
                      <Bar
                        dataKey="returns"
                        fill="#ef4444"
                        name="退貨量"
                        label={({ x, y, width, value, index }) => {
                          const entry = data[index];
                          if (!entry || entry.sales === 0) return null;
                          const rate = (entry.returns / entry.sales) * 100;
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 6}
                              fill="#fff"
                              fontSize={14}
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              退貨率 {rate.toFixed(1)}%
                            </text>
                          );
                        }}
                      >
                        {data.map((entry, index) => {
                          const rate = entry.returns / entry.sales;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={rate > 0.1 ? '#dc2626' : '#ef4444'}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic">沒有退貨率數據。</p>
            )}
          </section>

          {/* Top 3 Return Rate Months */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">
              退貨率最高的月份
            </h3>
            {topReturnRateMonths.length > 0 ? (
              <ul className="list-decimal list-inside text-gray-300">
                {topReturnRateMonths.map((entry, idx) => (
                  <li key={idx}>
                    {entry.month} - 退貨率 {entry.returnRate.toFixed(1)}%
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">沒有可用的退貨資料。</p>
            )}
          </section>

          {/* Season Recommendation */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">最佳上架季節</h3>
            {seasonRecommendation[selectedGroup]?.length ? (
              <ul className="list-disc list-inside text-gray-300">
                {seasonRecommendation[selectedGroup].map((season) => (
                  <li key={season}>{season}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">沒有季節推薦數據。</p>
            )}
          </section>

          {/* Related Products */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">相關推薦商品</h3>
            {relatedProducts[selectedGroup]?.length ? (
              <ul className="list-disc list-inside text-gray-300">
                {relatedProducts[selectedGroup].map((product) => (
                  <li key={product}>{product}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">沒有推薦商品數據。</p>
            )}
          </section>
        </>
      ) : (
        <p className="text-gray-400 italic mt-8">請先選擇商品群及商品。</p>
      )}
    </div>
  );
}
