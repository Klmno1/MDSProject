'use client';

import { useState } from 'react';
import { useData } from '@/lib/dataContext';
import ProductSelector from './ProductSelector';
import CountrySalesChart from './CountrySalesChart';
import MonthlySalesChart from './MonthlySalesChart';
import ReturnStats from './ReturnStats';

export default function ProductGroupPage() {
  const { products, sales} = useData();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const selectedSales = sales.filter(s => s.productId === selectedProductId);

  return (
    <div className="p-6 space-y-6">
      <ProductSelector products={products} onSelect={setSelectedProductId} />
      {selectedProductId && (
        <>
          <ReturnStats sales={selectedSales} />
          <CountrySalesChart sales={selectedSales} />
          <MonthlySalesChart sales={selectedSales} />
        </>
      )}
    </div>
  );
}
