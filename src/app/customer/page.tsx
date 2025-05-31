'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Your productsByGroup data structure
const productsByGroup: Record<
  string,
  { id: string; name: string }[]
> = {
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

// Flatten to get productId -> name mapping
const productIdToName: Record<string, string> = {};
Object.values(productsByGroup).forEach(productArray => {
  productArray.forEach(({ id, name }) => {
    productIdToName[id] = name;
  });
});

// Sample customer purchase data using product IDs
const sampleCustomerPurchases: Record<string, string[]> = {
  C001: ['p1', 'p12', 'p3'],   // T恤, 潤膚乳, 充電器
  C002: ['p6', 'p5'],          // 帽子, 牛仔褲
  C003: ['p7', 'p11'],         // 吸塵器, 面膜
};

export default function CustomerPurchasesPage() {
  const [customerId, setCustomerId] = useState('');
  const [purchases, setPurchases] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerId(e.target.value);
  };

  const handleSearch = () => {
    setPurchases(sampleCustomerPurchases[customerId.trim()] || []);
    setSubmitted(true);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-zinc-900 text-white shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">查詢顧客購買紀錄</h2>
          <div className="space-y-2">
            <Label htmlFor="customer-id">輸入顧客 ID</Label>
            <Input
              id="customer-id"
              value={customerId}
              onChange={handleInputChange}
              placeholder="例如: C001"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition-all"
          >
            查詢
          </button>
        </CardContent>
      </Card>

      {submitted && (
        <Card className="bg-zinc-900 text-white shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">購買商品清單：</h3>
            {purchases.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {purchases.map((productId, idx) => {
                  const productName = productIdToName[productId] || '未知商品';
                  return (
                    <li key={idx}>
                      <Link
                        href={`/product-group?product=${encodeURIComponent(productId)}`}
                        className="text-blue-400 hover:underline hover:text-blue-300"
                      >
                        {productName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-400">查無此顧客或無購買紀錄。</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
