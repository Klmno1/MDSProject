'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';

type Props = {
  products: Product[];
  onSelect: (productId: string) => void;
};

export default function ProductSelector({ products, onSelect }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get all unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Filter products based on selected category
  useEffect(() => {
    if (selectedGroup) {
      const filtered = products.filter(p => p.category === selectedGroup);
      setFilteredProducts(filtered);
      setSelectedProductId(''); // reset selected product
    } else {
      setFilteredProducts([]);
    }
  }, [selectedGroup, products]);

  // Trigger callback when product is selected
  useEffect(() => {
    if (selectedProductId) {
      onSelect(selectedProductId);
    }
  }, [selectedProductId, onSelect]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">商品群分析</h2>
      <p className="text-gray-300">
        請先選擇商品群，再選擇商品。
      </p>

      <div className="flex gap-4 flex-wrap">
        <select
          className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 min-w-[200px]"
          onChange={(e) => setSelectedGroup(e.target.value)}
          value={selectedGroup}
        >
          <option value="" disabled>選擇商品群</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 min-w-[200px]"
          onChange={(e) => setSelectedProductId(e.target.value)}
          value={selectedProductId}
          disabled={!selectedGroup}
        >
          <option value="" disabled>選擇商品</option>
          {filteredProducts.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
