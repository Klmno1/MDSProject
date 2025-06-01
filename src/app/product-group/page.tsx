'use client';

import { useState } from 'react';
import { useData } from '@/lib/dataContext';
import ProductSelector from './ProductSelector';
import CountrySalesChart from './CountrySalesChart';
import MonthlySalesChart from './MonthlySalesChart';
import ReturnStats from './ReturnStats';
import ProductAssociationRules from './ProductAssociationRules';
import TimeAssociationRules from './TimeAssociationRules';
import HolidayAssociationRules from './HolidayAssociationRules';
import SeasonalAssociationRules from './SeasonalAssociationRules';

export default function ProductGroupPage() {
  const { products, sales, productsRules, holidaysRules, seasonsRules } = useData();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const selectedSales = sales.filter(s => s.productId === selectedProductId);
  const selectedProduct = products.find(p => p.productId === selectedProductId);
  const selectedProductName = selectedProduct?.description || '';

  return (
    <div className="p-6 space-y-6">
      <ProductSelector products={products} onSelect={setSelectedProductId} />
      {selectedProductId && (
        <>
          {/* Display selected product name */}
          <h2 className="text-2xl font-bold text-white text-center">
            {selectedProductName}
          </h2>
          <ReturnStats sales={selectedSales} />
          <CountrySalesChart sales={selectedSales} />
          <MonthlySalesChart sales={selectedSales} />
          <ProductAssociationRules
            selectedProductName={selectedProductName}
            productsRules={productsRules}
          />
          {/* <TimeAssociationRules
            selectedProductName={selectedProductName}
            holidaysRules={holidaysRules}
            seasonsRules={seasonsRules}
          /> */}
          <SeasonalAssociationRules
            selectedProductName={selectedProductName}
            seasonsRules={seasonsRules}
          />
          <HolidayAssociationRules
            selectedProductName={selectedProductName}
            holidaysRules={holidaysRules}
          />
        </>
      )}
    </div>
  );
}
