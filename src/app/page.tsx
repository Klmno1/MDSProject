'use client'

import { useData } from '@/lib/dataContext';

export default function HomePage() {

  const {products} = useData();

  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold">Welcome to the Product Intelligence Dashboard</h2>
      <p className="mt-4">請從左側選單選擇一個功能以開始使用。</p>
      <div>{products.length}</div>
      <div>{products[0].description.toLowerCase()} {products[0].category}</div>
    </div>
  );
}
